import type { AtomInterface } from './types/atomic';
import type { NumericVector } from '../math/types';
import type { SpatialGridCellInterface, SpatialGridManagerManagerInterface, SpatialGridInterface } from './types/spatial';

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

class SpatialGridCell implements SpatialGridCellInterface {
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

class SpatialGrid implements SpatialGridInterface {
  map: Map<number, SpatialGridCell> = new Map();
  quantum: number;
  phase: number;

  constructor(quantum: number, phase: number = 0) {
    this.quantum = quantum;
    this.phase = phase;
  }

  getNeighbourhood(atom: AtomInterface): SpatialGridCellInterface[] {
    const result = [];
    const currentCell = this.handleAtom(atom);
    for (const coords of getNeighboursCoords(currentCell.coords)) {
      const cell = this.getCell(coords);
      result.push(cell);
    }
    return result;
  }

  countAtoms(): number {
    let result = 0;
    for (const [, cell] of this.map) {
      result += cell.length;
    }
    return result;
  }

  clear(): void {
    this.map.clear();
  }

  public handleAtom(atom: AtomInterface): SpatialGridCellInterface {
    const actualCell = this.getCellByAtom(atom);
    const currentCell = atom.spatialGridCell;

    if (actualCell !== currentCell) {
      if (currentCell !== undefined) {
        currentCell.remove(atom);
      }
      actualCell.add(atom);
      atom.spatialGridCell = actualCell;
    }

    return actualCell;
  }

  public getCell(cellCoords: NumericVector): SpatialGridCellInterface {
    const key = cellCoords.length === 3
      ? cellCoords[0] * 10000 + cellCoords[1] * 100000000 + cellCoords[2]
      : cellCoords[0] * 10000 + cellCoords[1];

    if (!this.map.has(key)) {
      this.map.set(key, new SpatialGridCell([...cellCoords]));
    }

    return this.map.get(key) as SpatialGridCell;
  }

  public findAtomByCoords(coords: NumericVector, radiusMap: number[], radiusMultiplier: number): AtomInterface | undefined {
    const cellCoords = this.getCellCoords(coords);
    const cell = this.getCell(cellCoords);
    for (const atom of cell) {
      const dist = atom.position.clone().sub(coords).abs;
      if (dist <= radiusMap[atom.type] * radiusMultiplier) {
        return atom;
      }
    }
    return undefined;
  }

  private getCellByAtom(atom: AtomInterface): SpatialGridCellInterface {
    const cellCoords = this.getCellCoords(atom.position);
    return this.getCell(cellCoords);
  }

  private getCellCoords(coords: NumericVector): NumericVector {
    const result: NumericVector = new Array<number>(coords.length);
    for (let i=0; i<coords.length; ++i) {
      result[i] = Math.round(coords[i] / this.quantum) + this.phase;
    }
    return result;
  }
}

export class SpatialGridManager implements SpatialGridManagerManagerInterface {
  private readonly map: SpatialGrid;

  constructor(quantum: number) {
    this.map = new SpatialGrid(quantum, 0);
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
            const cell = this.map.getCell([i, j, k]);
            for (const neighbour of cell.atoms) {
              callback(atom, neighbour);
            }
          }
        }
      }
    } else if (atom.position.length === 2) {
      const cc = this.map.handleAtom(atom);
      for (let i=cc.coords[0]-1; i<=cc.coords[0]+1; ++i) {
        for (let j=cc.coords[1]-1; j<=cc.coords[1]+1; ++j) {
          const cell = this.map.getCell([i, j]);
          for (const neighbour of cell.atoms) {
            callback(atom, neighbour);
          }
        }
      }
    } else {
      const neighborhood = this.map.getNeighbourhood(atom);
      for (let i=0; i<neighborhood.length; ++i) {
        const cell = neighborhood[i];
        for (const neighbour of cell.atoms) {
          callback(atom, neighbour);
        }
      }
    }
  }

  findAtomByCoords(coords: NumericVector, radiusMap: number[], radiusMultiplier: number): AtomInterface | undefined {
    return this.map.findAtomByCoords(coords, radiusMap, radiusMultiplier);
  }
}
