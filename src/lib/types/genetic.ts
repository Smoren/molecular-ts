import type { TypesConfig, WorldConfig } from './config';

export type GeneticSearchConfig = {
  populationSize: number;
  survivalRate: number;
  crossoverRate: number;
  mutationProbability: number;
  reference: number[];
  weights: number[];
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
  mutate: (id: number, item: Genome, probability: number, config: GeneticSearchConfig) => Genome;
}

export interface CrossoverStrategyInterface {
  cross: (id: number, lhs: Genome, rhs: Genome, config: GeneticSearchConfig) => Genome;
}

export interface RunnerStrategyInterface {
  run: (population: Population, config: GeneticSearchConfig) => Promise<number[][]>;
}

export type StrategyConfig = {
  populate: PopulateStrategyInterface;
  runner: RunnerStrategyInterface;
  mutation: MutationStrategyInterface;
  crossover: CrossoverStrategyInterface;
}
