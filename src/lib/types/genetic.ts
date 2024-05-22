import type { RandomTypesConfig, TypesConfig, WorldConfig } from './config';

export type GeneticSearchConfig = {
  populationSize: number;
  survivalRate: number;
  crossoverRate: number;
  mutationProbability: number;
  reference: number[];
  weights: number[];
  worldConfig: WorldConfig;
  randomTypesConfig: RandomTypesConfig;
  simulationStepsCount: number[];
};

export type Genome = {
  typesConfig: TypesConfig;
}

export type Population = Genome[];

export interface GeneticSearchInterface {
  runGenerationStep(): Promise<number[]>;
}

export interface MutationStrategyInterface {
  mutate: (item: Genome, probability: number, config: GeneticSearchConfig) => Genome;
}

export interface CrossoverStrategyInterface {
  cross: (lhs: Genome, rhs: Genome, config: GeneticSearchConfig) => Genome;
}

export interface RunnerStrategyInterface {
  run: (population: Population, config: GeneticSearchConfig) => Promise<number[][]>;
}

export type StrategyConfig = {
  runner: RunnerStrategyInterface;
  mutation: MutationStrategyInterface;
  crossover: CrossoverStrategyInterface;
}
