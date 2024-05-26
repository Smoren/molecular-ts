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
  PopulateStrategyInterface,
} from '../types/genetic';
import type { SimulationTaskConfig } from "./multiprocessing";
import { simulationTaskMultiprocessing, simulationTaskSingle } from "./multiprocessing";
import { normalizeSummaryMatrix } from './helpers';
import {
  createTransparentTypesConfig,
  crossTypesConfigs,
  randomCrossTypesConfigs,
  randomizeTypesConfig,
} from '../config/types';
import { arrayBinaryOperation, arraySum, createRandomInteger } from '../math';
import { getRandomArrayItem } from '../math/random';
import { fullCopyObject } from '../utils/functions';
import type { RandomTypesConfig } from '../types/config';

export class GeneticSearch implements GeneticSearchInterface {
  private readonly config: GeneticSearchConfig;
  private readonly strategy: StrategyConfig;
  private readonly nextId: () => number;
  private population: Population;

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

  public async runGenerationStep(): Promise<[number[], number[]]> {
    const [countToSurvive, countToCross, countToClone] = this.getSizes();

    const results = await this.strategy.runner.run(this.population, this.config);
    const [normalizedLosses, absoluteLosses] = this.calcLosses(results);
    const [
      sortedPopulation,
      sortNormalizedLosses,
      sortAbsoluteLosses,
    ] = this.sortPopulation(normalizedLosses, absoluteLosses);

    const survivedPopulation = sortedPopulation.slice(0, countToSurvive);
    const crossedPopulation = this.crossover(survivedPopulation, countToCross);
    const mutatedPopulation = this.clone(survivedPopulation, countToClone);

    this.population = [...survivedPopulation, ...crossedPopulation, ...mutatedPopulation];
    // this.population = [...sortedPopulation];

    return [sortNormalizedLosses, sortAbsoluteLosses];
  }

  public getBestGenome(): Genome {
    return this.population[0];
  }

  private createPopulation(size: number): Population {
    return this.strategy.populate
      .populate(size)
      .map((x) => ({ ...x, id: this.nextId() }));
  }

  private crossover(genomes: Population, count: number): Population {
    const newPopulation = [];

    for (let i = 0; i < count; i++) {
      const lhs = getRandomArrayItem(genomes);
      const rhs = getRandomArrayItem(genomes);
      const crossedGenome = this.strategy.crossover.cross(this.nextId(), lhs, rhs);
      newPopulation.push(crossedGenome);
    }

    return newPopulation;
  }

  private clone(genomes: Population, count: number): Population {
    const newPopulation = [];

    for (let i = 0; i < count; i++) {
      const genome = getRandomArrayItem(genomes);
      const mutatedGenome = this.strategy.mutation.mutate(this.nextId(), genome, this.config.mutationProbability);
      newPopulation.push(mutatedGenome);
    }

    return newPopulation;
  }

  private sortPopulation(normalizedLosses: number[], absoluteLosses: number[]): [Population, number[], number[]] {
    const zipped = multi.zip(this.population, normalizedLosses, absoluteLosses);
    const sorted = single.sort(zipped, (lhs, rhs) => lhs[1] - rhs[1]);
    const sortedArray = transform.toArray(sorted);
    return [
      transform.toArray(single.map(sortedArray, (x) => x[0])),
      transform.toArray(single.map(sortedArray, (x) => x[1])),
      transform.toArray(single.map(sortedArray, (x) => x[2])),
    ];
  }

  private calcLosses(results: number[][]): [number[], number[]] {
    const normalizedLosses = this.getNormalizedLosses(results);
    const absoluteLosses = this.getAbsoluteLosses(results);

    return [
      normalizedLosses.map((x) => arraySum(x)),
      absoluteLosses.map((x) => arraySum(x)),
    ];
  }

  private getNormalizedLosses(results: number[][]): number[][] {
    return normalizeSummaryMatrix(results, this.config.reference).map((result) => this.weighRow(result));
  }

  private getAbsoluteLosses(results: number[][]): number[][] {
    const weightedReference = this.weighRow(this.config.reference);
    return results.map((result) => this.weighRow(result).map((x, i) => Math.abs(x - weightedReference[i])));
  }

  private weighRow(result: number[]): number[] {
    return arrayBinaryOperation(result, this.config.weights, (x, y) => x * y);
  }

