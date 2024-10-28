import type { AtomInterface, LinkInterface } from '../types/atomic';
import type { QueueInterface } from './utils';
import type { TypesConfig, WorldConfig } from '../types/config';

export type WorldSummary<T> = {
  ATOMS_COUNT: T;
  ATOMS_MEAN_SPEED: T;
  ATOMS_TYPE_COUNT: T;
  ATOMS_TYPE_MEAN_SPEED: T;
  ATOMS_TYPE_LINKS_COUNT: T;
  ATOMS_TYPE_LINKS_MEAN_COUNT: T;
  LINKS_COUNT: T;
  LINKS_CREATED: T;
  LINKS_DELETED: T;
  LINKS_CREATED_MEAN: T;
  LINKS_DELETED_MEAN: T;
  LINKS_TYPE_CREATED: T;
  LINKS_TYPE_DELETED: T;
  LINKS_TYPE_CREATED_MEAN: T;
  LINKS_TYPE_DELETED_MEAN: T;
  STEP_DURATION: T;
  STEP_FREQUENCY: T,
}

export type SummaryAttr = keyof WorldSummary<unknown>;

export interface StepSummaryManagerInterface<T> {
  readonly summary: WorldSummary<T>;
  readonly buffer: WorldSummary<T>;
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
  LINKS_CREATED: QueueInterface<T>;
  LINKS_DELETED: QueueInterface<T>;
  LINKS_CREATED_MEAN: QueueInterface<T>;
  LINKS_DELETED_MEAN: QueueInterface<T>;
  LINKS_TYPE_CREATED: QueueInterface<T>;
  LINKS_TYPE_DELETED: QueueInterface<T>;
  LINKS_TYPE_CREATED_MEAN: QueueInterface<T>;
  LINKS_TYPE_DELETED_MEAN: QueueInterface<T>;
  STEP_DURATION: QueueInterface<T>;
  STEP_FREQUENCY: QueueInterface<T>,
}

export interface QueueSummaryManagerInterface<T> {
  readonly summary: QueueSummary<T>;
  push(step: WorldSummary<T>): void;
  mean(): WorldSummary<T>;
}

export interface SummaryManagerInterface {
  readonly summary: WorldSummary<number[]>;
  readonly step: number;
  startStep(typesConfig: TypesConfig): void;
  finishStep(): void;
  noticeAtom(atom: AtomInterface, worldConfig: WorldConfig): void;
  noticeLink(link: LinkInterface, worldConfig: WorldConfig): void;
  noticeLinkCreated(link: LinkInterface, worldConfig: WorldConfig): void;
  noticeLinkDeleted(link: LinkInterface, worldConfig: WorldConfig): void;
}

export type Compound = Set<AtomInterface>;

export const STAT_SUMMARY_ARRAY_SIZE = 6;

export type StatSummary = {
  min: number;
  max: number;
  mean: number;
  p25: number;
  median: number;
  p75: number;
}

export type ExtendedStatSummary = {
  size: number;
  frequency: number;
} & StatSummary;

export interface CompoundsCollectorInterface {
  handleAtoms(atoms: Iterable<AtomInterface>): void;
  handleAtom(atom: AtomInterface): void;
  getCompounds(): Array<Compound>;
}

export type CompoundsAnalyzerSummary = {
  length: number;
  lengthByTypes: number[];
  itemLengthSummary: StatSummary;
  itemSpeedSummary: StatSummary;
  itemDensitySummary: StatSummary;
}

export type TotalSummary = {
  WORLD: WorldSummary<number[]>;
  COMPOUNDS: CompoundsAnalyzerSummary;
}

export type TotalSummaryWeights = {
  ATOMS_MEAN_SPEED: number;
  ATOMS_TYPE_MEAN_SPEED: number;
  ATOMS_TYPE_LINKS_MEAN_COUNT: number;
  LINKS_CREATED_MEAN: number;
  LINKS_DELETED_MEAN: number;
  LINKS_TYPE_CREATED_MEAN: number;
  LINKS_TYPE_DELETED_MEAN: number;
  COMPOUNDS_PER_ATOM: number;
  COMPOUNDS_PER_ATOM_BY_TYPES: number;
  COMPOUND_LENGTH_SUMMARY: StatSummary;
  COMPOUND_SPEED_SUMMARY: StatSummary;
  COMPOUND_DENSITY_SUMMARY: StatSummary;
}

export type SummaryMatrixRowObject = {
  atomsMeanSpeed: number;
  atomTypeMeanSpeed: number[];
  atomTypeLinksMeanCount: number[];
  linksCreatedMean: number;
  linksDeletedMean: number;
  linksTypeCreatedMean: number[];
  linksTypeDeletedMean: number[];
  compoundsPerAtom: number;
  compoundsPerAtomByTypes: number[];
  compoundLengthSummary: StatSummary;
  compoundSpeedSummary: StatSummary;
  compoundDensitySummary: StatSummary;
}
