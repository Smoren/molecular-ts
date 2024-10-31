import type { InitialConfig, RandomTypesConfig, TypesConfig, WorldConfig } from './config';
import type { SummaryMatrixRowObject, TotalSummaryWeights } from '../types/analysis';

export type GeneticSearchConfig = {
  populationSize: number;
  survivalRate: number;
  crossoverRate: number;
};

export type GeneticSearchReferenceConfig = {
  reference: number[];
  weights: number[];
};

export type RunnerStrategyConfig = {
  worldConfig: WorldConfig;
  checkpoints: number[];
  repeats: number;
  poolSize: number;
};

export type Genome = {
  id: number;
  typesConfig: TypesConfig;
}

export type Population<TGenome> = TGenome[];

export type StrategyConfig<TGenome> = {
  populate: PopulateStrategyInterface<TGenome>;
  runner: RunnerStrategyInterface<TGenome>;
  scoring: ScoringStrategyInterface;
  mutation: MutationStrategyInterface<TGenome>;
  crossover: CrossoverStrategyInterface<TGenome>;
}

export type GeneticSearchByTypesConfigFactoryConfig = {
  geneticSearchMacroConfig: GeneticSearchConfig;
  runnerStrategyConfig: RunnerStrategyConfig;
  mutationStrategyConfig: MutationStrategyConfig;
  populateRandomizeConfig: RandomTypesConfig;
  mutationRandomizeConfig: RandomTypesConfig;
  crossoverRandomizeConfig: RandomTypesConfig;
  referenceTypesConfig: TypesConfig;
  referenceSummaryRowObject?: SummaryMatrixRowObject;
  weights: TotalSummaryWeights;
  worldConfig: WorldConfig;
}

export type RandomSearchByTypesConfigFactoryConfig = {
  geneticSearchMacroConfig: GeneticSearchConfig;
  runnerStrategyConfig: RunnerStrategyConfig;
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

export type MutationStrategyConfig = {
  probability: number;
}

export type GeneticMainConfig = {
  macro: GeneticSearchConfig;
  initial: InitialConfig;
  runner: RunnerStrategyConfig;
  mutation: MutationStrategyConfig;
}

export type SimulationMainConfig = {
  initial: InitialConfig;
  runner: RunnerStrategyConfig;
}

export type GenerationScores = number[];
export type GenerationCallback = (generation: number, result: GenerationScores) => void;

export interface GeneticSearchInterface<TGenome> {
  run(generationsCount: number, afterStep: GenerationCallback): Promise<void>;
  runGenerationStep(): Promise<GenerationScores>;
  getBestGenome(): TGenome;
  getPopulation(): Population<TGenome>;
  setPopulation(population: Population<TGenome>): void;
}

export interface PopulateStrategyInterface<TGenome> {
  populate(size: number): Population<TGenome>;
}

export interface MutationStrategyInterface<TGenome> {
  mutate(id: number, item: TGenome): TGenome;
}

export interface CrossoverStrategyInterface<TGenome> {
  cross(id: number, lhs: TGenome, rhs: TGenome): TGenome;
}

export interface RunnerStrategyInterface<TGenome> {
  run(population: Population<TGenome>): Promise<number[][]>;
}

export interface ScoringStrategyInterface {
  score(results: number[][]): number[];
}
