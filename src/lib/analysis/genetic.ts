import { multi, single, transform } from 'itertools-ts';
import type { GeneticSearchConfig, Population, StrategyConfig } from '../types/genetic';
import { randomizeTypesConfig } from '../config/types';
import { normalizeSummaryMatrix } from '../analysis/helpers';
import { arrayBinaryOperation, arraySum } from '../math';
import { getRandomArrayItem } from '../math/random';

export class GeneticSearch {
  private readonly config: GeneticSearchConfig;
  private readonly strategy: StrategyConfig;
  private population: Population;

  constructor(config: GeneticSearchConfig, strategy: StrategyConfig) {
    this.config = config;
    this.strategy = strategy;
    this.population = this.createPopulation(config.populationSize);
  }

  public async step(): Promise<number[]> {
    const [countToSurvive, countToCrossover, countToMutate] = this.getSizes();

    const results = this.prepareResults(await this.strategy.runner.run(this.population, this.config));
    const [sortedPopulation, sortedErrors] = this.sortPopulation(results);

    const survivedPopulation = sortedPopulation.slice(0, countToSurvive);
    const crossedPopulation = this.crossoverPopulation(survivedPopulation, countToCrossover);
    const mutatedPopulation = this.mutatePopulation(survivedPopulation, countToMutate);

    this.population = [...survivedPopulation, ...crossedPopulation, ...mutatedPopulation];

    return sortedErrors;
  }

  private createPopulation(size: number): Population {
    const population: Population = [];
    for (let i = 0; i < size; i++) {
      population.push({ typesConfig: randomizeTypesConfig(this.config.randomTypesConfig) });
    }
    return population;
  }

  private crossoverPopulation(population: Population, count: number): Population {
    const newPopulation = [];

    for (let i = 0; i < count; i++) {
      const lhs = getRandomArrayItem(population);
      const rhs = getRandomArrayItem(population);

      const crossedGenome = this.strategy.crossover.cross(lhs, rhs, this.config);
      const mutatedGenome = this.strategy.mutation.mutate(crossedGenome, this.config);

      newPopulation.push(mutatedGenome);
    }

    return newPopulation;
  }

  private mutatePopulation(population: Population, count: number): Population {
    const newPopulation = [];

    for (let i = 0; i < count; i++) {
      const genome = getRandomArrayItem(population);
      const mutatedGenome = this.strategy.mutation.mutate(genome, this.config);
      newPopulation.push(mutatedGenome);
    }

    return newPopulation;
  }

  private sortPopulation(results: number[][]): [Population, number[]] {
    const zipped = multi.zip(this.population, results.map((x) => arraySum(x)));
    const sorted = single.sort(zipped, (lhs, rhs) => lhs[1] - rhs[1]);
    return [
      transform.toArray(single.map(sorted, (x) => x[0])),
      transform.toArray(single.map(sorted, (x) => x[1])),
    ];
  }

  private prepareResults(results: number[][]): number[][] {
    return this.weighResults(this.normalizeResults(results));
  }

  private normalizeResults(results: number[][]): number[][] {
    return normalizeSummaryMatrix([...results, this.config.reference], this.config.randomTypesConfig.TYPES_COUNT);
  }

  private weighResults(results: number[][]): number[][] {
    return results.map(
      (result) => arrayBinaryOperation(result, this.config.weights, (x, y) => x * y)
    );
  }

  private getSizes(): number[] {
    const countToSurvive = Math.round(this.config.populationSize * this.config.survivalRate);
    const countToDie = this.config.populationSize - countToSurvive;

    const countToCrossover = Math.round(countToDie * this.config.crossoverRate);
    const countToMutate = countToDie - countToCrossover;

    return [countToSurvive, countToCrossover, countToMutate];
  }
}
