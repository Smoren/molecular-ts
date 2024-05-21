import { multi, single, transform } from 'itertools-ts';
import { Pool } from 'multiprocess-pool';
import type {
  GeneticSearchConfig,
  Genome,
  Population,
  RunnerStrategyInterface,
  StrategyConfig,
} from '../types/genetic';
import { simulationTask, type SimulationTaskConfig } from "./multiprocessing";
import { normalizeSummaryMatrix } from './helpers';
import { randomizeTypesConfig } from '../config/types';
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

  public async generationStep(): Promise<number[]> {
    const [countToSurvive, countToCross, countToClone] = this.getSizes();

    const results = await this.strategy.runner.run(this.population, this.config);
    const losses = this.calcLosses(results);
    const sortedPopulation = this.sortPopulation(losses);

    const survivedPopulation = sortedPopulation.slice(0, countToSurvive);
    const crossedPopulation = this.crossoverPopulation(survivedPopulation, countToCross);
    const mutatedPopulation = this.clonePopulation(survivedPopulation, countToClone);

    this.population = [...survivedPopulation, ...crossedPopulation, ...mutatedPopulation];

    return losses;
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
      const mutatedGenome = this.strategy.mutation.mutate(crossedGenome, this.config.crossoverMutationProbability, this.config);

      newPopulation.push(mutatedGenome);
    }

    return newPopulation;
  }

  private clonePopulation(population: Population, count: number): Population {
    const newPopulation = [];

    for (let i = 0; i < count; i++) {
      const genome = getRandomArrayItem(population);
      const mutatedGenome = this.strategy.mutation.mutate(genome, this.config.cloneMutationProbability, this.config);
      newPopulation.push(mutatedGenome);
    }

    return newPopulation;
  }

  private sortPopulation(losses: number[]): Population {
    const zipped = multi.zip(this.population, losses);
    const sorted = single.sort(zipped, (lhs, rhs) => lhs[1] - rhs[1]);
    return transform.toArray(single.map(sorted, (x) => x[0]));
  }

  private calcLosses(results: number[][]): number[] {
    const normalized = this.normalizeResults(results);
    const weighed = this.weighResults(normalized);
    const compared = this.compareWithReference(weighed);

    return compared.map((x) => arraySum(x));
  }

  private normalizeResults(results: number[][]): number[][] {
    return normalizeSummaryMatrix([...results, this.config.reference], this.config.randomTypesConfig.TYPES_COUNT);
  }

  private weighResults(results: number[][]): number[][] {
    return results.map(
      (result) => arrayBinaryOperation(result, this.config.weights, (x, y) => x * y)
    );
  }

  private compareWithReference(results: number[][]): number[][] {
      return results.map((result) => arrayBinaryOperation(
        result,
        this.config.reference,
        (res, ref) => Math.abs(res - ref)),
      );
  }

  private getSizes(): number[] {
    const countToSurvive = Math.round(this.config.populationSize * this.config.survivalRate);
    const countToDie = this.config.populationSize - countToSurvive;

    const countToCross = Math.round(countToDie * this.config.crossoverRate);
    const countToClone = countToDie - countToCross;

    return [countToSurvive, countToCross, countToClone];
  }
}

export class MultiprocessingRunnerStrategy implements RunnerStrategyInterface {
  private readonly poolSize: number;

  constructor(poolSize: number) {
    this.poolSize = poolSize;
  }

  async run(population: Population, config: GeneticSearchConfig): Promise<number[][]> {
    const inputs = this.createTasksInputList(population, config);
    return await this.runTask(inputs);
  }

  private async runTask(inputs: SimulationTaskConfig[]): Promise<number[][]> {
    const pool = new Pool(this.poolSize);
    const result: number[][] = await pool.map(inputs, simulationTask);
    pool.close();

    return result;
  }

  private createTasksInputList(population: Population, config: GeneticSearchConfig): SimulationTaskConfig[] {
    return population.map((genome, i) => this.createTaskInput(i+1, genome, config));
  }

  private createTaskInput(id: number, genome: Genome, config: GeneticSearchConfig): SimulationTaskConfig {
    return [id, config.worldConfig, genome.typesConfig, config.simulationStepsCount];
  }
}
