import type { InitialConfig, RandomTypesConfig, TypesConfig, WorldConfig } from './config';
import type { SummaryMatrixRowObject, TotalSummaryWeights } from '../types/analysis';
import type { SimulationTaskConfig } from "@/lib/genetic/multiprocessing";

export type BaseGenome = {
  id: number;
}

export type GeneticSearchConfig = {
  populationSize: number;
  survivalRate: number;
  crossoverRate: number;
};

export type MutationStrategyConfig = {
  probability: number;
}

export type GradeGenerationTask<TTaskConfig> = (data: TTaskConfig) => Promise<number[]>;

export type RunnerStrategyConfig<TTaskConfig> = {
  poolSize: number;
  task: GradeGenerationTask<TTaskConfig>;
}

export type Population<TGenome extends BaseGenome> = TGenome[];

export type StrategyConfig<TGenome extends BaseGenome> = {
  populate: PopulateStrategyInterface<TGenome>;
  runner: RunnerStrategyInterface<TGenome>;
  scoring: ScoringStrategyInterface;
  mutation: MutationStrategyInterface<TGenome>;
  crossover: CrossoverStrategyInterface<TGenome>;
}

export type GeneticSearchReferenceConfig = {
  reference: number[];
  weights: number[];
};

export type GenerationScores = number[];
export type GenerationCallback = (generation: number, result: GenerationScores) => void;

export interface GeneticSearchInterface<TGenome extends BaseGenome> {
  run(generationsCount: number, afterStep: GenerationCallback): Promise<void>;
  runGenerationStep(): Promise<GenerationScores>;
  getBestGenome(): TGenome;
  getPopulation(): Population<TGenome>;
  setPopulation(population: Population<TGenome>): void;
}

export interface PopulateStrategyInterface<TGenome extends BaseGenome> {
  populate(size: number): Population<TGenome>;
}

export interface MutationStrategyInterface<TGenome extends BaseGenome> {
  mutate(id: number, item: TGenome): TGenome;
}

export interface CrossoverStrategyInterface<TGenome extends BaseGenome> {
  cross(id: number, lhs: TGenome, rhs: TGenome): TGenome;
}

export interface RunnerStrategyInterface<TGenome extends BaseGenome> {
  run(population: Population<TGenome>): Promise<number[][]>;
}

export interface ScoringStrategyInterface {
  score(results: number[][]): number[];
}

export type SimulationRunnerStrategyConfig = RunnerStrategyConfig<SimulationTaskConfig> & {
  worldConfig: WorldConfig;
  checkpoints: number[];
  repeats: number;
};

export type SimulationGenome = {
  id: number;
  typesConfig: TypesConfig;
}

export type SimulationGeneticSearchByTypesConfigFactoryConfig = {
  geneticSearchMacroConfig: GeneticSearchConfig;
  runnerStrategyConfig: SimulationRunnerStrategyConfig;
  mutationStrategyConfig: MutationStrategyConfig;
  populateRandomizeConfig: RandomTypesConfig;
  mutationRandomizeConfig: RandomTypesConfig;
  crossoverRandomizeConfig: RandomTypesConfig;
  referenceTypesConfig: TypesConfig;
  referenceSummaryRowObject?: SummaryMatrixRowObject;
  weights: TotalSummaryWeights;
  worldConfig: WorldConfig;
}

export type SimulationRandomSearchByTypesConfigFactoryConfig = {
  geneticSearchMacroConfig: GeneticSearchConfig;
  runnerStrategyConfig: SimulationRunnerStrategyConfig;
  mutationStrategyConfig: MutationStrategyConfig;
  populateRandomizeConfig: RandomTypesConfig;
  mutationRandomizeConfig: RandomTypesConfig;
  crossoverRandomizeConfig: RandomTypesConfig;
  sourceTypesConfig: TypesConfig;
  referenceTypesConfig: TypesConfig;
  referenceSummaryRowObject?: SummaryMatrixRowObject;
  weights: TotalSummaryWeights;
  worldConfig: WorldConfig;
}

export type SimulationGeneticMainConfig = {
  macro: GeneticSearchConfig;
  initial: InitialConfig;
  runner: SimulationRunnerStrategyConfig;
  mutation: MutationStrategyConfig;
}

export type SimulationMainConfig = {
  initial: InitialConfig;
  runner: SimulationRunnerStrategyConfig;
}
