import type { AtomInterface, LinkInterface } from '../simulation/types/atomic';
import type { QueueInterface } from '../simulation/types/utils';
import type { TypesConfig, WorldConfig } from '../config/types';
import type { NumericVector } from "../math/types";
import type { GraphInterface } from "../graph/types";

export type WorldSummary<T> = {
  ATOMS_COUNT: T;
  ATOMS_MEAN_SPEED: T;
  ATOMS_TYPE_COUNT: T;
  ATOMS_TYPE_MEAN_COUNT: T;
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
  ATOMS_TYPE_MEAN_COUNT: QueueInterface<T>;
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
export type CompoundsClusterGrade = {
  size: number;
  difference: number;
  symmetry: number;
  vertexesBounds: [number, number];
  edgesBounds: [number, number];
  typesCountBounds: [number, number],
  typesCountAverage: number,
  vertexTypesVector: NumericVector;
  edgeTypesVector: NumericVector;
  typesVector: NumericVector;
  radius: number;
  speedBounds: [number, number];
  speedAverage: number;
  graphExample: GraphInterface;
}

export type CompoundsClusterizationSummary = {
  clusters: CompoundsClusterGrade[];
  polymers: PolymerCollectionSummary;
  inputCount: number;
  filteredCount: number;
  clusteredCount: number;
  notClusteredCount: number;
  clusteredTypesVector: NumericVector;
}

export type CompoundsClusterScore = {
  compoundVertexesCount: number;
  compoundEdgesCount: number;
  compoundUniqueTypesCount: number;
  compoundSymmetryScore: number;
  compoundRadius: number;
  compoundSpeed: number;
}

export type PolymerSummary = {
  confidenceScore: number;
  monomerTypesVector: number[];
  monomerUniqueTypesCount: number;
  monomerVertexesCount: number;
  polymerVertexesCount: number;
  polymerSize: number;
}

export type PolymerCollectionSummary = {
  count: number;
  averageConfidenceScore: number;
  averageMonomerVertexesCount: number;
  averageMonomerUniqueTypesCount: number;
  averagePolymerVertexesCount: number;
  averagePolymerSize: number;
  maxMonomerVertexesCount: number;
  maxPolymerSize: number;
  polymersGrades: PolymerSummary[];
}

export type CompoundsClusterizationScore = {
  maxClusterSize: number;
  averageClusterSize: number;
  clustersCount: number;
  relativeClusteredCompounds: number;
  relativeFilteredCompounds: number;
  relativeCompoundedAtoms: number;
  relativeClusteredAtoms: number;
  averageAtomLinks: number;
  newLinksCreatedPerStepScore: number;
  atomsFrequencyScore: number;

  maxClusteredCompoundVertexesCount: number;
  averageClusteredCompoundVertexesCount: number;
  averageClusteredCompoundEdgesCount: number;
  averageClusteredCompoundUniqueTypesCount: number;
  averageClusteredCompoundSymmetryScore: number;
  averageClusteredCompoundRadius: number;
  averageClusteredCompoundSpeed: number;

  relativePolymersCount: number;
  maxPolymerSize: number;
  averagePolymerConfidenceScore: number;
  averageMonomerVertexesCount: number;
  averageMonomerUniqueTypesCount: number;
  averagePolymerVertexesCount: number;
  averagePolymerSize: number;
}
