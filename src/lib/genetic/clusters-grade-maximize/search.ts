import type {
  GeneticSearchInterface,
  GeneticSearchStrategyConfig,
  ComposedGeneticSearchConfig,
} from "genetic-search";
import type { SimulationGenome } from '../types';
import type { ClusterGradeMaximizeConfigFactoryConfig } from "./types";
import {
  ComposedGeneticSearch,
  GeneticSearch,
  DummyPhenomeCache,
  WeightedAgeAveragePhenomeCache,
  DescendingSortingStrategy,
  TournamentSelectionStrategy,
  RandomSelectionStrategy,
} from "genetic-search";
import { setTypesCountToRandomizeConfigCollection } from '../utils';
import {
  RandomPopulateStrategy,
  ClassicCrossoverStrategy,
  ZeroValuesPopulateStrategy,
} from '../strategies';
import { createComposedMutationStrategy, createSelectionStrategy } from "../factories";
import { ClusterizationMultiprocessingPhenomeStrategy } from "./multiprocessing";
import { ClustersGradeMaximizeNormalizedFitnessStrategy } from "./strategies";

export function createClusterGradeMaximize(config: ClusterGradeMaximizeConfigFactoryConfig): GeneticSearchInterface<SimulationGenome> {
  config.phenomeStrategyConfig.worldConfig = config.worldConfig;

  const populateRandomTypesConfigCollection = setTypesCountToRandomizeConfigCollection(
    config.populateRandomizeConfigCollection,
    config.typesCount,
  );
  const mutationRandomTypesConfigCollection = setTypesCountToRandomizeConfigCollection(
    config.mutationRandomizeConfigCollection,
    config.typesCount,
  );

  const cache = config.useCache
    ? new WeightedAgeAveragePhenomeCache(config.genomeAgeWeight)
    : new DummyPhenomeCache();

  const populateStrategy = config.randomizeStartPopulation
    ? new RandomPopulateStrategy(populateRandomTypesConfigCollection, config.transformationConfig)
    : new ZeroValuesPopulateStrategy(config.typesCount, config.transformationConfig);

  const strategyConfig: GeneticSearchStrategyConfig<SimulationGenome> = {
    populate: populateStrategy,
    phenome: new ClusterizationMultiprocessingPhenomeStrategy(config.phenomeStrategyConfig, config.clusterizationConfig.params),
    fitness: new ClustersGradeMaximizeNormalizedFitnessStrategy(config.clusterizationConfig.weights),
    sorting: new DescendingSortingStrategy(),
    selection: createSelectionStrategy(config.selectionStrategyFactoryConfig),
    mutation: createComposedMutationStrategy(config.mutationStrategyConfig, mutationRandomTypesConfigCollection),
    crossover: new ClassicCrossoverStrategy(),
    cache,
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
