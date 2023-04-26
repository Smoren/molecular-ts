import { AtomInterface } from './types/atomic';
import { NumericVector } from './vector/types';
import { ClusterInterface, ClusterManagerInterface, ClusterMapInterface } from './types/cluster';

class Cluster implements ClusterInterface {
  atoms: Set<AtomInterface> = new Set<AtomInterface>();

  add(atom: AtomInterface): void {
    this.atoms.add(atom);
  }

  remove(atom: AtomInterface): void {
    this.atoms.delete(atom);
  }

  empty(): boolean {
    return this.atoms.size === 0;
  }

  [Symbol.iterator](): IterableIterator<AtomInterface> {
    return this.atoms.values();
  }
}

// две кластермапы с разными фазами и ребром кластера 2 * max radius
class ClusterMap implements ClusterMapInterface {
  map: Map<string, Cluster> = new Map();
  quantum: number;
  phase: number;

  constructor(quantum: number, phase: number = 0) {
    this.quantum = quantum;
    this.phase = phase;
  }

  handleAtom(atom: AtomInterface): Cluster {
    const actualCluster = this.getCluster(atom.position);
    const currentCluster = atom.cluster;

    if (actualCluster !== currentCluster) {
      if (currentCluster !== undefined) {
        currentCluster.remove(atom);
      }
      actualCluster.add(atom);
      atom.cluster = actualCluster;
    }

    return actualCluster;
  }

  private getCluster(coords: NumericVector): Cluster {
    const clusterCoords = this.getClusterCoords(coords);
    const clusterId = this.getClusterId(clusterCoords);

    if (this.map.has(clusterId)) {
      return this.map.get(clusterId);
    }

    const cluster = new Cluster();
    this.map.set(clusterId, cluster);

    return cluster;
  }

  private getClusterId(clusterCoords: NumericVector) {
    return clusterCoords.join('-');
  }

  private getClusterCoords(coords: NumericVector) {
    const result: NumericVector = new Array<number>(coords.length);
    for (let i=0; i<coords.length; ++i) {
      result[i] = Math.round(coords[i] / this.quantum) + this.phase;
    }
    return result;
  }
}

export class ClusterManager implements ClusterManagerInterface {
  private readonly map1: ClusterMap;
  private readonly map2: ClusterMap;

  constructor(quantum: number) {
    this.map1 = new ClusterMap(quantum, 0);
    this.map2 = new ClusterMap(quantum, quantum / 2);
  }

  handleAtom(atom: AtomInterface): Iterable<AtomInterface> {
    const result: Set<AtomInterface> = new Set();
    for (const neighbour of this.map1.handleAtom(atom)) {
      result.add(neighbour);
    }
    for (const neighbour of this.map2.handleAtom(atom)) {
      result.add(neighbour);
    }
    return result;
  }
}
