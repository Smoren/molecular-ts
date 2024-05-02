import type { AtomInterface, LinkInterface } from '@/lib/types/atomic';

export type Compound = Set<AtomInterface>;

export interface CompoundsCollectorInterface {
  handleLinks(links: Iterable<LinkInterface>): void;
  handleLink(link: LinkInterface): void;
  getCompounds(): Array<Compound>;
}

export interface CompoundsAnalyzerInterface {
  length: number;
  lengthByTypes: number[];
  itemLengthSummary: [number, number, number, number];
  itemLengthByTypesSummary: [number, number, number, number][];
}
