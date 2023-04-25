import { AtomInterface } from './types/atomic';

class Cluster implements Iterable<AtomInterface> {
  id: string;
  atoms: Set<AtomInterface>;
  neighbours: Set<Cluster>;

  add(atom: AtomInterface): void {
    this.atoms.add(atom);
  }

  remove(atom: AtomInterface): void {
    this.atoms.delete(atom);
  }

  [Symbol.iterator](): IterableIterator<AtomInterface> {
    return this.atoms.values();
  }
}

export class ClusterMap {
  map: Map<string, Cluster> = new Map();
  quantum: number;

  constructor(quantum: number) {
    this.quantum = quantum;
  }
}
