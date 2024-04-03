import type {
  LinksPoolInterface,
  LinkManagerInterface,
  RulesHelperInterface,
  GeometryHelperInterface
} from './types/helpers';
import type { AtomInterface, LinkInterface } from './types/atomic';
import type { NumericVector } from './vector/types';
import type {
  LinkFactorDistanceConfig,
  LinkFactorDistanceExtendedConfig,
  PhysicModelName,
  TypesConfig,
  WorldConfig
} from './types/config';
import type { PhysicModelConstructor, PhysicModelInterface } from './types/interaction';
import { Atom, Link } from './atomic';
import { PhysicModelV1 } from './physics/v1';
import { PhysicModelV2 } from './physics/v2';
import { fullCopyObject } from "@/helpers/utils";

class LinkPool implements LinksPoolInterface {
  private storage: LinkInterface[] = [];

  allocate(lhs: AtomInterface, rhs: AtomInterface): LinkInterface {
    if (this.storage.length) {
      const result = this.storage.pop() as LinkInterface;
      result.lhs = lhs;
      result.rhs = rhs;
      return result;
    }
    return new Link(lhs, rhs);
  }

  free(link: LinkInterface): void {
    this.storage.push(link);
  }
}

export class LinkManager implements LinkManagerInterface {
  private storage: Set<LinkInterface> = new Set();
  private pool: LinksPoolInterface = new LinkPool();

  create(lhs: AtomInterface, rhs: AtomInterface): LinkInterface {
    const link = this.pool.allocate(lhs, rhs);
    lhs.bonds.add(rhs);
    rhs.bonds.add(lhs);
    this.storage.add(link);
    return link;
  }

  delete(link: LinkInterface): void {
    link.lhs.bonds.delete(link.rhs);
    link.rhs.bonds.delete(link.lhs);
    this.storage.delete(link);
    this.pool.free(link);
  }

  clear(): void {
    this.storage.clear();
  }

  has(link: LinkInterface): boolean {
    return this.storage.has(link);
  }

  * [Symbol.iterator](): Iterator<LinkInterface> {
    for (const item of this.storage) {
      yield item;
    }
  }
}

export class RulesHelper implements RulesHelperInterface {
  private TYPES_CONFIG: TypesConfig;
  private WORLD_CONFIG: WorldConfig;

  constructor(worldConfig: WorldConfig, typesConfig: TypesConfig) {
    this.TYPES_CONFIG = typesConfig;
    this.WORLD_CONFIG = worldConfig;
  }

  canLink(lhs: AtomInterface, rhs: AtomInterface): boolean {
    return this._canLink(lhs, rhs) && this._canLink(rhs, lhs);
  }

  isLinkRedundant(lhs: AtomInterface, rhs: AtomInterface): boolean {
    return this._isLinkRedundant(lhs, rhs) || this._isLinkRedundant(rhs, lhs);
  }

  private _canLink(lhs: AtomInterface, rhs: AtomInterface): boolean {
    if (lhs.bonds.length >= this.TYPES_CONFIG.LINKS[lhs.type]) {
      return false;
    }
    return lhs.bonds.lengthOf(rhs.type) < this.TYPES_CONFIG.TYPE_LINKS[lhs.type][rhs.type];
  }

  private _isLinkRedundant(lhs: AtomInterface, rhs: AtomInterface): boolean {
    if (lhs.bonds.length > this.TYPES_CONFIG.LINKS[lhs.type]) {
      return true;
    }
    return lhs.bonds.lengthOf(rhs.type) > this.TYPES_CONFIG.TYPE_LINKS[lhs.type][rhs.type];
  }
}

export class GeometryHelper implements GeometryHelperInterface {
  private WORLD_CONFIG: WorldConfig;
  private TYPES_CONFIG: TypesConfig;

  constructor(worldConfig: WorldConfig, typesConfig: TypesConfig) {
    this.WORLD_CONFIG = worldConfig;
    this.TYPES_CONFIG = typesConfig;
  }

  getAtomRadius(atom: AtomInterface): number {
    return this.WORLD_CONFIG.ATOM_RADIUS * this.TYPES_CONFIG.RADIUS[atom.type];
  }

