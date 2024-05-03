import type { AtomInterface, LinkInterface } from '../types/atomic';

export type Compound = Set<AtomInterface>;

export type CompoundsSummary = {
  size: number;
  frequency: number;
  min: number;
  max: number;
  mean: number;
  median: number;
}

export interface CompoundsCollectorInterface {
  handleLinks(links: Iterable<LinkInterface>): void;
  handleLink(link: LinkInterface): void;
  getCompounds(): Array<Compound>;
}

export interface CompoundsAnalyzerInterface {
  length: number;
  lengthByTypes: number[];
  itemLengthSummary: CompoundsSummary;
  itemLengthByTypesSummary: CompoundsSummary[];
}
