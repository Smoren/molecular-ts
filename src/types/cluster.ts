import { AtomInterface } from './atomic';
import { NumericVector } from '../vector/types';

export interface ClusterInterface extends Iterable<AtomInterface> {
  length: number;
  coords: NumericVector;
  add(atom: AtomInterface): void;
  remove(atom: AtomInterface): void;
  empty(): boolean;
}

export interface ClusterMapInterface {
  getNeighbourhood(atom: AtomInterface): Iterable<ClusterInterface>;
  countAtoms(): number;
}

export interface ClusterManagerInterface {
  handleAtom(atom: AtomInterface): Iterable<AtomInterface>;
  countAtoms(): number;
}