  getAtomsRadiusSum(lhs: AtomInterface, rhs: AtomInterface): number {
    return this.getAtomRadius(lhs) + this.getAtomRadius(rhs);
  }
}

let LAST_ATOM_ID = 0;

export function createAtom(type: number, position: NumericVector): AtomInterface {
  return new Atom(LAST_ATOM_ID++, type, position);
}

export function normalizeFrequencies(weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b);
  return weights.map((x) => x / sum);
}

export function getIndexByFrequencies(frequencies: number[]): number {
  const normFrequencies = normalizeFrequencies(frequencies);
  const rand = Math.random();
  let sum = 0;
  for (let i=0; i<normFrequencies.length; ++i) {
    sum += normFrequencies[i];
    if (rand <= sum) {
      return i;
    }
  }
  return 0;
}

function getRandomColorNumber(): number {
  return Math.round(Math.random()*255);
}

export function getRandomColor(): [number, number, number] {
  let r = getRandomColorNumber();
  let g = getRandomColorNumber();
  let b = getRandomColorNumber();
  const sum = r + g + b;
  if (sum < 256*3 / 2) {
    const delta = Math.round((256*3 / 2 - sum) / (Math.random() + 1));
    [r, g, b] = [r+delta, g+delta, b+delta];
  }
  return [r, g, b];
}

function applyMedian(from: number, until: number, median?: number): [number, number] {
  if (median === undefined) {
    return [from, until];
  }

  if (Math.random() > 0.5) {
    return [median, until];
  }

  return [from, median];
}

export function createRandomInteger([from, until, median]: [number, number, number?]): number {
  [from, until] = applyMedian(from, until, median);
  return Math.round(Math.random() * (until - from) + from);
}

export function createRandomFloat(
  [from, until, median, step]: [number, number, number?, number?],
  precision?: number,
): number {
  [from, until] = applyMedian(from, until, median);

  let result = Math.random() * (until - from) + from;
  if (step !== undefined && step !== 0) {
    result = roundWithStep(result, step);
  }
  if (precision !== undefined) {
    result = Number(result.toFixed(precision));
  }
  return result;
}

export function roundWithStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}

type NumberFactory = ((bounds: [number, number, number?, number?], precision?: number) => number) |
  ((bounds: [number, number, number?], precision?: number) => number);

export function randomizeMatrix(
  count: number,
  bounds: [number, number, number?, number?] | [number, number, number?],
  numberFactory: NumberFactory,
  symmetric: boolean = false,
  precision?: number,
): number[][] {
  const result: number[][] = [];
  for (let i=0; i<count; ++i) {
    result.push([]);
    for (let j=0; j<count; ++j) {
      if (symmetric && i > j) {
        result[i].push(result[j][i]);
      } else {
        result[i].push(numberFactory(bounds as [number, number], precision));
      }
    }
  }
  return result;
}

export function createPhysicModel(
  worldConfig: WorldConfig,
  typesConfig: TypesConfig,
): PhysicModelInterface {
  console.log('createPhysicModel', worldConfig.PHYSIC_MODEL);
  if (worldConfig.PHYSIC_MODEL === undefined) {
    return new PhysicModelV1(worldConfig, typesConfig);
  }

  const map: Record<PhysicModelName, PhysicModelConstructor> = {
    v1: PhysicModelV1,
    v2: PhysicModelV2,
  };

  return new map[worldConfig.PHYSIC_MODEL](worldConfig, typesConfig);
}

export function createDistributedLinkFactorDistance(matrix: LinkFactorDistanceConfig): LinkFactorDistanceExtendedConfig {
  const result: LinkFactorDistanceExtendedConfig = [];
  for (let i=0; i<matrix.length; ++i) {
    const level1: number[][] = [];
    for (let j=0; j<matrix.length; ++j) {
      const level2: number[] = [];
      level2.length = matrix[i].length;
      level2.fill(matrix[i][j]);
      level1.push(level2);
    }
    result.push(level1);
  }
  return result;
}

export function distributeLinkFactorDistance(
  tensor: LinkFactorDistanceExtendedConfig,
  matrix: LinkFactorDistanceConfig,
): void {
  for (let i=0; i<matrix.length; ++i) {
    for (let j=0; j<matrix.length; ++j) {
      tensor[i][j].fill(matrix[i][j])
    }
  }
}