  private getSizes(): number[] {
    const countToSurvive = Math.round(this.config.populationSize * this.config.survivalRate);
    const countToDie = this.config.populationSize - countToSurvive;

    const countToCross = Math.round(countToDie * this.config.crossoverRate);
    const countToClone = countToDie - countToCross;

    return [countToSurvive, countToCross, countToClone];
  }
}

export class RandomPopulateStrategy implements PopulateStrategyInterface {
  private readonly randomizeConfig: RandomTypesConfig;

  constructor(randomizeConfig: RandomTypesConfig) {
    this.randomizeConfig = randomizeConfig;
  }

  public populate(size: number): Population {
    const population: Population = [];
    for (let i = 0; i < size; i++) {
      population.push({
        id: 0,
        typesConfig: randomizeTypesConfig(
          this.randomizeConfig,
          createTransparentTypesConfig(this.randomizeConfig.TYPES_COUNT),
        ),
      });
    }
    return population;
  }
}

export class SubMatrixCrossoverStrategy implements CrossoverStrategyInterface {
  private readonly randomizeConfig: RandomTypesConfig;

  constructor(randomizeConfig: RandomTypesConfig) {
    this.randomizeConfig = randomizeConfig;
  }

  public cross(id: number, lhs: Genome, rhs: Genome): Genome {
    const separator = createRandomInteger([1, lhs.typesConfig.FREQUENCIES.length-1]);
    const crossed = crossTypesConfigs(lhs.typesConfig, rhs.typesConfig, separator);
    const randomized = randomizeTypesConfig(this.randomizeConfig, crossed, separator);
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

export class ComposedCrossoverStrategy implements CrossoverStrategyInterface {
  private readonly randomStrategy: CrossoverStrategyInterface;
  private readonly subMatrixStrategy: CrossoverStrategyInterface;

  constructor(randomizeConfig: RandomTypesConfig) {
    this.randomStrategy = new RandomCrossoverStrategy();
    this.subMatrixStrategy = new SubMatrixCrossoverStrategy(randomizeConfig);
  }

  public cross(id: number, lhs: Genome, rhs: Genome): Genome {
    if (Math.random() > 0.5) {
      return this.randomStrategy.cross(id, lhs, rhs);
    }

    return this.subMatrixStrategy.cross(id, lhs, rhs);
  }
}

export class MutationStrategy implements MutationStrategyInterface {
  private readonly randomizeConfig: RandomTypesConfig;

  constructor(randomizeConfig: RandomTypesConfig) {
    this.randomizeConfig = randomizeConfig;
  }

  mutate(id: number, genome: Genome, probability: number): Genome {
    const inputTypesConfig = fullCopyObject(genome.typesConfig);
    const randomizedTypesConfig = randomizeTypesConfig(this.randomizeConfig, inputTypesConfig);
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
    return population.map((genome) => this.createTaskInput(genome.id, genome, config));
  }

  protected createTaskInput(id: number, genome: Genome, config: GeneticSearchConfig): SimulationTaskConfig {
    return [id, config.worldConfig, genome.typesConfig, config.checkpoints, config.repeats];
  }
}

export class SimpleRunnerStrategy extends BaseRunnerStrategy implements RunnerStrategyInterface {
  protected async execTask(inputs: SimulationTaskConfig[]): Promise<number[][]> {
    const result = [];
    for (const input of inputs) {
      result.push(await simulationTaskSingle(input));
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
    const result: number[][] = await pool.map(inputs, simulationTaskMultiprocessing);
    pool.close();

    return result;
  }
}

export class CachedMultiprocessingRunnerStrategy extends MultiprocessingRunnerStrategy implements RunnerStrategyInterface {
  private readonly cache: Map<number, number[]> = new Map();

  protected async execTask(inputs: SimulationTaskConfig[]): Promise<number[][]> {
    const resultsMap = new Map(inputs.map((input) => [input[0], this.cache.get(input[0])]));
    const inputsToRun = inputs.filter((input) => resultsMap.get(input[0]) === undefined);
    const newResults = await super.execTask(inputsToRun);

    for (const [input, result] of multi.zip(inputsToRun, newResults)) {
      this.cache.set(input[0], result);
      resultsMap.set(input[0], result);
    }

    const results: number[][] = [];
    for (const input of inputs) {
      results.push(resultsMap.get(input[0]) as number[]);
    }

    for (const id of this.cache.keys()) {
      if (!resultsMap.has(id)) {
        this.cache.delete(id);
      }
    }

    return results;
  }
}
