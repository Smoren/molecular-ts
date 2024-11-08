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
  SimulationMetricsStrategyConfig, ClusterizationTaskConfig, ClusterizationWeightsConfig,
} from '../types/genetic';
import type { RandomTypesConfig, TypesConfig } from '../types/config';
import type { ReferenceTaskConfig } from '../types/genetic';
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
import { getRandomArrayItem } from "@/lib/math/random";

export class RandomPopulateStrategy implements PopulateStrategyInterface<SimulationGenome> {
  private readonly randomizeConfigCollection: RandomTypesConfig[];

  constructor(randomizeConfigCollection: RandomTypesConfig[]) {
    this.randomizeConfigCollection = randomizeConfigCollection;
  }

  public populate(size: number, nextId: () => number): Population<SimulationGenome> {
    const population: Population<SimulationGenome> = [];
    for (let i = 0; i < size; i++) {
      const randomizeConfig = getRandomArrayItem(this.randomizeConfigCollection);
      population.push({
        id: nextId(),
        typesConfig: randomizeTypesConfig(
          randomizeConfig,
          createTransparentTypesConfig(randomizeConfig.TYPES_COUNT),
        ),
      });
    }
    return population;
  }
}

export class SourceMutationPopulateStrategy implements PopulateStrategyInterface<SimulationGenome> {
  private readonly sourceTypesConfig: TypesConfig;
  private readonly randomizeConfigCollection: RandomTypesConfig[];
  private readonly probability: number;

  constructor(sourceTypesConfig: TypesConfig, randomizeConfigCollection: RandomTypesConfig[], probability: number) {
    this.sourceTypesConfig = sourceTypesConfig;
    this.randomizeConfigCollection = randomizeConfigCollection;
    this.probability = probability;
  }

