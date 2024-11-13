import type {
  CrossoverStrategyInterface,
  FitnessStrategyInterface,
  GenerationFitnessColumn,
  GenerationMetricsMatrix,
  IdGeneratorInterface,
  MutationStrategyInterface,
  PopulateStrategyInterface,
  Population,
} from "genetic-search";
import type {
  SimulationGenome,
  SimulationMultiprocessingMetricsStrategyConfig,
  SimulationMetricsStrategyConfig,
  ClusterizationTaskConfig,
  ClusterizationWeightsConfig,
  DynamicProbabilityMutationStrategyConfig,
} from './types';
import type { RandomTypesConfig, TypesConfig } from '../config/types';
import type { ReferenceTaskConfig } from './types';
import {
  BaseMetricsStrategy,
  BaseMultiprocessingMetricsStrategy,
} from "genetic-search";
import {
  createTransparentTypesConfig,
  crossTypesConfigs,
  randomCrossTypesConfigs,
  randomizeTypesConfig,
} from '../config/atom-types';
import { createRandomInteger } from '../math';
import { fullCopyObject } from '../utils/functions';
import { getRandomArrayItem } from "../math/random";
import { arrayProduct } from "../math/operations";

export class RandomPopulateStrategy implements PopulateStrategyInterface<SimulationGenome> {
  private readonly randomizeConfigCollection: RandomTypesConfig[];

  constructor(randomizeConfigCollection: RandomTypesConfig[]) {
    this.randomizeConfigCollection = randomizeConfigCollection;
  }

  public populate(size: number, idGenerator: IdGeneratorInterface<SimulationGenome>): Population<SimulationGenome> {
    const population: Population<SimulationGenome> = [];
    for (let i = 0; i < size; i++) {
      const randomizeConfig = getRandomArrayItem(this.randomizeConfigCollection);
      population.push({
        id: idGenerator.nextId(),
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
  private readonly probabilities: number[];

  constructor(sourceTypesConfig: TypesConfig, randomizeConfigCollection: RandomTypesConfig[], probabilities: number[]) {
    this.sourceTypesConfig = sourceTypesConfig;
    this.randomizeConfigCollection = randomizeConfigCollection;
    this.probabilities = probabilities;
  }

  public populate(size: number, idGenerator: IdGeneratorInterface<SimulationGenome>): Population<SimulationGenome> {
    const population: Population<SimulationGenome> = [];
    for (let i = 0; i < size; i++) {
      const randomizeConfig = getRandomArrayItem(this.randomizeConfigCollection);
      const probability = getRandomArrayItem(this.probabilities);
      const inputTypesConfig = fullCopyObject(this.sourceTypesConfig);
      const randomizedTypesConfig = randomizeTypesConfig(randomizeConfig, inputTypesConfig);
      const mutatedTypesConfig = randomCrossTypesConfigs(randomizedTypesConfig, inputTypesConfig, probability);

      population.push({
        id: idGenerator.nextId(),
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

export class DynamicProbabilityMutationStrategy implements MutationStrategyInterface<SimulationGenome> {
  private readonly config: DynamicProbabilityMutationStrategyConfig;
  private readonly randomizeConfigCollection: RandomTypesConfig[];

  constructor(config: DynamicProbabilityMutationStrategyConfig, randomizeConfigCollection: RandomTypesConfig[]) {
    this.config = config;
    this.randomizeConfigCollection = randomizeConfigCollection;
  }

  mutate(genome: SimulationGenome, newGenomeId: number): SimulationGenome {
    const randomizeConfig = getRandomArrayItem(this.randomizeConfigCollection);
    const probability = getRandomArrayItem(this.config.probabilities);
    const inputTypesConfig = fullCopyObject(genome.typesConfig);
    const randomizedTypesConfig = randomizeTypesConfig(randomizeConfig, inputTypesConfig);
    const mutatedTypesConfig = randomCrossTypesConfigs(randomizedTypesConfig, inputTypesConfig, probability);

    return { id: newGenomeId, typesConfig: mutatedTypesConfig };
  }
}

export class SourceMutationStrategy extends DynamicProbabilityMutationStrategy implements MutationStrategyInterface<SimulationGenome> {
  private readonly sourceTypesConfig: TypesConfig;

  constructor(config: DynamicProbabilityMutationStrategyConfig, randomizeConfigCollection: RandomTypesConfig[], sourceTypesConfig: TypesConfig) {
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

export class ClusterizationMultiprocessingMetricsStrategy extends BaseMultiprocessingMetricsStrategy<SimulationGenome, SimulationMultiprocessingMetricsStrategyConfig<ClusterizationTaskConfig>, ClusterizationTaskConfig> {
  private weights: ClusterizationWeightsConfig;

  constructor(config: SimulationMultiprocessingMetricsStrategyConfig<ClusterizationTaskConfig>, weights: ClusterizationWeightsConfig) {
    super(config);
    this.weights = weights;
  }

  protected createTaskInput(genome: SimulationGenome): ClusterizationTaskConfig {
    return [genome.id, this.config.worldConfig, genome.typesConfig, this.weights, this.config.checkpoints, this.config.repeats];
  }
}

export class ClusterizationFitnessStrategy implements FitnessStrategyInterface {
  score(results: GenerationMetricsMatrix): GenerationFitnessColumn {
    return results.map((result) => arrayProduct(result));
  }
}
