import type { AtomInterface } from './types/atomic';
import type { NumericVector } from './math/types';
import type { ClusterInterface, ClusterManagerInterface, ClusterMapInterface } from './types/cluster';

function incPoint(aPoint: NumericVector, aCenterPoint: NumericVector, aDim: number): boolean {
  aPoint[aDim]++;
  if (aPoint[aDim] > aCenterPoint[aDim] + 1) {
    if (aDim == aPoint.length - 1) {
      return false;
    }
    aPoint[aDim] = aCenterPoint[aDim] - 1;
    return incPoint(aPoint, aCenterPoint, aDim + 1);
  }
  return true;
}

function getNeighboursCoords(coords: NumericVector): Iterable<NumericVector> {
  const curPoint: NumericVector = new Array<number>(coords.length);
  for (let i=0; i<curPoint.length; ++i) {
    curPoint[i] = coords[i] - 1;
  }
  const result = [];
  do {
    result.push([...curPoint]);
  } while (incPoint(curPoint, coords, 0));
  return result;
}

class Cluster implements ClusterInterface {
  atoms: Set<AtomInterface> = new Set<AtomInterface>();
  coords: NumericVector;

  constructor(coords: NumericVector) {
    this.coords = coords;
  }

  get length(): number {
    return this.atoms.size;
  }

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

class ClusterMap implements ClusterMapInterface {
  map: Cluster[][] | Cluster[][][] = [];
  quantum: number;
  phase: number;

  constructor(quantum: number, phase: number = 0) {
    this.quantum = quantum;
    this.phase = phase;
  }

  getNeighbourhood(atom: AtomInterface): ClusterInterface[] {
    const result = [];
    const currentCluster = this.handleAtom(atom);
    for (const coords of getNeighboursCoords(currentCluster.coords)) {
      const cluster = this.getCluster(coords);
      result.push(cluster);
    }
    return result;
  }

  countAtoms(): number {
    let result = 0;
    for (const [, cluster] of this.map) {
      result += cluster.length;
    }
    return result;
  }

  clear(): void {
    this.map = [];
  }

  public handleAtom(atom: AtomInterface): ClusterInterface {
    const actualCluster = this.getClusterByAtom(atom);
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

  public getCluster(clusterCoords: NumericVector): ClusterInterface {
    let result: Array<unknown> = this.map;

    for (let i=0; i<clusterCoords.length-1; ++i) {
      const coord = clusterCoords[i];
      if (!result.hasOwnProperty(coord)) {
        result[coord] = [];
      }

      result = result[coord] as Array<unknown>;
    }

    const lastCoord = clusterCoords[clusterCoords.length-1];

    if (!result.hasOwnProperty(lastCoord)) {
      result[lastCoord] = new Cluster([...clusterCoords]);
    }

    return result[lastCoord] as Cluster;
  }

  private getClusterByAtom(atom: AtomInterface): ClusterInterface {
    const clusterCoords = this.getClusterCoords(atom.position);
    return this.getCluster(clusterCoords);
  }

  private getClusterCoords(coords: NumericVector): NumericVector {
    const result: NumericVector = new Array<number>(coords.length);
    for (let i=0; i<coords.length; ++i) {
      result[i] = Math.round(coords[i] / this.quantum) + this.phase;
    }
    return result;
  }
}

export class ClusterManager implements ClusterManagerInterface {
  private readonly map: ClusterMap;

  constructor(quantum: number) {
    this.map = new ClusterMap(quantum, 0);
  }

  countAtoms(): number {
    return this.map.countAtoms();
  }

  clear(): void {
    this.map.clear();
  }

  handleAtom(atom: AtomInterface, callback: (lhs: AtomInterface, rhs: AtomInterface) => void): void {
    if (atom.position.length === 3) {
      const cc = this.map.handleAtom(atom);
      for (let i=cc.coords[0]-1; i<=cc.coords[0]+1; ++i) {
        for (let j=cc.coords[1]-1; j<=cc.coords[1]+1; ++j) {
          for (let k=cc.coords[2]-1; k<=cc.coords[2]+1; ++k) {
            const cluster = this.map.getCluster([i, j, k]);
            for (const neighbour of cluster.atoms) {
              callback(atom, neighbour);
            }
          }
        }
      }
    } else if (atom.position.length === 2) {
      const cc = this.map.handleAtom(atom);
      for (let i=cc.coords[0]-1; i<=cc.coords[0]+1; ++i) {
        for (let j=cc.coords[1]-1; j<=cc.coords[1]+1; ++j) {
          const cluster = this.map.getCluster([i, j]);
          for (const neighbour of cluster.atoms) {
            callback(atom, neighbour);
          }
        }
      }
    } else {
      const neighborhood = this.map.getNeighbourhood(atom);
      for (let i=0; i<neighborhood.length; ++i) {
        const cluster = neighborhood[i];
        for (const neighbour of cluster.atoms) {
          callback(atom, neighbour);
        }
      }
    }
  }
}
