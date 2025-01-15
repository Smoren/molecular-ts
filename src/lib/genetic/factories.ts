import {
  ComposedGeneticSearch,
  GeneticSearch,
  SimpleMetricsCache,
  WeightedAgeAverageMetricsCache,
  ReferenceLossFitnessStrategy,
} from "genetic-search";
import type {
  GeneticSearchInterface,
  GeneticSearchReferenceConfig,
  GeneticSearchStrategyConfig,
  ComposedGeneticSearchConfig,
} from "genetic-search";
import type {
  ClusterGradeMaximizeConfigFactoryConfig,
  ReferenceSearchConfigFactoryConfig,
  ReferenceRandomSearchConfigFactoryConfig,
  SimulationGenome, MutationStrategyConfig,
} from './types';
import {
  convertWeightsToSummaryMatrixRow,
  setTypesCountToRandomizeConfigCollection,
  convertSummaryMatrixRowObjectToArray,
  convertSummaryMatrixRowToObject,
} from '../genetic/helpers';
import {
  ClusterizationFitnessStrategy,
  ComposedCrossoverStrategy,
  DynamicProbabilityMutationStrategy,
  RandomPopulateStrategy,
  SourceMutationPopulateStrategy,
  SourceMutationStrategy,
  ClassicCrossoverStrategy,
  ComposedMutationStrategy,
  CopyTypeMutationStrategy, ZeroValuesPopulateStrategy,
} from '../genetic/strategies';
import { repeatRunSimulationForReferenceGrade } from './runners';
import {
  ClusterizationMultiprocessingMetricsStrategy,
  ReferenceMultiprocessingMetricsStrategy,
} from "./multiprocessing";
import type { RandomTypesConfig } from "../config/types";

export function createReferenceSearch(config: ReferenceSearchConfigFactoryConfig): GeneticSearchInterface<SimulationGenome> {
  const typesCount = config.referenceTypesConfig.FREQUENCIES.length;
  config.metricsStrategyConfig.worldConfig = config.worldConfig;

  const [
    populateRandomTypesConfig,
    mutationRandomTypesConfig,
    crossoverRandomTypesConfig,
  ] = setTypesCountToRandomizeConfigCollection([
    config.populateRandomizeConfig,
    config.mutationRandomizeConfig,
    config.crossoverRandomizeConfig,
  ], typesCount);

  const summaryRowObject = config.referenceSummaryRowObject ?? convertSummaryMatrixRowToObject(repeatRunSimulationForReferenceGrade(
    config.worldConfig,
    config.referenceTypesConfig,
    config.metricsStrategyConfig.checkpoints,
    config.metricsStrategyConfig.repeats,
  ), typesCount);

  if (config.targetClustersScore !== undefined) {
    summaryRowObject.clustersScore = config.targetClustersScore;
  }

  const reference = convertSummaryMatrixRowObjectToArray(summaryRowObject);

  const referenceConfig: GeneticSearchReferenceConfig = {
    reference,
    weights: convertWeightsToSummaryMatrixRow(config.weights, typesCount),
  };

  const strategyConfig: GeneticSearchStrategyConfig<SimulationGenome> = {
    populate: new RandomPopulateStrategy([populateRandomTypesConfig]),
    metrics: new ReferenceMultiprocessingMetricsStrategy(config.metricsStrategyConfig),
    fitness: new ReferenceLossFitnessStrategy(referenceConfig),
    mutation: new DynamicProbabilityMutationStrategy(config.mutationStrategyConfig.dynamicProbabilities, [mutationRandomTypesConfig]),
    crossover: new ComposedCrossoverStrategy([crossoverRandomTypesConfig]),
    cache: new SimpleMetricsCache(),
  };

  // TODO to config file
  const composedConfig: ComposedGeneticSearchConfig = {
    eliminators: {
      populationSize: config.geneticSearchMacroConfig.populationSize / 5,
      survivalRate: 0.5,
      crossoverRate: 0.5,
    },
    final: {
      populationSize: 5,
      survivalRate: 0.5,
      crossoverRate: 0.5,
    },
  }

  return new ComposedGeneticSearch<SimulationGenome>(composedConfig, strategyConfig);
}

export function createReferenceRandomSearch(config: ReferenceRandomSearchConfigFactoryConfig): GeneticSearchInterface<SimulationGenome> {
  if (config.referenceSummaryRowObject === undefined) {
    if (config.referenceTypesConfig.FREQUENCIES.length !== config.sourceTypesConfig.FREQUENCIES.length) {
      throw new Error('Reference and source types must have same length');
    }
  } else {
    if (config.referenceSummaryRowObject.atomTypeMeanSpeed.length !== config.sourceTypesConfig.FREQUENCIES.length) {
      throw new Error('Reference and source types must have same length');
    }
  }

  const typesCount = config.referenceTypesConfig.FREQUENCIES.length;
  config.metricsStrategyConfig.worldConfig = config.worldConfig;

  const [
    populateRandomTypesConfig,
    mutationRandomTypesConfig,
    crossoverRandomTypesConfig,
  ] = setTypesCountToRandomizeConfigCollection([
    config.populateRandomizeConfig,
    config.mutationRandomizeConfig,
    config.crossoverRandomizeConfig,
  ], typesCount);

  const summaryRowObject = config.referenceSummaryRowObject ?? convertSummaryMatrixRowToObject(repeatRunSimulationForReferenceGrade(
    config.worldConfig,
    config.referenceTypesConfig,
    config.metricsStrategyConfig.checkpoints,
    config.metricsStrategyConfig.repeats,
  ), typesCount);

  if (config.targetClustersScore !== undefined) {
    summaryRowObject.clustersScore = config.targetClustersScore;
  }

  const reference = convertSummaryMatrixRowObjectToArray(summaryRowObject);

  const referenceConfig: GeneticSearchReferenceConfig = {
    reference,
    weights: convertWeightsToSummaryMatrixRow(config.weights, typesCount),
  };

  const strategyConfig: GeneticSearchStrategyConfig<SimulationGenome> = {
    populate: new SourceMutationPopulateStrategy(
      [config.sourceTypesConfig],
      [populateRandomTypesConfig],
      config.mutationStrategyConfig.dynamicProbabilities,
    ),
    metrics: new ReferenceMultiprocessingMetricsStrategy(config.metricsStrategyConfig),
    fitness: new ReferenceLossFitnessStrategy(referenceConfig),
    mutation: new SourceMutationStrategy(config.mutationStrategyConfig.dynamicProbabilities, [mutationRandomTypesConfig], config.sourceTypesConfig),
    crossover: new ComposedCrossoverStrategy([crossoverRandomTypesConfig]),
    cache: new SimpleMetricsCache(),
  };

  return new GeneticSearch<SimulationGenome>(config.geneticSearchMacroConfig, strategyConfig);
}

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
    metrics: new ClusterizationMultiprocessingMetricsStrategy(config.runnerStrategyConfig, config.weightsConfig),
    fitness: new ClusterizationFitnessStrategy(config.weightsConfig),
    mutation: createComposedMutationStrategy(config.mutationStrategyConfig, mutationRandomTypesConfigCollection),
    crossover: new ClassicCrossoverStrategy(),
    cache: config.useConstCache ? new SimpleMetricsCache() : new WeightedAgeAverageMetricsCache(config.genomeAgeWeight),
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
