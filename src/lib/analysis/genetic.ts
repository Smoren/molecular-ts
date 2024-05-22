import { multi, single, transform } from 'itertools-ts';
import { Pool } from 'multiprocess-pool';
import type {
  GeneticSearchConfig,
  StrategyConfig,
  GeneticSearchInterface,
  CrossoverStrategyInterface,
  RunnerStrategyInterface,
  MutationStrategyInterface,
  Genome,
  Population,
} from '../types/genetic';
import type { SimulationTaskConfig } from "./multiprocessing";
import { simulationTask } from "./multiprocessing";
import { normalizeSummaryMatrix } from './helpers';
import {
  createTransparentTypesConfig,
  crossTypesConfigs,
  randomCrossTypesConfigs,
  randomizeTypesConfig
} from '../config/types';
import { arrayBinaryOperation, arraySum, createRandomInteger } from '../math';
import { getRandomArrayItem } from '../math/random';
import { fullCopyObject } from '../utils/functions';

export class GeneticSearch implements GeneticSearchInterface {
  private readonly config: GeneticSearchConfig;
  private readonly strategy: StrategyConfig;
  private population: Population;
  private nextId: () => number;

  constructor(config: GeneticSearchConfig, strategy: StrategyConfig) {
    this.config = config;
    this.strategy = strategy;

    this.nextId = (() => {
      let id = 0;
      return () => {
        return ++id;
      };
    })();

    this.population = this.createPopulation(config.populationSize);
  }

  public async runGenerationStep(): Promise<number[]> {
    const [countToSurvive, countToCross, countToClone] = this.getSizes();

    const results = await this.strategy.runner.run(this.population, this.config);
    const losses = this.calcLosses(results);
    const [sortedPopulation, sortLosses] = this.sortPopulation(losses);

    const survivedPopulation = sortedPopulation.slice(0, countToSurvive);
    const crossedPopulation = this.crossover(survivedPopulation, countToCross);
    const mutatedPopulation = this.clone(survivedPopulation, countToClone);

    // TODO population should be replaced with sorted
    this.population = [...survivedPopulation, ...crossedPopulation, ...mutatedPopulation];
    // this.population = [...sortedPopulation];

    return sortLosses;
  }

  public getBestGenome(): Genome {
    return this.population[0];
  }

  private createPopulation(size: number): Population {
    const population: Population = [];
    for (let i = 0; i < size; i++) {
      population.push({
        id: this.nextId(),
        typesConfig: randomizeTypesConfig(
          this.config.randomTypesConfig,
          createTransparentTypesConfig(this.config.randomTypesConfig.TYPES_COUNT),
        ),
      });
    }
    return population;
  }

  private crossover(genomes: Population, count: number): Population {
    const newPopulation = [];

    for (let i = 0; i < count; i++) {
      const lhs = getRandomArrayItem(genomes);
      const rhs = getRandomArrayItem(genomes);
      const crossedGenome = this.strategy.crossover.cross(this.nextId(), lhs, rhs, this.config);
      newPopulation.push(crossedGenome);
    }

    return newPopulation;
  }

  private clone(genomes: Population, count: number): Population {
    const newPopulation = [];

    for (let i = 0; i < count; i++) {
      const genome = getRandomArrayItem(genomes);
      const mutatedGenome = this.strategy.mutation.mutate(this.nextId(), genome, this.config.mutationProbability, this.config);
      newPopulation.push(mutatedGenome);
    }

    return newPopulation;
  }

  private sortPopulation(losses: number[]): [Population, number[]] {
    const zipped = multi.zip(this.population, losses);
    const sorted = single.sort(zipped, (lhs, rhs) => lhs[1] - rhs[1]);
    const sortedArray = transform.toArray(sorted);
    return [
      transform.toArray(single.map(sortedArray, (x) => x[0])),
      transform.toArray(single.map(sortedArray, (x) => x[1])),
    ];
  }

  private calcLosses(results: number[][]): number[] {
    // TODO: normalize results ???
    // TODO: bounds of each compound
    // results = this.normalizeResults(results);
    results = this.weighResults(results);
    results = this.compareWithReference(results);

    return results.map((x) => arraySum(x));
  }

  private normalizeResults(results: number[][]): number[][] {
    const matrix = normalizeSummaryMatrix([...results, this.config.reference], this.config.randomTypesConfig.TYPES_COUNT);
    return matrix.slice(0, -1);
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

export class SubMatrixCrossoverStrategy implements CrossoverStrategyInterface {
  public cross(id: number, lhs: Genome, rhs: Genome, config: GeneticSearchConfig): Genome {
    const separator = createRandomInteger([1, lhs.typesConfig.FREQUENCIES.length-1]);
    const crossed = crossTypesConfigs(lhs.typesConfig, rhs.typesConfig, separator);
    const randomized = randomizeTypesConfig(config.randomTypesConfig, crossed, separator);
    return { id: id, typesConfig: randomized };
  }
}

export class RandomCrossoverStrategy implements CrossoverStrategyInterface {
  public cross(id: number, lhs: Genome, rhs: Genome): Genome {
    const separator = createRandomInteger([1, lhs.typesConfig.FREQUENCIES.length-1]);
    const crossed = randomCrossTypesConfigs(lhs.typesConfig, rhs.typesConfig, separator);
    return { id: id, typesConfig: crossed };
  }
}

export class MutationStrategy implements MutationStrategyInterface {
  mutate(id: number, genome: Genome, probability: number, config: GeneticSearchConfig): Genome {
    const inputTypesConfig = fullCopyObject(genome.typesConfig);
    const randomizedTypesConfig = randomizeTypesConfig(config.randomTypesConfig, inputTypesConfig);
    const mutatedTypesConfig = randomCrossTypesConfigs(randomizedTypesConfig, inputTypesConfig, probability);

    return { id: id, typesConfig: mutatedTypesConfig };
  }
}

export abstract class BaseRunnerStrategy implements RunnerStrategyInterface {
  public async run(population: Population, config: GeneticSearchConfig): Promise<number[][]> {
    const inputs = this.createTasksInputList(population, config);
    return await this.execTask(inputs);
  }

  protected abstract execTask(inputs: SimulationTaskConfig[]): Promise<number[][]>;

  protected createTasksInputList(population: Population, config: GeneticSearchConfig): SimulationTaskConfig[] {
    return population.map((genome, i) => this.createTaskInput(i+1, genome, config));
  }

  protected createTaskInput(id: number, genome: Genome, config: GeneticSearchConfig): SimulationTaskConfig {
    return [id, config.worldConfig, genome.typesConfig, config.checkpoints, config.repeats];
  }
}

export class SimpleRunnerStrategy extends BaseRunnerStrategy implements RunnerStrategyInterface {
  protected async execTask(inputs: SimulationTaskConfig[]): Promise<number[][]> {
    const result = [];
    for (const input of inputs) {
      result.push(await simulationTask(input));
    }
    return result;
  }
}

export class MultiprocessingRunnerStrategy extends BaseRunnerStrategy implements RunnerStrategyInterface {
  private readonly poolSize: number;

  constructor(poolSize: number) {
    super();
    this.poolSize = poolSize;
  }

  protected async execTask(inputs: SimulationTaskConfig[]): Promise<number[][]> {
    const pool = new Pool(this.poolSize);
    const result: number[][] = await pool.map(inputs, simulationTask);
    pool.close();

    return result;
  }
}
