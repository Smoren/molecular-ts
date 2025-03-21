import type { AtomInterface } from './types/atomic';
import type { NumericVector } from '../math/types';
import type { SectorInterface, SectorManagerInterface, SectorMapInterface } from './types/sector';

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

class Sector implements SectorInterface {
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

class SectorMap implements SectorMapInterface {
  map: Map<number, Sector> = new Map();
  quantum: number;
  phase: number;

  constructor(quantum: number, phase: number = 0) {
    this.quantum = quantum;
    this.phase = phase;
  }

  getNeighbourhood(atom: AtomInterface): SectorInterface[] {
    const result = [];
    const currentSector = this.handleAtom(atom);
    for (const coords of getNeighboursCoords(currentSector.coords)) {
      const sector = this.getSector(coords);
      result.push(sector);
    }
    return result;
  }

  countAtoms(): number {
    let result = 0;
    for (const [, sector] of this.map) {
      result += sector.length;
    }
    return result;
  }

  clear(): void {
    this.map.clear();
  }

  public handleAtom(atom: AtomInterface): SectorInterface {
    const actualSector = this.getSectorByAtom(atom);
    const currentSector = atom.sector;

    if (actualSector !== currentSector) {
      if (currentSector !== undefined) {
        currentSector.remove(atom);
      }
      actualSector.add(atom);
      atom.sector = actualSector;
    }

    return actualSector;
  }

  public getSector(sectorCoords: NumericVector): SectorInterface {
    const key = sectorCoords.length === 3
      ? sectorCoords[0] * 10000 + sectorCoords[1] * 100000000 + sectorCoords[2]
      : sectorCoords[0] * 10000 + sectorCoords[1];

    if (!this.map.has(key)) {
      this.map.set(key, new Sector([...sectorCoords]));
    }

    return this.map.get(key) as Sector;
  }

  public findAtomByCoords(coords: NumericVector, radiusMap: number[], radiusMultiplier: number): AtomInterface | undefined {
    const sectorCoords = this.getSectorCoords(coords);
    const sector = this.getSector(sectorCoords);
    for (const atom of sector) {
      const dist = atom.position.clone().sub(coords).abs;
      if (dist <= radiusMap[atom.type] * radiusMultiplier) {
        return atom;
      }
    }
    return undefined;
  }

  private getSectorByAtom(atom: AtomInterface): SectorInterface {
    const sectorCoords = this.getSectorCoords(atom.position);
    return this.getSector(sectorCoords);
  }

  private getSectorCoords(coords: NumericVector): NumericVector {
    const result: NumericVector = new Array<number>(coords.length);
    for (let i=0; i<coords.length; ++i) {
      result[i] = Math.round(coords[i] / this.quantum) + this.phase;
    }
    return result;
  }
}

export class SectorManager implements SectorManagerInterface {
  private readonly map: SectorMap;

  constructor(quantum: number) {
    this.map = new SectorMap(quantum, 0);
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
            const sector = this.map.getSector([i, j, k]);
            for (const neighbour of sector.atoms) {
              callback(atom, neighbour);
            }
          }
        }
      }
    } else if (atom.position.length === 2) {
      const cc = this.map.handleAtom(atom);
      for (let i=cc.coords[0]-1; i<=cc.coords[0]+1; ++i) {
        for (let j=cc.coords[1]-1; j<=cc.coords[1]+1; ++j) {
          const sector = this.map.getSector([i, j]);
          for (const neighbour of sector.atoms) {
            callback(atom, neighbour);
          }
        }
      }
    } else {
      const neighborhood = this.map.getNeighbourhood(atom);
      for (let i=0; i<neighborhood.length; ++i) {
        const sector = neighborhood[i];
        for (const neighbour of sector.atoms) {
          callback(atom, neighbour);
        }
      }
    }
  }

  findAtomByCoords(coords: NumericVector, radiusMap: number[], radiusMultiplier: number): AtomInterface | undefined {
    return this.map.findAtomByCoords(coords, radiusMap, radiusMultiplier);
  }
}
