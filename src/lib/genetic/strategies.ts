import { Pool } from 'multiprocess-pool';
import { multi } from 'itertools-ts';
import type {
  SimulationGenome,
  Population,
  MutationStrategyConfig,
  SimulationRunnerStrategyConfig,
  CrossoverStrategyInterface,
  MutationStrategyInterface,
  PopulateStrategyInterface,
  RunnerStrategyInterface,
  ScoringStrategyInterface,
  GeneticSearchReferenceConfig,
  RunnerStrategyConfig,
  BaseGenome,
} from '../types/genetic';
import type { RandomTypesConfig, TypesConfig } from '../types/config';
import type { SimulationTaskConfig } from '../types/genetic';
import {
  createTransparentTypesConfig,
  crossTypesConfigs,
  randomCrossTypesConfigs,
  randomizeTypesConfig,
} from '../config/types';
import { arrayBinaryOperation, arraySum, createRandomInteger } from '../math';
import { fullCopyObject } from '../utils/functions';
import { normalizeSummaryMatrix } from "./helpers";

abstract class BaseMutationStrategy<TGenome extends BaseGenome> implements MutationStrategyInterface<TGenome> {
  protected readonly config: MutationStrategyConfig;

  protected constructor(config: MutationStrategyConfig) {
    this.config = config;
  }

  public abstract mutate(genome: TGenome, newGenomeId: number): TGenome;
}

abstract class BaseRunnerStrategy<
  TGenome extends BaseGenome,
  TConfig extends RunnerStrategyConfig<TTaskConfig>,
  TTaskConfig,
> implements RunnerStrategyInterface<TGenome> {
  protected readonly config: TConfig;

  constructor(config: TConfig) {
    this.config = config;
  }

  public async run(population: Population<TGenome>): Promise<number[][]> {
    const inputs = this.createTasksInputList(population);
    return await this.execTask(inputs);
  }

  protected async execTask(inputs: TTaskConfig[]): Promise<number[][]> {
    const result = [];
    for (const input of inputs) {
      result.push(await this.config.task(input));
    }
    return result;
  }

  protected abstract createTaskInput(id: number, genome: TGenome): TTaskConfig;

  protected createTasksInputList(population: Population<TGenome>): TTaskConfig[] {
    return population.map((genome) => this.createTaskInput(genome.id, genome));
  }
}

abstract class BaseMultiprocessingRunnerStrategy<
  TGenome extends BaseGenome,
  TConfig extends RunnerStrategyConfig<TTaskConfig>,
  TTaskConfig,
> extends BaseRunnerStrategy<TGenome, TConfig, TTaskConfig> {
  protected async execTask(inputs: TTaskConfig[]): Promise<number[][]> {
    const pool = new Pool(this.config.poolSize);
    const result: number[][] = await pool.map(inputs, this.config.task);
    pool.close();

    return result;
  }
}

abstract class BaseCachedMultiprocessingRunnerStrategy<
  TGenome extends BaseGenome,
  TConfig extends RunnerStrategyConfig<TTaskConfig>,
  TTaskConfig,
