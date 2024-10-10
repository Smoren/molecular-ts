import type { VectorInterface } from '../math/types';
import type { ClusterInterface } from "./cluster";

export interface BondMapInterface {
  length: number;
  lengthOf(type: number): number;
  has(atom: AtomInterface): boolean;
  add(atom: AtomInterface): void;
  delete(atom: AtomInterface): void;
  update(atom: AtomInterface): void;
  getTypesCountMap(): Record<number, number>;
  getStorage(): Record<number, AtomInterface>;
}

export interface AtomInterface {
  readonly id: number;
  readonly position: VectorInterface;
  readonly speed: VectorInterface;
  readonly bonds: BondMapInterface;
  readonly isTypeChanged: boolean;
  readonly linkDistanceFactors: number[];
  readonly linkElasticFactors: number[];
  type: number;
  newType: number | undefined;
  cluster?: ClusterInterface;
  exportState(): Record<string, unknown>;
}

export interface LinkInterface {
  id: string;
  lhs: AtomInterface;
  rhs: AtomInterface;
  exportState(): number[];
}
