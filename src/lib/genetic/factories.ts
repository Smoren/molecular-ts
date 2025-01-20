import type {
  GeneticSearchInterface,
  GeneticSearchStrategyConfig,
  ComposedGeneticSearchConfig,
} from "genetic-search";
import {
  ComposedGeneticSearch,
  GeneticSearch,
  SimplePhenotypeCache,
  WeightedAgeAveragePhenotypeCache,
  DescendingSortingStrategy,
  RandomSelectionStrategy,
} from "genetic-search";
import type {
  ClusterGradeMaximizeConfigFactoryConfig,
  SimulationGenome,
  MutationStrategyConfig,
} from './types';
import { setTypesCountToRandomizeConfigCollection } from './utils';
import {
  ClusterizationFitnessStrategy,
  DynamicProbabilityMutationStrategy,
  RandomPopulateStrategy,
  ClassicCrossoverStrategy,
  ComposedMutationStrategy,
  CopyTypeMutationStrategy,
  ZeroValuesPopulateStrategy,
} from '../genetic/strategies';
import { ClusterizationMultiprocessingPhenotypeStrategy } from "./multiprocessing";
import type { RandomTypesConfig } from "../config/types";

export function createClusterGradeMaximize(config: ClusterGradeMaximizeConfigFactoryConfig): GeneticSearchInterface<SimulationGenome> {
  config.runnerStrategyConfig.worldConfig = config.worldConfig;

  const populateRandomTypesConfigCollection = setTypesCountToRandomizeConfigCollection(
    config.populateRandomizeConfigCollection,
    config.typesCount,
  );
  const mutationRandomTypesConfigCollection = setTypesCountToRandomizeConfigCollection(
    config.mutationRandomizeConfigCollection,
    config.typesCount,
  );

  const strategyConfig: GeneticSearchStrategyConfig<SimulationGenome> = {
    // TODO choice to config
    // populate: new ZeroValuesPopulateStrategy(config.typesCount),
    populate: new RandomPopulateStrategy(populateRandomTypesConfigCollection),
    phenotype: new ClusterizationMultiprocessingPhenotypeStrategy(config.runnerStrategyConfig, config.weightsConfig),
    fitness: new ClusterizationFitnessStrategy(config.weightsConfig),
    sorting: new DescendingSortingStrategy(),
    selection: new RandomSelectionStrategy(2),
    mutation: createComposedMutationStrategy(config.mutationStrategyConfig, mutationRandomTypesConfigCollection),
    crossover: new ClassicCrossoverStrategy(),
    cache: config.useConstCache ? new SimplePhenotypeCache() : new WeightedAgeAveragePhenotypeCache(config.genomeAgeWeight),
  };

  let result: GeneticSearchInterface<SimulationGenome>;

  if (config.useComposedAlgo) {
    const composedConfig: ComposedGeneticSearchConfig = {
      eliminators: {
        populationSize: Math.round(config.geneticSearchMacroConfig.populationSize / config.composedFinalPopulation),
        survivalRate: config.geneticSearchMacroConfig.survivalRate,
        crossoverRate: config.geneticSearchMacroConfig.crossoverRate,
      },
      final: {
        populationSize: config.composedFinalPopulation,
        survivalRate: config.geneticSearchMacroConfig.survivalRate,
        crossoverRate: config.geneticSearchMacroConfig.crossoverRate,
      },
    };

    result = new ComposedGeneticSearch<SimulationGenome>(composedConfig, strategyConfig);
  } else {
    result = new GeneticSearch<SimulationGenome>(config.geneticSearchMacroConfig, strategyConfig);
  }

  return result;
}

export function createComposedMutationStrategy(config: MutationStrategyConfig, randomTypesConfigCollection: RandomTypesConfig[]): ComposedMutationStrategy {
  return new ComposedMutationStrategy([
    new DynamicProbabilityMutationStrategy(config.dynamicProbabilities, randomTypesConfigCollection),
    new CopyTypeMutationStrategy(),
  ], config.composedProbabilities)
}
