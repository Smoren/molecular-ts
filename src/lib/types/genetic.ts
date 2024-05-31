import type { InitialConfig, RandomTypesConfig, TypesConfig, WorldConfig } from './config';
import type { SummaryMatrixRowObject, TotalSummaryWeights } from '../types/analysis';

export type GeneticSearchMacroConfig = {
  populationSize: number;
  survivalRate: number;
  crossoverRate: number;
};

export type GeneticSearchInputConfig = {
  reference: number[];
  weights: number[];
};

export type GeneticSearchConfig = GeneticSearchMacroConfig & GeneticSearchInputConfig;

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

export type Population = Genome[];

export type StrategyConfig = {
  populate: PopulateStrategyInterface;
  runner: RunnerStrategyInterface;
  mutation: MutationStrategyInterface;
  crossover: CrossoverStrategyInterface;
}

export type GeneticSearchByTypesConfigFactoryConfig = {
  geneticSearchMacroConfig: GeneticSearchMacroConfig;
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
  geneticSearchMacroConfig: GeneticSearchMacroConfig;
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
  macro: GeneticSearchMacroConfig;
  initial: InitialConfig;
  runner: RunnerStrategyConfig;
  mutation: MutationStrategyConfig;
}

export type SimulationMainConfig = {
  initial: InitialConfig;
  runner: RunnerStrategyConfig;
}

export type GenerationResult = [number[], number[]];
export type GenerationCallback = (generation: number, result: GenerationResult) => void;

export interface GeneticSearchInterface {
  run(generationsCount: number, afterStep: GenerationCallback): Promise<void>;
  runGenerationStep(): Promise<GenerationResult>;
  getBestGenome(): Genome;
  getPopulation(): Population;
  setPopulation(population: Population): void;
}

export interface PopulateStrategyInterface {
  populate: (size: number) => Population;
}

export interface MutationStrategyInterface {
  mutate: (id: number, item: Genome) => Genome;
}

export interface CrossoverStrategyInterface {
  cross: (id: number, lhs: Genome, rhs: Genome) => Genome;
}

export interface RunnerStrategyInterface {
  run: (population: Population) => Promise<number[][]>;
}