  public populate(size: number, nextId: () => number): Population<SimulationGenome> {
    const population: Population<SimulationGenome> = [];
    for (let i = 0; i < size; i++) {
      const randomizeConfig = getRandomArrayItem(this.randomizeConfigCollection);
      const inputTypesConfig = fullCopyObject(this.sourceTypesConfig);
      const randomizedTypesConfig = randomizeTypesConfig(randomizeConfig, inputTypesConfig);
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
  private readonly randomizeConfigCollection: RandomTypesConfig[];

  constructor(randomizeConfigCollection: RandomTypesConfig[]) {
    this.randomizeConfigCollection = randomizeConfigCollection;
  }

  public cross(lhs: SimulationGenome, rhs: SimulationGenome, newGenomeId: number): SimulationGenome {
    const randomizeConfig = getRandomArrayItem(this.randomizeConfigCollection);
    const separator = createRandomInteger([1, lhs.typesConfig.FREQUENCIES.length-1]);
    const crossed = crossTypesConfigs(lhs.typesConfig, rhs.typesConfig, separator);
    const randomized = randomizeTypesConfig(randomizeConfig, crossed, separator);
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

  constructor(randomizeConfigCollection: RandomTypesConfig[]) {
    this.randomStrategy = new RandomCrossoverStrategy();
    this.subMatrixStrategy = new SubmatrixCrossoverStrategy(randomizeConfigCollection);
  }

  public cross(lhs: SimulationGenome, rhs: SimulationGenome, newGenomeId: number): SimulationGenome {
    if (Math.random() > 0.5) {
      return this.randomStrategy.cross(lhs, rhs, newGenomeId);
    }

    return this.subMatrixStrategy.cross(lhs, rhs, newGenomeId);
  }
}

export class DefaultMutationStrategy extends BaseMutationStrategy<SimulationGenome, BaseMutationStrategyConfig> implements MutationStrategyInterface<SimulationGenome> {
  private readonly randomizeConfigCollection: RandomTypesConfig[];

  constructor(config: BaseMutationStrategyConfig, randomizeConfigCollection: RandomTypesConfig[]) {
    super(config);
    this.randomizeConfigCollection = randomizeConfigCollection;
  }

  mutate(genome: SimulationGenome, newGenomeId: number): SimulationGenome {
    const randomizeConfig = getRandomArrayItem(this.randomizeConfigCollection);
    const inputTypesConfig = fullCopyObject(genome.typesConfig);
    const randomizedTypesConfig = randomizeTypesConfig(randomizeConfig, inputTypesConfig);
    const mutatedTypesConfig = randomCrossTypesConfigs(randomizedTypesConfig, inputTypesConfig, this.config.probability);

    return { id: newGenomeId, typesConfig: mutatedTypesConfig };
  }
}

export class SourceMutationStrategy extends DefaultMutationStrategy implements MutationStrategyInterface<SimulationGenome> {
  private readonly sourceTypesConfig: TypesConfig;

  constructor(config: BaseMutationStrategyConfig, randomizeConfigCollection: RandomTypesConfig[], sourceTypesConfig: TypesConfig) {
    super(config, randomizeConfigCollection);
    this.sourceTypesConfig = sourceTypesConfig;
  }

  public mutate(genome: SimulationGenome, newGenomeId: number): SimulationGenome {
    return super.mutate({ id: genome.id, typesConfig: this.sourceTypesConfig }, newGenomeId);
  }
}

export class ReferenceMetricsStrategy extends BaseMetricsStrategy<SimulationGenome, SimulationMetricsStrategyConfig<ReferenceTaskConfig>, ReferenceTaskConfig> {
  protected createTaskInput(genome: SimulationGenome): ReferenceTaskConfig {
    return [genome.id, this.config.worldConfig, genome.typesConfig, this.config.checkpoints, this.config.repeats];
  }
}

export class ReferenceMultiprocessingMetricsStrategy extends BaseMultiprocessingMetricsStrategy<SimulationGenome, SimulationMultiprocessingMetricsStrategyConfig<ReferenceTaskConfig>, ReferenceTaskConfig> {
  protected createTaskInput(genome: SimulationGenome): ReferenceTaskConfig {
    return [genome.id, this.config.worldConfig, genome.typesConfig, this.config.checkpoints, this.config.repeats];
  }
}

export class ReferenceCachedMultiprocessingMetricsStrategy extends BaseCachedMultiprocessingMetricsStrategy<SimulationGenome, SimulationMultiprocessingMetricsStrategyConfig<ReferenceTaskConfig>, ReferenceTaskConfig> {
  protected createTaskInput(genome: SimulationGenome): ReferenceTaskConfig {
    return [genome.id, this.config.worldConfig, genome.typesConfig, this.config.checkpoints, this.config.repeats];
  }

  protected getGenomeId(input: ReferenceTaskConfig): number {
    return input[0];
  }
}

export class ClusterizationCachedMultiprocessingMetricsStrategy extends BaseCachedMultiprocessingMetricsStrategy<SimulationGenome, SimulationMultiprocessingMetricsStrategyConfig<ClusterizationTaskConfig>, ClusterizationTaskConfig> {
  private weights: ClusterizationWeightsConfig;

  constructor(config: SimulationMultiprocessingMetricsStrategyConfig<ClusterizationTaskConfig>, weights: ClusterizationWeightsConfig) {
    super(config);
    this.weights = weights;
  }

  clone(): ClusterizationCachedMultiprocessingMetricsStrategy {
    return new ClusterizationCachedMultiprocessingMetricsStrategy(this.config, this.weights);
  }

  protected createTaskInput(genome: SimulationGenome): ClusterizationTaskConfig {
    return [genome.id, this.config.worldConfig, genome.typesConfig, this.weights, this.config.checkpoints, this.config.repeats];
  }

  protected getGenomeId(input: ClusterizationTaskConfig): number {
    return input[0];
  }
}

export class ClusterizationFitnessStrategy implements FitnessStrategyInterface {
  score(results: GenerationMetricsMatrix): GenerationFitnessColumn {
    return results.map((result) => arraySum(result));
  }
}
