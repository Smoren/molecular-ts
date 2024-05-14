import type { AtomInterface, LinkInterface } from '../types/atomic';
import type {
  Compound,
  CompoundsAnalyzerSummary,
  CompoundsCollectorInterface,
  CompoundsSummary,
} from '../types/analysis';
import { round } from '../math';

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
  private readonly atoms: Array<AtomInterface>;
  private readonly atomsTypesMap: Array<AtomInterface[]>;

  constructor(compounds: Array<Compound>, atoms: Array<AtomInterface>) {
    this.compounds = compounds;
    this.atoms = atoms;
    this.compoundsTypesMap = this.groupCompoundsByTypes();
    this.atomsTypesMap = this.groupAtomsByTypes();
  }

  get size(): number {
    return this.compounds.length;
  }

  get sizeByTypes(): number[] {
    return this.compoundsTypesMap.map((compounds) => compounds.length);
  }

  get itemLengthSummary(): CompoundsSummary {
    return this.getItemLengthSummary(this.compounds, this.atoms);
  }

  get itemLengthByTypesSummary(): CompoundsSummary[] {
    return this.compoundsTypesMap.map((compounds, type) => this.getItemLengthSummary(
      compounds,
      this.atomsTypesMap[type],
    ));
  }

  get summary(): CompoundsAnalyzerSummary {
    return {
      size: this.size,
      sizeByTypes: this.sizeByTypes,
      itemLengthSummary: this.itemLengthSummary,
      itemLengthByTypesSummary: this.itemLengthByTypesSummary,
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

  private getItemLengthSummary(compounds: Array<Compound>, atoms: Array<AtomInterface>): CompoundsSummary {
    const sizes = compounds
      .map((compound) => compound.size)
      .sort((a, b) => a - b);

    const result = sizes
      .reduce((acc, x) => {
        return [
          acc[0] < x ? acc[0] : x, // min
          acc[1] > x ? acc[1] : x, // max
          acc[2] + x,              // mean
        ];
      }, [Infinity, -Infinity, 0]) as [number, number, number];

    result[2] = sizes.length > 0
      ? result[2] / compounds.length
      : 0;

    const median = sizes.length > 0
      ? sizes[Math.floor(sizes.length / 2)]
      : 0;

    return {
      size: compounds.length,
      frequency: round(compounds.length / atoms.length, 4),
      min: result[0],
      max: result[1],
      mean: result[2],
      median,
    }
  }

  private convertMapToArray<T>(map: Record<number, T[]>): Array<T[]> {
    const types = Object.keys(map).map((key) => Number(key));
    const maxType = Math.max(...types);
    const result: Array<T[]> = Array.from({ length: maxType+1 }, () => []);

    for (const type of types) {
      result[type] = map[type];
    }

    return result;
  }
}