> extends BaseMultiprocessingRunnerStrategy<TGenome, TConfig, TTaskConfig> {
  protected readonly cache: Map<number, number[]> = new Map();

  protected abstract getTaskId(input: TTaskConfig): number;

  protected async execTask(inputs: TTaskConfig[]): Promise<number[][]> {
    const resultsMap = new Map(inputs.map((input) => [this.getTaskId(input), this.cache.get(this.getTaskId(input))]));
    const inputsToRun = inputs.filter((input) => resultsMap.get(this.getTaskId(input)) === undefined);
    const newResults = await super.execTask(inputsToRun);

    for (const [input, result] of multi.zip(inputsToRun, newResults)) {
      this.cache.set(this.getTaskId(input), result);
      resultsMap.set(this.getTaskId(input), result);
    }

    const results: number[][] = [];
    for (const input of inputs) {
      results.push(resultsMap.get(this.getTaskId(input)) as number[]);
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

export class SimulationRandomPopulateStrategy implements PopulateStrategyInterface<SimulationGenome> {
  private readonly randomizeConfig: RandomTypesConfig;

  constructor(randomizeConfig: RandomTypesConfig) {
    this.randomizeConfig = randomizeConfig;
  }

  public populate(size: number): Population<SimulationGenome> {
    const population: Population<SimulationGenome> = [];
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

export class SimulationSourceMutationPopulateStrategy implements PopulateStrategyInterface<SimulationGenome> {
  private readonly sourceTypesConfig: TypesConfig;
  private readonly randomizeConfig: RandomTypesConfig;
  private readonly probability: number;

  constructor(sourceTypesConfig: TypesConfig, randomizeConfig: RandomTypesConfig, probability: number) {
    this.sourceTypesConfig = sourceTypesConfig;
    this.randomizeConfig = randomizeConfig;
    this.probability = probability;
  }

  public populate(size: number): Population<SimulationGenome> {
    const population: Population<SimulationGenome> = [];
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

export class SimulationSubMatrixCrossoverStrategy implements CrossoverStrategyInterface<SimulationGenome> {
  private readonly randomizeConfig: RandomTypesConfig;

  constructor(randomizeConfig: RandomTypesConfig) {
    this.randomizeConfig = randomizeConfig;
  }

  public cross(lhs: SimulationGenome, rhs: SimulationGenome, newGenomeId: number): SimulationGenome {
    const separator = createRandomInteger([1, lhs.typesConfig.FREQUENCIES.length-1]);
    const crossed = crossTypesConfigs(lhs.typesConfig, rhs.typesConfig, separator);
    const randomized = randomizeTypesConfig(this.randomizeConfig, crossed, separator);
    return { id: newGenomeId, typesConfig: randomized };
  }
}

export class SimulationRandomCrossoverStrategy implements CrossoverStrategyInterface<SimulationGenome> {
  public cross(lhs: SimulationGenome, rhs: SimulationGenome, newGenomeId: number): SimulationGenome {
    const separator = createRandomInteger([1, lhs.typesConfig.FREQUENCIES.length-1]);
    const crossed = randomCrossTypesConfigs(lhs.typesConfig, rhs.typesConfig, separator);
    return { id: newGenomeId, typesConfig: crossed };
  }
}

export class SimulationComposedCrossoverStrategy implements CrossoverStrategyInterface<SimulationGenome> {
  private readonly randomStrategy: CrossoverStrategyInterface<SimulationGenome>;
  private readonly subMatrixStrategy: CrossoverStrategyInterface<SimulationGenome>;

  constructor(randomizeConfig: RandomTypesConfig) {
    this.randomStrategy = new SimulationRandomCrossoverStrategy();
    this.subMatrixStrategy = new SimulationSubMatrixCrossoverStrategy(randomizeConfig);
  }

  public cross(lhs: SimulationGenome, rhs: SimulationGenome, newGenomeId: number): SimulationGenome {
    if (Math.random() > 0.5) {
      return this.randomStrategy.cross(lhs, rhs, newGenomeId);
    }

    return this.subMatrixStrategy.cross(lhs, rhs, newGenomeId);
  }
}

export class SimulationDefaultMutationStrategy extends BaseMutationStrategy<SimulationGenome> implements MutationStrategyInterface<SimulationGenome> {
  private readonly randomizeConfig: RandomTypesConfig;

  constructor(config: MutationStrategyConfig, randomizeConfig: RandomTypesConfig) {
    super(config);
    this.randomizeConfig = randomizeConfig;
  }

  mutate(genome: SimulationGenome, newGenomeId: number): SimulationGenome {
    const inputTypesConfig = fullCopyObject(genome.typesConfig);
    const randomizedTypesConfig = randomizeTypesConfig(this.randomizeConfig, inputTypesConfig);
    const mutatedTypesConfig = randomCrossTypesConfigs(randomizedTypesConfig, inputTypesConfig, this.config.probability);

    return { id: newGenomeId, typesConfig: mutatedTypesConfig };
  }
}

export class SimulationSourceMutationStrategy extends SimulationDefaultMutationStrategy implements MutationStrategyInterface<SimulationGenome> {
  private readonly sourceTypesConfig: TypesConfig;

  constructor(config: MutationStrategyConfig, randomizeConfig: RandomTypesConfig, sourceTypesConfig: TypesConfig) {
    super(config, randomizeConfig);
    this.sourceTypesConfig = sourceTypesConfig;
  }

  public mutate(genome: SimulationGenome, newGenomeId: number): SimulationGenome {
    return super.mutate({ id: genome.id, typesConfig: this.sourceTypesConfig }, newGenomeId);
  }
}

export class SimulationSimpleRunnerStrategy extends BaseRunnerStrategy<SimulationGenome, SimulationRunnerStrategyConfig, SimulationTaskConfig> {
  protected createTaskInput(id: number, genome: SimulationGenome): SimulationTaskConfig {
    return [id, this.config.worldConfig, genome.typesConfig, this.config.checkpoints, this.config.repeats];
  }
}

export class SimulationMultiprocessingRunnerStrategy extends BaseMultiprocessingRunnerStrategy<SimulationGenome, SimulationRunnerStrategyConfig, SimulationTaskConfig> {
  protected createTaskInput(id: number, genome: SimulationGenome): SimulationTaskConfig {
    return [id, this.config.worldConfig, genome.typesConfig, this.config.checkpoints, this.config.repeats];
  }
}

export class SimulationCachedMultiprocessingRunnerStrategy extends BaseCachedMultiprocessingRunnerStrategy<SimulationGenome, SimulationRunnerStrategyConfig, SimulationTaskConfig> {
  protected createTaskInput(id: number, genome: SimulationGenome): SimulationTaskConfig {
    return [id, this.config.worldConfig, genome.typesConfig, this.config.checkpoints, this.config.repeats];
  }

  protected getTaskId(input: SimulationTaskConfig): number {
    return input[0];
  }
}
