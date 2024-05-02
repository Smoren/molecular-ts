import type { AtomInterface, LinkInterface } from '../types/atomic';

export class CompoundsCollector {
  private atomCompoundsMap: Map<AtomInterface, number> = new Map();
  private compounds: Array<Set<AtomInterface>> = [];

  public handleLink(link: LinkInterface): void {
    const compoundId = this.getCompoundId(link);

    this.atomCompoundsMap.set(link.lhs, compoundId);
    this.atomCompoundsMap.set(link.rhs, compoundId);

    this.compounds[compoundId].add(link.lhs);
    this.compounds[compoundId].add(link.rhs);
  }

  getCompounds(): Array<Set<AtomInterface>> {
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

export class CompoundsAnalyzer {
  private compounds: Array<Set<AtomInterface>> = [];

  constructor(compounds: Array<Set<AtomInterface>>) {
    this.compounds = compounds;
  }

  get length(): number {
    return this.compounds.length;
  }

  get itemLengthSummary(): [number, number, number] {
    return this.getItemLengthSummary(this.compounds);
  }

  get itemLengthByTypesSummary(): [number, number, number][] {
    const types = new Set<number>(
      this.compounds
        .map((atoms) => [...atoms].map((atom) => atom.type))
        .reduce((acc, x) => [...acc, ...x], [])
    );
    return [
      // TODO
    ]
  }

  private getItemLengthSummary(compounds: Array<Set<AtomInterface>>): [number, number, number] {
    const result = compounds
      .map((set) => set.size)
      .reduce((acc, x) => {
        return [
          acc[0] < x ? acc[0] : x,
          acc[1] > x ? acc[1] : x,
          acc[2] + x,
        ];
      }, [Infinity, -Infinity, 0]) as [number, number, number];

    result[2] = result[2] / this.compounds.length;
    return result;
  }
}
