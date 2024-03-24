import type { LinksPoolInterface, LinkManagerInterface, RulesHelperInterface } from './types/helpers';
import type { AtomInterface, LinkInterface } from './types/atomic';
import type { NumericVector } from './vector/types';
import type { TypesConfig, WorldConfig } from './types/config';
import { Atom, Link } from './atomic';

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

  constructor(typesConfig: TypesConfig, worldConfig: WorldConfig) {
    this.TYPES_CONFIG = typesConfig;
    this.WORLD_CONFIG = worldConfig;
  }

  canLink(lhs: AtomInterface, rhs: AtomInterface): boolean {
    return this._canLink(lhs, rhs) && this._canLink(rhs, lhs);
  }

  isLinkRedundant(lhs: AtomInterface, rhs: AtomInterface): boolean {
    return this._isLinkRedundant(lhs, rhs) || this._isLinkRedundant(rhs, lhs);
  }

  getGravityForce(lhs: AtomInterface, rhs: AtomInterface, dist2: number): number {
    let multiplier: number;

    if (dist2 < this.getAtomsRadiusSum() ** 2) {
      multiplier = -this.WORLD_CONFIG.BOUNCE_FORCE_MULTIPLIER;
    } else if (!lhs.bonds.has(rhs)) {
      multiplier = this.WORLD_CONFIG.GRAVITY_FORCE_MULTIPLIER * this.TYPES_CONFIG.GRAVITY[lhs.type][rhs.type];
    } else {
      multiplier = this.WORLD_CONFIG.GRAVITY_FORCE_MULTIPLIER * this.TYPES_CONFIG.LINK_GRAVITY[lhs.type][rhs.type];
    }

    const result = multiplier * this.WORLD_CONFIG.SPEED / dist2;

    if (Math.abs(result) > this.WORLD_CONFIG.MAX_FORCE) {
      return Math.sign(result) * this.WORLD_CONFIG.MAX_FORCE;
    }

    return result;
  }

  getLinkForce(): number {
    const result = Math.min(this.WORLD_CONFIG.LINK_FORCE_MULTIPLIER * this.WORLD_CONFIG.SPEED);

    if (Math.abs(result) > this.WORLD_CONFIG.MAX_FORCE) {
      return Math.sign(result) * this.WORLD_CONFIG.MAX_FORCE;
    }

    return result;
  }

  getAtomsRadiusSum(): number {
    return this.WORLD_CONFIG.ATOM_RADIUS * 2;
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

let LAST_ATOM_ID = 0;

export function createAtom(type: number, position: NumericVector) {
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

export function createRandomInteger([from, until]: [number, number]): number {
  return Math.round(Math.random() * (until - from)) + from;
}

export function createRandomFloat([from, until]: [number, number], precision?: number): number {
  const result = Math.random() * (until - from) + from;
  if (precision !== undefined) {
    return Number(result.toFixed(precision));
  }
  return result;
}
