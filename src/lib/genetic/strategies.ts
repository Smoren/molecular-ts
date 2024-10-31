import { Pool } from 'multiprocess-pool';
import { multi } from 'itertools-ts';
import type {
  Genome,
  Population,
  MutationStrategyConfig,
  RunnerStrategyConfig,
  CrossoverStrategyInterface,
  MutationStrategyInterface,
  PopulateStrategyInterface,
  RunnerStrategyInterface, ScoringStrategyInterface, GeneticSearchReferenceConfig,
} from '../types/genetic';
import type { RandomTypesConfig, TypesConfig } from '../types/config';
import type { SimulationTaskConfig } from '../genetic/multiprocessing';
import {
  createTransparentTypesConfig,
  crossTypesConfigs,
  randomCrossTypesConfigs,
  randomizeTypesConfig,
} from '../config/types';
import { arrayBinaryOperation, arraySum, createRandomInteger } from '../math';
import { fullCopyObject } from '../utils/functions';
import { simulationTaskMultiprocessing, simulationTaskSingle } from '../genetic/multiprocessing';
import { normalizeSummaryMatrix } from "@/lib/genetic/helpers";

abstract class BaseMutationStrategy<TGenome> implements MutationStrategyInterface<TGenome> {
  protected readonly config: MutationStrategyConfig;

  protected constructor(config: MutationStrategyConfig) {
    this.config = config;
  }

  public abstract mutate(id: number, genome: TGenome): TGenome;
}

abstract class BaseRunnerStrategy<TGenome, TTaskConfig> implements RunnerStrategyInterface<TGenome> {
  protected readonly config: RunnerStrategyConfig;

  constructor(config: RunnerStrategyConfig) {
    this.config = config;
  }

  public async run(population: Population<TGenome>): Promise<number[][]> {
    const inputs = this.createTasksInputList(population);
    return await this.execTask(inputs);
  }

  protected abstract execTask(inputs: TTaskConfig[]): Promise<number[][]>;

  protected abstract createTaskInput(id: number, genome: TGenome): TTaskConfig;

  protected abstract getGenomeId(genome: TGenome): number;

  protected createTasksInputList(population: Population<TGenome>): TTaskConfig[] {
    return population.map((genome) => this.createTaskInput(this.getGenomeId(genome), genome));
  }
}

abstract class BaseSimulationRunnerStrategy extends BaseRunnerStrategy<Genome, SimulationTaskConfig> {
  protected createTaskInput(id: number, genome: Genome): SimulationTaskConfig {
    return [id, this.config.worldConfig, genome.typesConfig, this.config.checkpoints, this.config.repeats];
  }

  protected getGenomeId(genome: Genome): number {
    return genome.id;
  }
}

export class SimulationRandomPopulateStrategy implements PopulateStrategyInterface<Genome> {
  private readonly randomizeConfig: RandomTypesConfig;

  constructor(randomizeConfig: RandomTypesConfig) {
    this.randomizeConfig = randomizeConfig;
  }

