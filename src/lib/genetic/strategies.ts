import type {
  BaseMutationStrategyConfig,
  CrossoverStrategyInterface,
  FitnessStrategyInterface,
  GenerationFitnessColumn,
  GenerationMetricsMatrix, MetricsStrategyConfig,
  MutationStrategyInterface,
  PopulateStrategyInterface,
  Population,
} from "genetic-search";
import type {
  SimulationGenome,
  SimulationMultiprocessingMetricsStrategyConfig,
  SimulationMetricsStrategyConfig, SimulationClusterizationTaskConfig, ClusterizationWeightsConfig,
} from '../types/genetic';
import type { RandomTypesConfig, TypesConfig } from '../types/config';
import type { SimulationReferenceTaskConfig } from '../types/genetic';
import {
  BaseCachedMultiprocessingMetricsStrategy,
  BaseMetricsStrategy,
  BaseMultiprocessingMetricsStrategy,
  BaseMutationStrategy,
} from "genetic-search";
import {
  createTransparentTypesConfig,
  crossTypesConfigs,
  randomCrossTypesConfigs,
  randomizeTypesConfig,
} from '../config/types';
import { arraySum, createRandomInteger } from '../math';
import { fullCopyObject } from '../utils/functions';

export class RandomPopulateStrategy implements PopulateStrategyInterface<SimulationGenome> {
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

export class SourceMutationPopulateStrategy implements PopulateStrategyInterface<SimulationGenome> {
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

export class SubmatrixCrossoverStrategy implements CrossoverStrategyInterface<SimulationGenome> {
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

export class RandomCrossoverStrategy implements CrossoverStrategyInterface<SimulationGenome> {
  public cross(lhs: SimulationGenome, rhs: SimulationGenome, newGenomeId: number): SimulationGenome {
    const separator = createRandomInteger([1, lhs.typesConfig.FREQUENCIES.length-1]);
    const crossed = randomCrossTypesConfigs(lhs.typesConfig, rhs.typesConfig, separator);
    return { id: newGenomeId, typesConfig: crossed };
  }
}

export class ComposedCrossoverStrategy implements CrossoverStrategyInterface<SimulationGenome> {
  private readonly randomStrategy: CrossoverStrategyInterface<SimulationGenome>;
  private readonly subMatrixStrategy: CrossoverStrategyInterface<SimulationGenome>;

  constructor(randomizeConfig: RandomTypesConfig) {
    this.randomStrategy = new RandomCrossoverStrategy();
    this.subMatrixStrategy = new SubmatrixCrossoverStrategy(randomizeConfig);
  }

  public cross(lhs: SimulationGenome, rhs: SimulationGenome, newGenomeId: number): SimulationGenome {
    if (Math.random() > 0.5) {
      return this.randomStrategy.cross(lhs, rhs, newGenomeId);
    }

    return this.subMatrixStrategy.cross(lhs, rhs, newGenomeId);
  }
}

export class DefaultMutationStrategy extends BaseMutationStrategy<SimulationGenome, BaseMutationStrategyConfig> implements MutationStrategyInterface<SimulationGenome> {
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

export class SourceMutationStrategy extends DefaultMutationStrategy implements MutationStrategyInterface<SimulationGenome> {
  private readonly sourceTypesConfig: TypesConfig;

  constructor(config: BaseMutationStrategyConfig, randomizeConfig: RandomTypesConfig, sourceTypesConfig: TypesConfig) {
    super(config, randomizeConfig);
    this.sourceTypesConfig = sourceTypesConfig;
  }

  public mutate(genome: SimulationGenome, newGenomeId: number): SimulationGenome {
    return super.mutate({ id: genome.id, typesConfig: this.sourceTypesConfig }, newGenomeId);
  }
}

export class ReferenceMetricsStrategy extends BaseMetricsStrategy<SimulationGenome, SimulationMetricsStrategyConfig<SimulationReferenceTaskConfig>, SimulationReferenceTaskConfig> {
  protected createTaskInput(genome: SimulationGenome): SimulationReferenceTaskConfig {
    return [genome.id, this.config.worldConfig, genome.typesConfig, this.config.checkpoints, this.config.repeats];
  }
}

export class ReferenceMultiprocessingMetricsStrategy extends BaseMultiprocessingMetricsStrategy<SimulationGenome, SimulationMultiprocessingMetricsStrategyConfig<SimulationReferenceTaskConfig>, SimulationReferenceTaskConfig> {
  protected createTaskInput(genome: SimulationGenome): SimulationReferenceTaskConfig {
    return [genome.id, this.config.worldConfig, genome.typesConfig, this.config.checkpoints, this.config.repeats];
  }
}

export class ReferenceCachedMultiprocessingMetricsStrategy extends BaseCachedMultiprocessingMetricsStrategy<SimulationGenome, SimulationMultiprocessingMetricsStrategyConfig<SimulationReferenceTaskConfig>, SimulationReferenceTaskConfig> {
  protected createTaskInput(genome: SimulationGenome): SimulationReferenceTaskConfig {
    return [genome.id, this.config.worldConfig, genome.typesConfig, this.config.checkpoints, this.config.repeats];
  }

  protected getGenomeId(input: SimulationReferenceTaskConfig): number {
    return input[0];
  }
}

export class ClusterizationCachedMultiprocessingMetricsStrategy extends BaseCachedMultiprocessingMetricsStrategy<SimulationGenome, SimulationMultiprocessingMetricsStrategyConfig<SimulationClusterizationTaskConfig>, SimulationClusterizationTaskConfig> {
  private weights: ClusterizationWeightsConfig;

  constructor(config: SimulationMultiprocessingMetricsStrategyConfig<SimulationClusterizationTaskConfig>, weights: ClusterizationWeightsConfig) {
    super(config);
    this.weights = weights;
  }

  clone(): ClusterizationCachedMultiprocessingMetricsStrategy {
    return new ClusterizationCachedMultiprocessingMetricsStrategy(this.config, this.weights);
  }

  protected createTaskInput(genome: SimulationGenome): SimulationClusterizationTaskConfig {
    return [genome.id, this.config.worldConfig, genome.typesConfig, this.weights, this.config.checkpoints, this.config.repeats];
  }

  protected getGenomeId(input: SimulationClusterizationTaskConfig): number {
    return input[0];
  }
}

export class ClusterizationFitnessStrategy implements FitnessStrategyInterface {
  score(results: GenerationMetricsMatrix): GenerationFitnessColumn {
    return results.map((result) => arraySum(result));
  }
}
