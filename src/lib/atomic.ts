import type {
  AtomInterface,
  BondMapInterface,
  LinkInterface,
} from './types/atomic';
import type { NumericVector, VectorInterface } from './math/types';
import type { ClusterInterface } from './types/cluster';
import { toVector } from './math';

class BondMap implements BondMapInterface {
  private storage: Record<number, AtomInterface> = {};
  private typesCount: Record<number, number> = {};
  private count: number = 0;

  get length(): number {
    return this.count;
  }

  lengthOf(type: number): number {
    return this.typesCount[type] ?? 0;
  }

  has(atom: AtomInterface): boolean {
    return this.storage[atom.id] !== undefined;
  }

  add(atom: AtomInterface): void {
    this.storage[atom.id] = atom;
    if (this.typesCount[atom.type] === undefined) {
      this.typesCount[atom.type] = 0;
    }
    this.typesCount[atom.type]++;
    this.count++;
  }

  delete(atom: AtomInterface): void {
    delete this.storage[atom.id];
    this.typesCount[atom.type]--;
    this.count--;
  }
}

export class Atom implements AtomInterface {
  readonly id: number;
  readonly type: number;
  readonly position: VectorInterface;
  readonly speed: VectorInterface;
  readonly bonds: BondMapInterface;
  readonly linkDistanceFactor: number;
  readonly linkDistanceFactors: number[];
  cluster?: ClusterInterface;

  constructor(id: number, type: number, position: NumericVector, speed?: NumericVector) {
    this.id = id;
    this.type = type;
    this.position = toVector(position);
    this.speed = speed ? toVector(speed) : toVector(new Array<number>(position.length).fill(0));
    this.bonds = new BondMap();
    this.linkDistanceFactor = 1;
    this.linkDistanceFactors = [];
  }

  exportState(): Record<string, unknown> {
    return {
      id: this.id,
      type: this.type,
      position: [...this.position],
      speed: [...this.speed],
    };
  }
}

export class Link implements LinkInterface {
  lhs: AtomInterface;
  rhs: AtomInterface;

  constructor(lhs: AtomInterface, rhs: AtomInterface) {
    this.lhs = lhs;
    this.rhs = rhs;
  }

  exportState(): number[] {
    return [this.lhs.id, this.rhs.id];
  }
}