  public populate(size: number): Population<Genome> {
    const population: Population<Genome> = [];
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

export class SimulationSourceMutationPopulateStrategy implements PopulateStrategyInterface<Genome> {
  private readonly sourceTypesConfig: TypesConfig;
  private readonly randomizeConfig: RandomTypesConfig;
  private readonly probability: number;

  constructor(sourceTypesConfig: TypesConfig, randomizeConfig: RandomTypesConfig, probability: number) {
    this.sourceTypesConfig = sourceTypesConfig;
    this.randomizeConfig = randomizeConfig;
    this.probability = probability;
  }

  public populate(size: number): Population<Genome> {
    const population: Population<Genome> = [];
    for (let i = 0; i < size; i++) {
      const inputTypesConfig = fullCopyObject(this.sourceTypesConfig);
      const randomizedTypesConfig = randomizeTypesConfig(this.randomizeConfig, inputTypesConfig);
      const mutatedTypesConfig = randomCrossTypesConfigs(randomizedTypesConfig, inputTypesConfig, this.probability);

      population.push({
        id: 0,
        typesConfig: mutatedTypesConfig,
      });
    }
    return population;
  }
}

export class SimulationSubMatrixCrossoverStrategy implements CrossoverStrategyInterface<Genome> {
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

export class SimulationRandomCrossoverStrategy implements CrossoverStrategyInterface<Genome> {
  public cross(id: number, lhs: Genome, rhs: Genome): Genome {
    const separator = createRandomInteger([1, lhs.typesConfig.FREQUENCIES.length-1]);
    const crossed = randomCrossTypesConfigs(lhs.typesConfig, rhs.typesConfig, separator);
    return { id: id, typesConfig: crossed };
  }
}

export class SimulationComposedCrossoverStrategy implements CrossoverStrategyInterface<Genome> {
  private readonly randomStrategy: CrossoverStrategyInterface<Genome>;
  private readonly subMatrixStrategy: CrossoverStrategyInterface<Genome>;

  constructor(randomizeConfig: RandomTypesConfig) {
    this.randomStrategy = new SimulationRandomCrossoverStrategy();
    this.subMatrixStrategy = new SimulationSubMatrixCrossoverStrategy(randomizeConfig);
  }

  public cross(id: number, lhs: Genome, rhs: Genome): Genome {
    if (Math.random() > 0.5) {
      return this.randomStrategy.cross(id, lhs, rhs);
    }

    return this.subMatrixStrategy.cross(id, lhs, rhs);
  }
}

export class SimulationMutationStrategy extends BaseMutationStrategy<Genome> implements MutationStrategyInterface<Genome> {
  private readonly randomizeConfig: RandomTypesConfig;

  constructor(config: MutationStrategyConfig, randomizeConfig: RandomTypesConfig) {
    super(config);
    this.randomizeConfig = randomizeConfig;
  }

  mutate(id: number, genome: Genome): Genome {
    const inputTypesConfig = fullCopyObject(genome.typesConfig);
    const randomizedTypesConfig = randomizeTypesConfig(this.randomizeConfig, inputTypesConfig);
    const mutatedTypesConfig = randomCrossTypesConfigs(randomizedTypesConfig, inputTypesConfig, this.config.probability);

    return { id: id, typesConfig: mutatedTypesConfig };
  }
}

export class SourceMutationStrategy extends SimulationMutationStrategy implements MutationStrategyInterface<Genome> {
  private readonly sourceTypesConfig: TypesConfig;

  constructor(config: MutationStrategyConfig, randomizeConfig: RandomTypesConfig, sourceTypesConfig: TypesConfig) {
    super(config, randomizeConfig);
    this.sourceTypesConfig = sourceTypesConfig;
  }

  public mutate(id: number): Genome {
    return super.mutate(id, { id: 0, typesConfig: this.sourceTypesConfig });
  }
}

export class SimulationSimpleRunnerStrategy extends BaseSimulationRunnerStrategy {
  protected async execTask(inputs: SimulationTaskConfig[]): Promise<number[][]> {
    const result = [];
    for (const input of inputs) {
      result.push(await simulationTaskSingle(input));
    }
    return result;
  }
}

export class SimulationMultiprocessingRunnerStrategy extends BaseSimulationRunnerStrategy {
  constructor(config: RunnerStrategyConfig) {
    super(config);
  }

  protected async execTask(inputs: SimulationTaskConfig[]): Promise<number[][]> {
    const pool = new Pool(this.config.poolSize);
    const result: number[][] = await pool.map(inputs, simulationTaskMultiprocessing);
    pool.close();

    return result;
  }
}

export class SimulationCachedMultiprocessingRunnerStrategy extends SimulationMultiprocessingRunnerStrategy {
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

export class ReferenceLossScoringStrategy implements ScoringStrategyInterface {
  private referenceConfig: GeneticSearchReferenceConfig;

  constructor(referenceConfig: GeneticSearchReferenceConfig) {
    this.referenceConfig = referenceConfig;
  }

  score(results: number[][]): number[] {
    const normalizedLosses = this.getNormalizedLosses(results);
    return normalizedLosses.map((x) => -arraySum(x));
  }

  private getNormalizedLosses(results: number[][]): number[][] {
    return normalizeSummaryMatrix(results, this.referenceConfig.reference).map((result) => this.weighRow(result));
  }

  private weighRow(result: number[]): number[] {
    return arrayBinaryOperation(result, this.referenceConfig.weights, (x, y) => x * y);
  }
}
