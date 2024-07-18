import type {
  LinksPoolInterface,
  LinkManagerInterface,
  RulesHelperInterface,
  GeometryHelperInterface,
  QueueInterface,
  RunningStateInterface,
} from '../types/utils';
import type { AtomInterface, LinkInterface } from '../types/atomic';
import type {
  WorldConfig,
  TypesConfig,
} from '../types/config';
import { arrayBinaryOperation, arrayUnaryOperation } from '../math';
import { Link } from '../atomic';

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

  handleTransform(lhs: AtomInterface, rhs: AtomInterface): void {
    this._handleTransform(lhs, rhs);
    this._handleTransform(rhs, lhs);
  }

  private _canLink(lhs: AtomInterface, rhs: AtomInterface): boolean {
    const weight = this.TYPES_CONFIG.TYPE_LINK_WEIGHTS[lhs.type][rhs.type];
    if (this.TYPES_CONFIG.LINKS[lhs.type] - this._countWeightedBonds(lhs) < weight) {
      return false;
    }
    return lhs.bonds.lengthOf(rhs.type) < this.TYPES_CONFIG.TYPE_LINKS[lhs.type][rhs.type];
  }

  private _isLinkRedundant(lhs: AtomInterface, rhs: AtomInterface): boolean {
    if (this._countWeightedBonds(lhs) > this.TYPES_CONFIG.LINKS[lhs.type]) {
      return true;
    }
    return lhs.bonds.lengthOf(rhs.type) > this.TYPES_CONFIG.TYPE_LINKS[lhs.type][rhs.type];
  }

  private _handleTransform(lhs: AtomInterface, rhs: AtomInterface): void {
    if (!this.TYPES_CONFIG.TRANSFORMATION[lhs.type] || this.TYPES_CONFIG.TRANSFORMATION[lhs.type][rhs.type] === undefined) {
      return;
    }
    lhs.newType = this.TYPES_CONFIG.TRANSFORMATION[lhs.type][rhs.type];
    const bondMap = lhs.bonds.getStorage();
    for (const i in bondMap) {
      bondMap[i].bonds.update(lhs);
    }
  }

  private _countWeightedBonds(atom: AtomInterface): number {
    let result = 0;
    const typesCountMap = atom.bonds.getTypesCountMap();
    for (const type in typesCountMap) {
      result += this.TYPES_CONFIG.TYPE_LINK_WEIGHTS[atom.type][type] * typesCountMap[type];
    }
    return result;
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
