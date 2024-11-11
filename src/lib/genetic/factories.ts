import { ComposedGeneticSearch, GeneticSearch, ReferenceLossFitnessStrategy } from "genetic-search";
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
  SimulationGenome,
} from '../types/genetic';
import {
  convertWeightsToSummaryMatrixRow,
  setTypesCountToRandomizeConfigCollection,
  convertSummaryMatrixRowObjectToArray,
  convertSummaryMatrixRowToObject,
} from '../genetic/helpers';
import {
  ClusterizationMultiprocessingMetricsStrategy,
  ClusterizationCachedMultiprocessingMetricsStrategy,
  ReferenceCachedMultiprocessingMetricsStrategy,
  ClusterizationFitnessStrategy,
  ComposedCrossoverStrategy,
  DynamicProbabilityMutationStrategy,
  RandomPopulateStrategy,
  SourceMutationPopulateStrategy,
  SourceMutationStrategy,
} from '../genetic/strategies';
import { repeatRunSimulationForReferenceGrade } from './grade';

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
    metrics: new ReferenceCachedMultiprocessingMetricsStrategy(config.metricsStrategyConfig),
    fitness: new ReferenceLossFitnessStrategy(referenceConfig),
    mutation: new DynamicProbabilityMutationStrategy(config.mutationStrategyConfig, [mutationRandomTypesConfig]),
    crossover: new ComposedCrossoverStrategy([crossoverRandomTypesConfig]),
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
      config.sourceTypesConfig,
      [populateRandomTypesConfig],
      config.mutationStrategyConfig.probabilities,
    ),
    metrics: new ReferenceCachedMultiprocessingMetricsStrategy(config.metricsStrategyConfig),
    fitness: new ReferenceLossFitnessStrategy(referenceConfig),
    mutation: new SourceMutationStrategy(config.mutationStrategyConfig, [mutationRandomTypesConfig], config.sourceTypesConfig),
    crossover: new ComposedCrossoverStrategy([crossoverRandomTypesConfig]),
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
  const crossoverRandomTypesConfigCollection = setTypesCountToRandomizeConfigCollection(
    config.crossoverRandomizeConfigCollection,
    config.typesCount,
  );

  const metricsStrategy = config.useCache
    ? new ClusterizationCachedMultiprocessingMetricsStrategy(config.runnerStrategyConfig, config.weightsConfig)
    : new ClusterizationMultiprocessingMetricsStrategy(config.runnerStrategyConfig, config.weightsConfig);

  const strategyConfig: GeneticSearchStrategyConfig<SimulationGenome> = {
    populate: new RandomPopulateStrategy(populateRandomTypesConfigCollection),
    metrics: metricsStrategy,
    fitness: new ClusterizationFitnessStrategy(),
    mutation: new DynamicProbabilityMutationStrategy(config.mutationStrategyConfig, mutationRandomTypesConfigCollection),
    crossover: new ComposedCrossoverStrategy(crossoverRandomTypesConfigCollection),
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

  if (config.population !== undefined) {
    result.population = config.population;
  }

  return result;
}
