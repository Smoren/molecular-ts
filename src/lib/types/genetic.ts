import type { RandomTypesConfig, TypesConfig, WorldConfig } from './config';
import type { TotalSummaryWeights } from '../types/analysis';

export type GeneticSearchMacroConfig = {
  generationsCount: number;
  populationSize: number;
  survivalRate: number;
  crossoverRate: number;
  mutationProbability: number;
};

export type GeneticSearchInputConfig = {
  reference: number[];
  weights: number[];
};

export type GeneticSearchConfig = GeneticSearchMacroConfig & GeneticSearchInputConfig;

export type RunnerStrategyConfig = {
  worldConfig: WorldConfig;
  checkpoints: number[];
  repeats: number,
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

export type GeneticSearchByTypesFactoryConfig = {
  geneticSearchMacroConfig: GeneticSearchMacroConfig;
  runnerStrategyConfig: RunnerStrategyConfig;
  populateRandomizeConfig: RandomTypesConfig;
  mutationRandomizeConfig: RandomTypesConfig;
  crossoverRandomizeConfig: RandomTypesConfig;
  referenceTypesConfig: TypesConfig;
  weights: TotalSummaryWeights;
  worldConfig: WorldConfig;
}

export interface GeneticSearchInterface {
  runGenerationStep(): Promise<[number[], number[]]>;
  getBestGenome(): Genome;
}

export interface PopulateStrategyInterface {
  populate: (size: number) => Population;
}

export interface MutationStrategyInterface {
  mutate: (id: number, item: Genome, probability: number) => Genome;
}

export interface CrossoverStrategyInterface {
  cross: (id: number, lhs: Genome, rhs: Genome) => Genome;
}

export interface RunnerStrategyInterface {
  run: (population: Population) => Promise<number[][]>;
}
