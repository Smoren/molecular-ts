import type {
  BaseMutationStrategyConfig,
  CrossoverStrategyInterface,
  MutationStrategyInterface,
  PopulateStrategyInterface,
  Population,
} from "genetic-search";
import type {
  SimulationGenome,
  SimulationMultiprocessingRunnerStrategyConfig,
  SimulationRunnerStrategyConfig,
} from '../types/genetic';
import type { RandomTypesConfig, TypesConfig } from '../types/config';
import type { SimulationTaskConfig } from '../types/genetic';
import {
  createTransparentTypesConfig,
  crossTypesConfigs,
  randomCrossTypesConfigs,
  randomizeTypesConfig,
} from '../config/types';
import { createRandomInteger } from '../math';
import { fullCopyObject } from '../utils/functions';
import {
  BaseCachedMultiprocessingRunnerStrategy,
  BaseMultiprocessingRunnerStrategy,
  BaseMutationStrategy,
  BaseRunnerStrategy
} from "genetic-search";

export class SimulationRandomPopulateStrategy implements PopulateStrategyInterface<SimulationGenome> {
  private readonly randomizeConfig: RandomTypesConfig;

  constructor(randomizeConfig: RandomTypesConfig) {
    this.randomizeConfig = randomizeConfig;
  }

  public populate(size: number, nextId: () => number): Population<SimulationGenome> {
    const population: Population<SimulationGenome> = [];
    for (let i = 0; i < size; i++) {
      population.push({
        id: nextId(),
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

  public populate(size: number, nextId: () => number): Population<SimulationGenome> {
    const population: Population<SimulationGenome> = [];
    for (let i = 0; i < size; i++) {
      const inputTypesConfig = fullCopyObject(this.sourceTypesConfig);
      const randomizedTypesConfig = randomizeTypesConfig(this.randomizeConfig, inputTypesConfig);
      const mutatedTypesConfig = randomCrossTypesConfigs(randomizedTypesConfig, inputTypesConfig, this.probability);

      population.push({
        id: nextId(),
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

export class SimulationDefaultMutationStrategy extends BaseMutationStrategy<SimulationGenome, BaseMutationStrategyConfig> implements MutationStrategyInterface<SimulationGenome> {
  private readonly randomizeConfig: RandomTypesConfig;

  constructor(config: BaseMutationStrategyConfig, randomizeConfig: RandomTypesConfig) {
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

  constructor(config: BaseMutationStrategyConfig, randomizeConfig: RandomTypesConfig, sourceTypesConfig: TypesConfig) {
    super(config, randomizeConfig);
    this.sourceTypesConfig = sourceTypesConfig;
  }

  public mutate(genome: SimulationGenome, newGenomeId: number): SimulationGenome {
    return super.mutate({ id: genome.id, typesConfig: this.sourceTypesConfig }, newGenomeId);
  }
}

export class SimulationSimpleRunnerStrategy extends BaseRunnerStrategy<SimulationGenome, SimulationRunnerStrategyConfig, SimulationTaskConfig> {
  protected createTaskInput(genome: SimulationGenome): SimulationTaskConfig {
    return [genome.id, this.config.worldConfig, genome.typesConfig, this.config.checkpoints, this.config.repeats];
  }
}

export class SimulationMultiprocessingRunnerStrategy extends BaseMultiprocessingRunnerStrategy<SimulationGenome, SimulationMultiprocessingRunnerStrategyConfig, SimulationTaskConfig> {
  protected createTaskInput(genome: SimulationGenome): SimulationTaskConfig {
    return [genome.id, this.config.worldConfig, genome.typesConfig, this.config.checkpoints, this.config.repeats];
  }
}

export class SimulationCachedMultiprocessingRunnerStrategy extends BaseCachedMultiprocessingRunnerStrategy<SimulationGenome, SimulationMultiprocessingRunnerStrategyConfig, SimulationTaskConfig> {
  protected createTaskInput(genome: SimulationGenome): SimulationTaskConfig {
    return [genome.id, this.config.worldConfig, genome.typesConfig, this.config.checkpoints, this.config.repeats];
  }

  protected getGenomeId(input: SimulationTaskConfig): number {
    return input[0];
  }
}
