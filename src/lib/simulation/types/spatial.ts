import type { AtomInterface } from './atomic';
import type { NumericVector } from '../../math/types';

export interface SpatialGridCellInterface extends Iterable<AtomInterface> {
  length: number;
  // Массив вместо Set: итерация в горячем цикле быстрее, а порядок обхода
  // идентичен Set (push в конец / splice сохраняет относительный порядок)
  atoms: AtomInterface[];
  coords: NumericVector;
  add(atom: AtomInterface): void;
  remove(atom: AtomInterface): void;
  empty(): boolean;
}

export interface SpatialGridInterface {
  getNeighbourhood(atom: AtomInterface): SpatialGridCellInterface[];
  countAtoms(): number;
  clear(): void;
  handleAtom(atom: AtomInterface): SpatialGridCellInterface;
  getCell(cellCoords: NumericVector): SpatialGridCellInterface;
  findAtomByCoords(coords: NumericVector, radiusMap: number[], radiusMultiplier: number): AtomInterface | undefined;
}

export interface SpatialGridManagerManagerInterface {
  handleAtom(atom: AtomInterface, callback: (lhs: AtomInterface, rhs: AtomInterface) => void): void;
  countAtoms(): number;
  clear(): void;
  findAtomByCoords(coords: NumericVector, radiusMap: number[], radiusMultiplier: number): AtomInterface | undefined;
}
