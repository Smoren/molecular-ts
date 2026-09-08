import type { AtomInterface } from './types/atomic';
import type { NumericVector } from '../math/types';
import type { SpatialGridCellInterface, SpatialGridManagerManagerInterface, SpatialGridInterface } from './types/spatial';

// Множители числового ключа клетки в Map: ключ = i * STRIDE + j (2D)
// или i * STRIDE + j * STRIDE^2 + k (3D). STRIDE задаёт максимум клеток
// по одной оси (координаты клетки за пределами [0, STRIDE) дадут коллизии).
const CELL_KEY_STRIDE = 10000;
const CELL_KEY_STRIDE_SQUARED = CELL_KEY_STRIDE * CELL_KEY_STRIDE;

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
  // Массив вместо Set: итерация в горячем цикле быстрее. Порядок обхода
  // идентичен Set: push добавляет в конец, splice сохраняет относительный
  // порядок остальных элементов.
  atoms: AtomInterface[] = [];
  coords: NumericVector;

  constructor(coords: NumericVector) {
    this.coords = coords;
  }

  get length(): number {
    return this.atoms.length;
  }

  add(atom: AtomInterface): void {
    this.atoms.push(atom);
  }

  remove(atom: AtomInterface): void {
    const index = this.atoms.indexOf(atom);
    if (index >= 0) {
      this.atoms.splice(index, 1);
    }
  }

  empty(): boolean {
    return this.atoms.length === 0;
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
      ? cellCoords[0] * CELL_KEY_STRIDE + cellCoords[1] * CELL_KEY_STRIDE_SQUARED + cellCoords[2]
      : cellCoords[0] * CELL_KEY_STRIDE + cellCoords[1];

    return this.getCellByKey(key, cellCoords);
  }

  // Единственный поиск в Map вместо has+get; координатный массив создаётся
  // только при первом появлении клетки
  private getCellByKey(key: number, cellCoords: NumericVector): SpatialGridCell {
    let cell = this.map.get(key);
    if (cell === undefined) {
      cell = new SpatialGridCell([...cellCoords]);
      this.map.set(key, cell);
    }
    return cell;
  }

  // Возвращает существующую клетку по координатам без создания новой.
  // Используется в горячем цикле обхода соседей, чтобы не аллоцировать
  // координатные массивы и не порождать пустые клетки.
  public getExistingCell2d(i: number, j: number): SpatialGridCellInterface | undefined {
    return this.map.get(i * CELL_KEY_STRIDE + j);
  }

  public getExistingCell3d(i: number, j: number, k: number): SpatialGridCellInterface | undefined {
    return this.map.get(i * CELL_KEY_STRIDE + j * CELL_KEY_STRIDE_SQUARED + k);
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

  private getCellByAtom(atom: AtomInterface): SpatialGridCell {
    // Горячий путь (2 вызова на атом на шаг): вычисляем ключ напрямую из
    // позиции, без аллокации координатного массива и без двойного поиска.
    // Формула ключа и округление идентичны прежним getCellCoords/getCell.
    const pos = atom.position;
    const q = this.quantum;
    const phase = this.phase;
    const i = Math.round(pos[0] / q) + phase;
    const j = Math.round(pos[1] / q) + phase;

    if (pos.length === 3) {
      const k = Math.round(pos[2] / q) + phase;
      const key = i * CELL_KEY_STRIDE + j * CELL_KEY_STRIDE_SQUARED + k;
      let cell = this.map.get(key);
      if (cell === undefined) {
        cell = new SpatialGridCell([i, j, k]);
        this.map.set(key, cell);
      }
      return cell;
    }

    const key = i * CELL_KEY_STRIDE + j;
    let cell = this.map.get(key);
    if (cell === undefined) {
      cell = new SpatialGridCell([i, j]);
      this.map.set(key, cell);
    }
    return cell;
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
            const cell = this.map.getExistingCell3d(i, j, k);
            if (cell === undefined) {
              continue;
            }
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
          const cell = this.map.getExistingCell2d(i, j);
          if (cell === undefined) {
            continue;
          }
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
