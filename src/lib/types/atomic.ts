import type { VectorInterface } from '../math/types';
import type { ClusterInterface } from "./cluster";

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
  linkDistanceFactor: number;
  linkDistanceFactors: number[];
  cluster?: ClusterInterface;
  exportState(): Record<string, unknown>;
}

export interface LinkInterface {
  id: string;
  lhs: AtomInterface;
  rhs: AtomInterface;
  exportState(): number[];
}
