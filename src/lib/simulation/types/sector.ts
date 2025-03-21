import type { AtomInterface } from './atomic';
import type { NumericVector } from '../../math/types';

export interface SectorInterface extends Iterable<AtomInterface> {
  length: number;
  atoms: Set<AtomInterface>;
  coords: NumericVector;
  add(atom: AtomInterface): void;
  remove(atom: AtomInterface): void;
  empty(): boolean;
}

export interface SectorMapInterface {
  getNeighbourhood(atom: AtomInterface): SectorInterface[];
  countAtoms(): number;
  clear(): void;
  handleAtom(atom: AtomInterface): SectorInterface;
  getSector(sectorCoords: NumericVector): SectorInterface;
  findAtomByCoords(coords: NumericVector, radiusMap: number[], radiusMultiplier: number): AtomInterface | undefined;
}

export interface SectorManagerInterface {
  handleAtom(atom: AtomInterface, callback: (lhs: AtomInterface, rhs: AtomInterface) => void): void;
  countAtoms(): number;
  clear(): void;
  findAtomByCoords(coords: NumericVector, radiusMap: number[], radiusMultiplier: number): AtomInterface | undefined;
}
