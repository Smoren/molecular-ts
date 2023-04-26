import { AtomInterface } from './atomic';

export interface ClusterInterface extends Iterable<AtomInterface> {
  add(atom: AtomInterface): void;
  remove(atom: AtomInterface): void;
  empty(): boolean;
}

export interface ClusterMapInterface {
  handleAtom(atom: AtomInterface): ClusterInterface;
}

export interface ClusterManagerInterface {
  handleAtom(atom: AtomInterface): Iterable<AtomInterface>;
}
