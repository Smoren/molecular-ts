import type { TypesConfig, WorldConfig } from './config';

export type GeneticSearchMacroConfig = {
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

export interface GeneticSearchInterface {
  runGenerationStep(): Promise<[number[], number[]]>;
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

export type StrategyConfig = {
  populate: PopulateStrategyInterface;
  runner: RunnerStrategyInterface;
  mutation: MutationStrategyInterface;
  crossover: CrossoverStrategyInterface;
}
