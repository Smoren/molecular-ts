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
  SimulationMetricsStrategyConfig,
  ClusterizationTaskConfig,
  ClusterizationWeightsConfig,
} from './types';
import type { RandomTypesConfig, TypesConfig } from '../config/types';
import type { ReferenceTaskConfig } from './types';
import { BaseMetricsStrategy } from "genetic-search";
import {
  copyIndexInTypesConfig,
  createTransparentTypesConfig,
  crossTypesConfigs,
  crossTypesConfigsByIndexes,
  randomCrossTypesConfigs,
  randomizeTypesConfig,
} from '../config/atom-types';
import { createRandomInteger, getIndexByFrequencies } from '../math';
import { fullCopyObject } from '../utils/functions';
import { getRandomArrayItem } from "../math/random";
import { shuffleArray } from "../math/helpers";
import { clusterizationFitnessMul } from "./fitness";

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

export class ZeroValuesPopulateStrategy implements PopulateStrategyInterface<SimulationGenome> {
  private readonly typesCount: number;

  constructor(typesCount: number) {
    this.typesCount = typesCount;
  }

  public populate(size: number, idGenerator: IdGeneratorInterface<SimulationGenome>): Population<SimulationGenome> {
    const population: Population<SimulationGenome> = [];
    for (let i = 0; i < size; i++) {
      population.push({
        id: idGenerator.nextId(),
        typesConfig: createTransparentTypesConfig(this.typesCount),
      });
    }
    return population;
  }
}

export class SourceMutationPopulateStrategy implements PopulateStrategyInterface<SimulationGenome> {
  private readonly sourceTypesConfigCollection: TypesConfig[];
  private readonly randomizeConfigCollection: RandomTypesConfig[];
  private readonly probabilities: number[];

  constructor(sourceTypesConfigCollection: TypesConfig[], randomizeConfigCollection: RandomTypesConfig[], probabilities: number[]) {
    this.sourceTypesConfigCollection = sourceTypesConfigCollection;
    this.randomizeConfigCollection = randomizeConfigCollection;
    this.probabilities = probabilities;
  }

  public populate(size: number, idGenerator: IdGeneratorInterface<SimulationGenome>): Population<SimulationGenome> {
    const population: Population<SimulationGenome> = [];
    for (let i = 0; i < size; i++) {
      const randomizeConfig = getRandomArrayItem(this.randomizeConfigCollection);
      const probability = getRandomArrayItem(this.probabilities);
      const inputTypesConfig = fullCopyObject(getRandomArrayItem(this.sourceTypesConfigCollection));
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

export class ClassicCrossoverStrategy implements CrossoverStrategyInterface<SimulationGenome> {
  public cross(lhs: SimulationGenome, rhs: SimulationGenome, newGenomeId: number): SimulationGenome {
    const crossed = crossTypesConfigsByIndexes(lhs.typesConfig, rhs.typesConfig, this.getRandomIndexes(lhs));
    return { id: newGenomeId, typesConfig: crossed };
  }

  protected getRandomIndexes(genome: SimulationGenome): number[] {
    const allIndexes = [...Array(genome.typesConfig.FREQUENCIES.length).keys()];
    return shuffleArray(allIndexes).slice(0, Math.floor(genome.typesConfig.FREQUENCIES.length / 2));
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
  private readonly probabilities: number[];
  private readonly randomizeConfigCollection: RandomTypesConfig[];

  constructor(probabilities: number[], randomizeConfigCollection: RandomTypesConfig[]) {
    this.probabilities = probabilities;
    this.randomizeConfigCollection = randomizeConfigCollection;
  }

  mutate(genome: SimulationGenome, newGenomeId: number): SimulationGenome {
    const randomizeConfig = getRandomArrayItem(this.randomizeConfigCollection);
    const probability = getRandomArrayItem(this.probabilities);
    const inputTypesConfig = fullCopyObject(genome.typesConfig);
    const randomizedTypesConfig = randomizeTypesConfig(randomizeConfig, inputTypesConfig);
    const mutatedTypesConfig = randomCrossTypesConfigs(randomizedTypesConfig, inputTypesConfig, probability);

    return { id: newGenomeId, typesConfig: mutatedTypesConfig };
  }
}

export class CopyTypeMutationStrategy implements MutationStrategyInterface<SimulationGenome> {
  mutate(genome: SimulationGenome, newGenomeId: number): SimulationGenome {
    const typesIndexes = shuffleArray([...genome.typesConfig.FREQUENCIES.keys()]);
    const sourceType = typesIndexes.pop() as number;
    const targetType = typesIndexes.pop() ?? sourceType;
    const newTypesConfig = copyIndexInTypesConfig(genome.typesConfig, sourceType, targetType);

    return { id: newGenomeId, typesConfig: newTypesConfig };
  }
}

export class ComposedMutationStrategy implements MutationStrategyInterface<SimulationGenome> {
  private readonly strategies: MutationStrategyInterface<SimulationGenome>[];
  private readonly probabilities: number[];

  constructor(strategies: MutationStrategyInterface<SimulationGenome>[], probabilities: number[]) {
    if (strategies.length !== probabilities.length) {
      throw new Error('Strategies and probabilities must have the same length.');
    }
    this.strategies = strategies;
    this.probabilities = probabilities;
  }

  mutate(genome: SimulationGenome, newGenomeId: number): SimulationGenome {
    const index = getIndexByFrequencies(this.probabilities);
    return this.strategies[index].mutate(genome, newGenomeId);
  }
}

export class SourceMutationStrategy extends DynamicProbabilityMutationStrategy implements MutationStrategyInterface<SimulationGenome> {
  private readonly sourceTypesConfig: TypesConfig;

  constructor(probabilities: number[], randomizeConfigCollection: RandomTypesConfig[], sourceTypesConfig: TypesConfig) {
    super(probabilities, randomizeConfigCollection);
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

export class ClusterizationMetricsStrategy extends BaseMetricsStrategy<SimulationGenome, SimulationMetricsStrategyConfig<ClusterizationTaskConfig>, ClusterizationTaskConfig> {
  private readonly weights: ClusterizationWeightsConfig;

  constructor(config: SimulationMetricsStrategyConfig<ClusterizationTaskConfig>, weights: ClusterizationWeightsConfig) {
    super(config);
    this.weights = weights;
  }

  protected createTaskInput(genome: SimulationGenome): ClusterizationTaskConfig {
    return [genome.id, this.config.worldConfig, genome.typesConfig, this.weights, this.config.checkpoints, this.config.repeats];
  }
}

export class ClusterizationFitnessStrategy implements FitnessStrategyInterface {
  private readonly weights: ClusterizationWeightsConfig;

  constructor(weights: ClusterizationWeightsConfig) {
    this.weights = weights;
  }

  score(results: GenerationMetricsMatrix): GenerationFitnessColumn {
    return results.map((result) => clusterizationFitnessMul(result, this.weights));
  }
}
