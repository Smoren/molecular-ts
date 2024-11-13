import type { AtomInterface } from '../types/atomic';
import type {
  Compound,
  CompoundsAnalyzerSummary,
  CompoundsCollectorInterface,
  ExtendedStatSummary,
  StatSummary,
} from './types';
import { createFilledArray, createVector, round } from '../math';
import { createCompoundByAtom } from './factories';

export class CompoundsCollector implements CompoundsCollectorInterface {
  private visited: Set<AtomInterface> = new Set();
  private compounds: Array<Compound> = [];

  public handleAtoms(atoms: Iterable<AtomInterface>): void {
    for (const atom of atoms) {
      this.handleAtom(atom);
    }
  }

  public handleAtom(atom: AtomInterface): void {
    if (this.visited.has(atom)) {
      return;
    }

    const compound = createCompoundByAtom(atom);
    for (const atom of compound) {
      this.visited.add(atom);
    }

    if (compound.size < 2) {
      return;
    }

    this.compounds.push(compound);
  }

  getCompounds(): Array<Compound> {
    return this.compounds;
  }
}

export class CompoundsAnalyzer implements CompoundsAnalyzerSummary {
  private readonly compounds: Array<Compound>;
  private readonly compoundsTypesMap: Array<Compound[]>;
  private readonly typesCount: number;
  private readonly atoms: Array<AtomInterface>;
  private readonly atomsTypesMap: Array<AtomInterface[]>;

  constructor(compounds: Array<Compound>, atoms: Array<AtomInterface>, typesCount: number) {
    this.compounds = compounds;
    this.atoms = atoms;
    this.typesCount = typesCount;
    this.compoundsTypesMap = this.groupCompoundsByTypes();
    this.atomsTypesMap = this.groupAtomsByTypes();
  }

  get length(): number {
    return this.compounds.length;
  }

  get lengthByTypes(): number[] {
    return this.compoundsTypesMap.map((compounds) => compounds.length);
  }

  get itemLengthSummary(): StatSummary {
    return this.toStatSummary(this.getItemLengthSummary(this.compounds, this.atoms));
  }

  get itemLengthByTypesSummary(): ExtendedStatSummary[] {
    return this.compoundsTypesMap.map((compounds, type) => this.getItemLengthSummary(
      compounds,
      this.atomsTypesMap[type],
    ));
  }

  get itemSpeedSummary(): StatSummary {
    return this.toStatSummary(this.getItemSpeedSummary(this.compounds));
  }

  get itemSpeedByTypesSummary(): ExtendedStatSummary[] {
    return this.compoundsTypesMap.map((compounds, type) => this.getItemSpeedSummary(
      compounds,
    ));
  }

  get itemDensitySummary(): StatSummary {
    return this.toStatSummary(this.getItemDensitySummary(this.compounds));
  }

  get summary(): CompoundsAnalyzerSummary {
    return {
      length: this.length,
      lengthByTypes: this.lengthByTypes,
      itemLengthSummary: this.itemLengthSummary,
      itemSpeedSummary: this.itemSpeedSummary,
      itemDensitySummary: this.itemDensitySummary,
    };
  }

  private groupCompoundsByTypes(): Array<Compound[]> {
    const typesMap: Record<number, Compound[]> = {};

    for (const compound of this.compounds) {
      const types = new Set([...compound].map((atom) => atom.type));
      for (const type of types) {
        if (typesMap[type] === undefined) {
          typesMap[type] = [];
        }
        typesMap[type].push(compound);
      }
    }

    return this.convertMapToArray(typesMap);
  }

  private groupAtomsByTypes(): Array<AtomInterface[]> {
    const typesMap: Record<number, AtomInterface[]> = {};

    for (const atom of this.atoms) {
      if (typesMap[atom.type] === undefined) {
        typesMap[atom.type] = [];
      }
      typesMap[atom.type].push(atom);
    }

    return this.convertMapToArray(typesMap);
  }

  private getItemLengthSummary(compounds: Array<Compound>, atoms: Array<AtomInterface>): ExtendedStatSummary {
    const sizes = compounds.map((compound) => compound.size);
    return this.extractSummary(sizes, atoms.length);
  }

  private getItemSpeedSummary(compounds: Array<Compound>): ExtendedStatSummary {
    const speeds = compounds.map((compound) => this.getCompoundSpeed(compound));
    return this.extractSummary(speeds);
  }

  private getItemDensitySummary(compounds: Array<Compound>): ExtendedStatSummary {
    const densities = compounds.map((compound) => this.getCompoundBoundsDensity(compound));
    return this.extractSummary(densities);
  }

  private extractSummary(values: number[], totalLength: number = 0): ExtendedStatSummary {
    values = values.sort((a, b) => a - b);

    const result = values
      .reduce((acc, x) => {
        return [
          acc[0] < x ? acc[0] : x, // min
          acc[1] > x ? acc[1] : x, // max
          acc[2] + x,              // mean
        ];
      }, [Infinity, -Infinity, 0]) as [number, number, number];

    result[0] = values.length > 0 ? result[0] : 0;
    result[1] = values.length > 0 ? result[1] : 0;
    result[2] = values.length > 0 ? result[2] / values.length : 0;

    const median = values.length > 0
      ? values[Math.floor(values.length / 2)]
      : 0;

    const p25 = values.length > 0
      ? values[Math.floor(values.length * 0.25)]
      : 0;

    const p75 = values.length > 0
      ? values[Math.floor(values.length * 0.75)]
      : 0;

    const frequency = totalLength > 0
      ? round(values.length / totalLength, 4)
      : 0;

    return {
      size: values.length,
      frequency: frequency,
      min: result[0],
      max: result[1],
      mean: result[2],
      p25,
      median,
      p75,
    }
  }

  private getCompoundSpeed(compound: Compound): number {
    if (compound.size === 0) {
      return 0;
    }

    const speedVectors = [...compound].map((atom) => atom.speed);
    const zeroVector = createVector(createFilledArray(speedVectors[0].length, 0));
    return speedVectors.reduce((acc, vector) => acc.add(vector), zeroVector).div(compound.size).abs;
  }

  private getCompoundBoundsDensity(compound: Compound): number {
    const bounds = this.getCompoundBoundsSize(compound);
    return compound.size / bounds.reduce((acc, coord) => acc * coord, 1);
  }

  private getCompoundBoundsSize(compound: Compound): number[] {
    const coords: number[][] = [];
    for (const atom of compound) {
      for (let i=0; i<atom.position.length; ++i) {
        if (coords[i] === undefined) {
          coords[i] = [];
        }
        coords[i].push(atom.position[i]);
      }
    }
    return coords.map((coords) => Math.max(...coords) - Math.min(...coords));
  }

  private convertMapToArray<T>(map: Record<number, T[]>): Array<T[]> {
    const types = Object.keys(map).map((key) => Number(key));
    const result: Array<T[]> = Array.from({ length: this.typesCount }, () => []);

    for (const type of types) {
      result[type] = map[type];
    }

    return result;
  }

  private toStatSummary(summary: ExtendedStatSummary): StatSummary {
    return {
      min: summary.min,
      max: summary.max,
      mean: summary.mean,
      p25: summary.p25,
      median: summary.median,
      p75: summary.p75,
    }
  }
}
