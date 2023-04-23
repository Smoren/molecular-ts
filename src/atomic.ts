import { AtomInterface, BondMapInterface, LinkInterface } from './types/atomic';
import { NumericVector, VectorInterface } from './vector/types';
import { toVector } from './vector';

class BondMap implements BondMapInterface {
  private storage: Record<number, AtomInterface> = {};
  private count: number = 0;

  get length(): number {
    return this.count;
  }

  lengthOf(type: number): number {
    let result = 0;
    for (const id in this.storage) { // eslint-disable-line guard-for-in
      result += +((this.storage[id].type) === type);
    }
    return result;
  }

  has(atom: AtomInterface): boolean {
    return this.storage[atom.id] !== undefined;
  }

  add(atom: AtomInterface): void {
    this.storage[atom.id] = atom;
    this.count++;
  }

  delete(atom: AtomInterface): void {
    delete this.storage[atom.id];
    this.count--;
  }
}

export class Atom implements AtomInterface {
  readonly id: number;
  readonly type: number;
  readonly position: VectorInterface;
  readonly speed: VectorInterface;
  readonly bonds: BondMapInterface;

  constructor(id: number, type: number, position: NumericVector) {
    this.id = id;
    this.type = type;
    this.position = toVector(position);
    this.speed = toVector([0, 0]);
    this.bonds = new BondMap();
  }
}

export class Link implements LinkInterface {
  id: number;
  lhs: AtomInterface;
  rhs: AtomInterface;

  constructor(id: number, lhs: AtomInterface, rhs: AtomInterface) {
    this.id = id;
    this.lhs = lhs;
    this.rhs = rhs;
  }
}
