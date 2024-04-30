import type { AtomInterface } from './atomic';
import type { NumericVector } from '../math/types';

export interface ClusterInterface extends Iterable<AtomInterface> {
  length: number;
  atoms: Set<AtomInterface>;
  coords: NumericVector;
  add(atom: AtomInterface): void;
  remove(atom: AtomInterface): void;
  empty(): boolean;
}

export interface ClusterMapInterface {
  getNeighbourhood(atom: AtomInterface): ClusterInterface[];
  countAtoms(): number;
  handleAtom(atom: AtomInterface): ClusterInterface;
  getCluster(clusterCoords: NumericVector): ClusterInterface;
}

export interface ClusterManagerInterface {
  handleAtom(atom: AtomInterface, callback: (lhs: AtomInterface, rhs: AtomInterface) => void): void;
  countAtoms(): number;
  clear(): void;
}
