import { VectorInterface } from '../vector/types';

export interface BondMapInterface {
  length: number;
  lengthOf(type: number): number;
  has(atom: AtomInterface): boolean;
  add(atom: AtomInterface): void;
  delete(atom: AtomInterface): void;
}

export interface AtomInterface {
  readonly id: number;
  readonly type: number;
  readonly position: VectorInterface;
  readonly speed: VectorInterface;
  readonly bonds: BondMapInterface;
}

export interface LinkInterface {
  id: number;
  lhs: AtomInterface;
  rhs: AtomInterface;
}
