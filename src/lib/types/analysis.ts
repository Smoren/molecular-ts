import type { AtomInterface, LinkInterface } from '../types/atomic';
import type { QueueInterface } from '../types/helpers';
import type { TypesConfig, WorldConfig } from '../types/config';

export type Summary<T> = {
  ATOMS_COUNT: T;
  ATOMS_MEAN_SPEED: T;
  ATOMS_TYPE_COUNT: T;
  ATOMS_TYPE_MEAN_SPEED: T;
  ATOMS_TYPE_LINKS_COUNT: T;
  ATOMS_TYPE_LINKS_MEAN_COUNT: T;
  LINKS_COUNT: T;
  STEP_DURATION: T;
  STEP_FREQUENCY: T,
}

export type SummaryAttr = keyof Summary<unknown>;

export interface StepSummaryManagerInterface<T> {
  readonly summary: Summary<T>;
  readonly buffer: Summary<T>;
  readonly typesCount: number;
  init(typesCount: number): void;
  save(): void;
}

export type QueueSummary<T> = {
  ATOMS_COUNT: QueueInterface<T>;
  ATOMS_TYPE_COUNT: QueueInterface<T>;
  ATOMS_MEAN_SPEED: QueueInterface<T>;
  ATOMS_TYPE_MEAN_SPEED: QueueInterface<T>;
  ATOMS_TYPE_LINKS_COUNT: QueueInterface<T>;
  ATOMS_TYPE_LINKS_MEAN_COUNT: QueueInterface<T>
  LINKS_COUNT: QueueInterface<T>;
  STEP_DURATION: QueueInterface<T>;
  STEP_FREQUENCY: QueueInterface<T>,
}

export interface QueueSummaryManagerInterface<T> {
  readonly summary: QueueSummary<T>;
  push(step: Summary<T>): void;
  mean(): Summary<T>;
}

export interface SummaryManagerInterface {
  readonly summary: Summary<number[]>;
  readonly step: number;
  startStep(typesConfig: TypesConfig): void;
  finishStep(): void;
  noticeAtom(atom: AtomInterface, worldConfig: WorldConfig): void;
  noticeLink(link: LinkInterface, worldConfig: WorldConfig): void;
}

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

export type CompoundsAnalyzerSummary = {
  length: number;
  lengthByTypes: number[];
  itemLengthSummary: CompoundsSummary;
  itemLengthByTypesSummary: CompoundsSummary[];
}
