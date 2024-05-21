import type { RandomTypesConfig, TypesConfig, WorldConfig } from './config';

export type GeneticSearchConfig = {
  populationSize: number;
  survivalRate: number;
  crossoverRate: number;
  crossoverMutationProbability: number;
  cloneMutationProbability: number;
  reference: number[];
  weights: number[];
  worldConfig: WorldConfig;
  randomTypesConfig: RandomTypesConfig;
};

export type Genome = {
  typesConfig: TypesConfig;
}

export type Population = Genome[];

export interface MutationStrategy {
  mutate: (item: Genome, probability: number, config: GeneticSearchConfig) => Genome;
}

export interface CrossoverStrategy {
  cross: (lhs: Genome, rhs: Genome, config: GeneticSearchConfig) => Genome;
}

export interface RunnerStrategy {
  run: (population: Population, config: GeneticSearchConfig) => Promise<number[][]>;
}

export type StrategyConfig = {
  runner: RunnerStrategy;
  mutation: MutationStrategy;
  crossover: CrossoverStrategy;
}
