import type {
  LinksPoolInterface,
  LinkManagerInterface,
  RulesHelperInterface,
  GeometryHelperInterface,
  QueueInterface,
  RunningStateInterface,
} from './types/helpers';
import type { AtomInterface, LinkInterface } from './types/atomic';
import type { NumericVector } from './math/types';
import type {
  LinkFactorDistanceConfig,
  LinkFactorDistanceExtendedConfig,
  PhysicModelName,
  ViewModeConfig,
  WorldConfig,
  TypesConfig,
  ViewMode,
} from './types/config';
import type { PhysicModelConstructor, PhysicModelInterface } from './types/interaction';
import { arrayBinaryOperation, arrayUnaryOperation } from './math';
import { Atom, Link } from './atomic';
import { PhysicModelV1 } from './physics/v1';
import { PhysicModelV2 } from './physics/v2';

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

  get length(): number {
    return this.storage.size;
  }

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

  getMassMultiplier(lhs: AtomInterface, rhs: AtomInterface): number {
    return (this.TYPES_CONFIG.RADIUS[rhs.type] ** 3) / (this.TYPES_CONFIG.RADIUS[lhs.type] ** 3);
  }
}

export class Queue<T extends number | number[]> implements QueueInterface<T> {
  private readonly maxSize?: number;
  private storage: T[] = [];

  constructor(maxSize?: number) {
    this.maxSize = maxSize;
  }

  first(): T | undefined {
    return this.storage[0] ?? undefined;
  }

  last(): T | undefined {
    return this.storage[this.storage.length-1] ?? undefined;
  }

  mean(): T | undefined {
    if (this.storage.length === 0) {
      return undefined;
    }

    if (this.storage[0] instanceof Array) {
      const sum = (this.storage as number[][]).reduce(
        (acc, x) => arrayBinaryOperation<number>(acc, x, (a, b) => a + b)
      );
      return arrayUnaryOperation(sum, (x) => x / this.storage.length) as T;
    }

    return (this.storage.reduce((acc, x) => acc + (x as number), 0) / this.storage.length) as T;
  }

  pop(): T | undefined {
    const result = this.storage[0] ?? undefined;
    this.storage = this.storage.slice(1);
    return result;
  }

  push(value: T): void {
    if (this.maxSize !== undefined && this.storage.length === this.maxSize) {
      this.pop();
    }
    this.storage.push(value);
  }
}

export class RunningState implements RunningStateInterface {
  private _isRunning = false;
  private _isRunningConfirmed = false;
  private _isPaused = false;

  get isRunning(): boolean {
    return this._isRunning;
  }

  get isPaused(): boolean {
    return this._isPaused;
  }

  start() {
    if (this._isRunningConfirmed) {
      return;
    }
    this._isRunning = true;
    this._isRunningConfirmed = true;
  }

  async stop() {
    this._isRunning = false;
    await this.waitUntil(() => !this._isRunningConfirmed);
  }

  togglePause() {
    this._isPaused = !this._isPaused;
  }

  confirmStart() {
    this._isRunningConfirmed = true;
  }

  confirmStop() {
    this._isRunningConfirmed = false;
  }

  private async waitUntil(condition: () => boolean) {
    return await new Promise(resolve => {
      const interval = setInterval(() => {
        if (condition()) {
          resolve(null);
          clearInterval(interval);
        }
      }, 0);
    });
  }
}

export const fullCopyObject = <T extends Record<string, any>>(obj: T) => JSON.parse(JSON.stringify(obj)) as T;

let LAST_ATOM_ID = 0;

function nextId(id?: number): number {
  if (id !== undefined) {
    LAST_ATOM_ID = Math.max(id, LAST_ATOM_ID);
    return id;
  }

  return LAST_ATOM_ID++;
}

export function createAtom(type: number, position: NumericVector, speed?: NumericVector, id?: number): AtomInterface {
  return new Atom(nextId(id), type, position, speed);
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

export function createPhysicModel(
  worldConfig: WorldConfig,
  typesConfig: TypesConfig,
): PhysicModelInterface {
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

export function getViewModeConfig(worldConfig: WorldConfig, viewMode?: ViewMode): ViewModeConfig {
  return (viewMode ?? worldConfig.VIEW_MODE) === '3d'
    ? worldConfig.CONFIG_3D
    : worldConfig.CONFIG_2D;
}
