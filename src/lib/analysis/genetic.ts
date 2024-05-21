import { multi, single, transform } from 'itertools-ts';
import type { RandomTypesConfig, TypesConfig, WorldConfig } from '../types/config';
import { randomizeTypesConfig } from '../config/types';
import { normalizeSummaryMatrix } from '../analysis/helpers';
import { arrayBinaryOperation, arraySum } from '../math';

type GeneticSearchConfig = {
  populationSize: number;
  survivalRate: number;
  mutationRate: number;
  reference: number[];
  weights: number[];
  worldConfig: WorldConfig;
  randomTypesConfig: RandomTypesConfig;
};

type Genome = {
  typesConfig: TypesConfig;
}

interface MutationStrategy {
  mutate: (item: Genome, config: GeneticSearchConfig) => Genome;
}

interface CrossoverStrategy {
  crossover: (lhs: Genome, rhs: Genome, config: GeneticSearchConfig) => Genome;
}

interface RunnerStrategy {
  run: (population: Population, config: GeneticSearchConfig) => Promise<number[][]>;
}

type StrategyConfig = {
  runner: RunnerStrategy;
  mutation: MutationStrategy;
  crossover: CrossoverStrategy;
}

type Population = Genome[];

export class GeneticSearch {
  private config: GeneticSearchConfig;
  private strategy: StrategyConfig;
  private population: Population;

  constructor(config: GeneticSearchConfig, strategy: StrategyConfig) {
    this.config = config;
    this.strategy = strategy;
    this.population = this.createPopulation(config.populationSize);
  }

  private async step(): Promise<void> {
    const results = await this.strategy.runner.run(this.population, this.config);
    const sortedPopulation = this.handleResults(results);
  }

  private createPopulation(size: number): Population {
    const population: Population = [];
    for (let i = 0; i < size; i++) {
      population.push({ typesConfig: randomizeTypesConfig(this.config.randomTypesConfig) });
    }
    return population;
  }

  private handleResults(results: number[][]): Population {
    const normalized = this.normalizeResults(results);
    const weighted = this.weighResults(normalized);

    return this.rankPopulation(weighted);
  }

  private normalizeResults(results: number[][]): number[][] {
    return normalizeSummaryMatrix([...results, this.config.reference], this.config.randomTypesConfig.TYPES_COUNT);
  }

  private weighResults(results: number[][]): number[][] {
    return results.map(
      (result) => arrayBinaryOperation(result, this.config.weights, (x, y) => x * y)
    );
  }

  private rankPopulation(results: number[][]): Population {
    const zipped = multi.zip(results, this.population);
    const sorted = single.sort(zipped, (lhs, rhs) => arraySum(lhs[0]) - arraySum(rhs[0]));
    return transform.toArray(single.map(sorted, (x) => x[1]));
  }
}
