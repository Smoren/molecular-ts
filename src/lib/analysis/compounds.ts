import type { AtomInterface, LinkInterface } from '../types/atomic';
import type {
  Compound,
  CompoundsAnalyzerSummary,
  CompoundsCollectorInterface,
  StatSummary,
} from '../types/analysis';
import { createFilledArray, createVector, round } from '../math';

export class CompoundsCollector implements CompoundsCollectorInterface {
  private atomCompoundsMap: Map<AtomInterface, number> = new Map();
  private compounds: Array<Compound> = [];

  public handleLinks(links: Iterable<LinkInterface>): void {
    for (const link of links) {
      this.handleLink(link);
    }
  }

  public handleLink(link: LinkInterface): void {
    const compoundId = this.getCompoundId(link);

    this.atomCompoundsMap.set(link.lhs, compoundId);
    this.atomCompoundsMap.set(link.rhs, compoundId);

    this.compounds[compoundId].add(link.lhs);
    this.compounds[compoundId].add(link.rhs);
  }

  getCompounds(): Array<Compound> {
    return this.compounds;
  }

  private getCompoundId(link: LinkInterface): number {
    if (this.atomCompoundsMap.has(link.lhs)) {
      return this.atomCompoundsMap.get(link.lhs) as number;
    }

    if (this.atomCompoundsMap.has(link.rhs)) {
      return this.atomCompoundsMap.get(link.rhs) as number;
    }

    const id = this.getNextId();
    this.compounds.push(new Set());

    return id;
  }

  private getNextId(): number {
    return this.compounds.length;
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

  get size(): number {
    return this.compounds.length;
  }

  get sizeByTypes(): number[] {
    return this.compoundsTypesMap.map((compounds) => compounds.length);
  }

  get itemLengthSummary(): StatSummary {
    return this.getItemLengthSummary(this.compounds, this.atoms);
  }

  get itemLengthByTypesSummary(): StatSummary[] {
    return this.compoundsTypesMap.map((compounds, type) => this.getItemLengthSummary(
      compounds,
      this.atomsTypesMap[type],
    ));
  }

  get itemSpeedSummary(): StatSummary {
    return this.getItemSpeedSummary(this.compounds);
  }

  get itemSpeedByTypesSummary(): StatSummary[] {
    return this.compoundsTypesMap.map((compounds, type) => this.getItemSpeedSummary(
      compounds,
    ));
  }

  get summary(): CompoundsAnalyzerSummary {
    return {
      size: this.size,
      sizeByTypes: this.sizeByTypes,
      itemLengthSummary: this.itemLengthSummary,
      itemLengthByTypesSummary: this.itemLengthByTypesSummary,
      itemSpeedSummary: this.itemSpeedSummary,
      itemSpeedByTypesSummary: this.itemSpeedByTypesSummary,
    }
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

  private getItemLengthSummary(compounds: Array<Compound>, atoms: Array<AtomInterface>): StatSummary {
    const sizes = compounds.map((compound) => compound.size);
    return this.extractSummary(sizes, atoms.length);
  }

  private getItemSpeedSummary(compounds: Array<Compound>): StatSummary {
    const speeds = compounds.map((compound) => this.getCompoundSpeed(compound));
    return this.extractSummary(speeds);
  }

  private extractSummary(values: number[], totalLength: number = 0): StatSummary {
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

    const frequency = totalLength > 0
      ? round(values.length / totalLength, 4)
      : 0;

    return {
      size: values.length,
      frequency: frequency,
      min: result[0],
      max: result[1],
      mean: result[2],
      median,
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

  private convertMapToArray<T>(map: Record<number, T[]>): Array<T[]> {
    const types = Object.keys(map).map((key) => Number(key));
    const result: Array<T[]> = Array.from({ length: this.typesCount }, () => []);

    for (const type of types) {
      result[type] = map[type];
    }

    return result;
  }
}
