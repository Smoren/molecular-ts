import type { AtomInterface, LinkInterface } from '../types/atomic';

export class CompoundsCollector {
  private atomCompoundsMap: Map<AtomInterface, number> = new Map();
  private compounds: Array<Set<AtomInterface>> = [];

  public handLinks(links: LinkInterface[]): void {
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
  private readonly compounds: Array<Set<AtomInterface>>;
  private readonly typesMap: Array<Set<AtomInterface>[]>;

  constructor(compounds: Array<Set<AtomInterface>>) {
    this.compounds = compounds;
    this.typesMap = this.groupCompoundsByTypes();
  }

  get length(): number {
    return this.compounds.length;
  }

  get lengthByTypes(): number[] {
    return this.typesMap.map((compounds) => compounds.length);
  }

  get itemLengthSummary(): [number, number, number, number] {
    return this.getItemLengthSummary(this.compounds);
  }

  get itemLengthByTypesSummary(): [number, number, number, number][] {
    return this.typesMap.map((compounds) => this.getItemLengthSummary(compounds));
  }

  private groupCompoundsByTypes(): Array<Set<AtomInterface>[]> {
    const typesMap: Record<number, Set<AtomInterface>[]> = {};

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
    const result: Array<Set<AtomInterface>[]> = Array.from({ length: maxType+1 }, () => []);

    for (const type of types) {
      result[type] = typesMap[type];
    }

    return result;
  }

  private getItemLengthSummary(compounds: Array<Set<AtomInterface>>): [number, number, number, number] {
    const result = compounds
      .map((compound) => compound.size)
      .reduce((acc, x) => {
        return [
          acc[0] + 1,
          acc[1] < x ? acc[1] : x,
          acc[2] > x ? acc[2] : x,
          acc[3] + x,
        ];
      }, [0, Infinity, -Infinity, 0]) as [number, number, number, number];

    result[3] = result[3] / compounds.length;
    return result;
  }
}
