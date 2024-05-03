import type { AtomInterface, LinkInterface } from '../types/atomic';
import type { Compound, CompoundsAnalyzerInterface, CompoundsCollectorInterface } from '../types/analysis';

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

export class CompoundsAnalyzer implements CompoundsAnalyzerInterface {
  private readonly compounds: Array<Compound>;
  private readonly typesMap: Array<Compound[]>;

  constructor(compounds: Array<Compound>) {
    this.compounds = compounds;
    this.typesMap = this.groupCompoundsByTypes();
  }

  get length(): number {
    return this.compounds.length;
  }

  get lengthByTypes(): number[] {
    return this.typesMap.map((compounds) => compounds.length);
  }

  get itemLengthSummary(): [number, number, number, number, number] {
    return this.getItemLengthSummary(this.compounds);
  }

  get itemLengthByTypesSummary(): [number, number, number, number, number][] {
    return this.typesMap.map((compounds) => this.getItemLengthSummary(compounds));
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

    const types = Object.keys(typesMap).map((key) => Number(key));
    const maxType = Math.max(...types);
    const result: Array<Compound[]> = Array.from({ length: maxType+1 }, () => []);

    for (const type of types) {
      result[type] = typesMap[type];
    }

    return result;
  }

  private getItemLengthSummary(compounds: Array<Compound>): [number, number, number, number, number] {
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

    result[2] = result[2] / compounds.length;

    const median = sizes.length > 0
      ? sizes[Math.floor(sizes.length / 2)]
      : 0;

    return [sizes.length, ...result, median];
  }
}
