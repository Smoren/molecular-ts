import type {
  GeneticSearchInterface,
  GeneticSearchReferenceConfig,
  GeneticSearchStrategyConfig,
  ComposedGeneticSearchConfig,
} from "genetic-search";
import type {
  ClusterGradeMaximizeConfigFactoryConfig,
  ComplexGeneticSearchConfigFactoryConfig,
  ComplexRandomSearchConfigFactoryConfig,
  SimulationGenome,
} from '../types/genetic';
import {
  convertWeightsToSummaryMatrixRow,
  setTypesCountToRandomizeConfigCollection,
  convertSummaryMatrixRowObjectToArray,
  convertSummaryMatrixRowToObject,
} from '../genetic/helpers';
import {
  SimulationCachedMultiprocessingRunnerStrategy,
  SimulationClusterScoringStrategy,
  SimulationComposedCrossoverStrategy,
  SimulationDefaultMutationStrategy,
  SimulationRandomPopulateStrategy,
  SimulationSourceMutationPopulateStrategy,
  SimulationSourceMutationStrategy,
} from '../genetic/strategies';
import { ComposedGeneticSearch, GeneticSearch, ReferenceLossScoringStrategy } from "genetic-search";
import { repeatRunSimulationForComplexGrade } from './grade';

export function createComplexGeneticSearch(config: ComplexGeneticSearchConfigFactoryConfig): GeneticSearchInterface<SimulationGenome> {
  const typesCount = config.referenceTypesConfig.FREQUENCIES.length;
  config.runnerStrategyConfig.worldConfig = config.worldConfig;

  const [
    populateRandomTypesConfig,
    mutationRandomTypesConfig,
    crossoverRandomTypesConfig,
  ] = setTypesCountToRandomizeConfigCollection([
    config.populateRandomizeConfig,
    config.mutationRandomizeConfig,
    config.crossoverRandomizeConfig,
  ], typesCount);

  const summaryRowObject = config.referenceSummaryRowObject ?? convertSummaryMatrixRowToObject(repeatRunSimulationForComplexGrade(
    config.worldConfig,
    config.referenceTypesConfig,
    config.runnerStrategyConfig.checkpoints,
    config.runnerStrategyConfig.repeats,
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
    populate: new SimulationRandomPopulateStrategy(populateRandomTypesConfig),
    scoring: new ReferenceLossScoringStrategy(referenceConfig),
    runner: new SimulationCachedMultiprocessingRunnerStrategy(config.runnerStrategyConfig),
    mutation: new SimulationDefaultMutationStrategy(config.mutationStrategyConfig, mutationRandomTypesConfig),
    crossover: new SimulationComposedCrossoverStrategy(crossoverRandomTypesConfig),
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

export function createComplexRandomSearch(config: ComplexRandomSearchConfigFactoryConfig): GeneticSearchInterface<SimulationGenome> {
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
  config.runnerStrategyConfig.worldConfig = config.worldConfig;

  const [
    populateRandomTypesConfig,
    mutationRandomTypesConfig,
    crossoverRandomTypesConfig,
  ] = setTypesCountToRandomizeConfigCollection([
    config.populateRandomizeConfig,
    config.mutationRandomizeConfig,
    config.crossoverRandomizeConfig,
  ], typesCount);

  const summaryRowObject = config.referenceSummaryRowObject ?? convertSummaryMatrixRowToObject(repeatRunSimulationForComplexGrade(
    config.worldConfig,
    config.referenceTypesConfig,
    config.runnerStrategyConfig.checkpoints,
    config.runnerStrategyConfig.repeats,
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
    populate: new SimulationSourceMutationPopulateStrategy(
      config.sourceTypesConfig,
      populateRandomTypesConfig,
      config.mutationStrategyConfig.probability,
    ),
    scoring: new ReferenceLossScoringStrategy(referenceConfig),
    runner: new SimulationCachedMultiprocessingRunnerStrategy(config.runnerStrategyConfig),
    mutation: new SimulationSourceMutationStrategy(config.mutationStrategyConfig, mutationRandomTypesConfig, config.sourceTypesConfig),
    crossover: new SimulationComposedCrossoverStrategy(crossoverRandomTypesConfig),
  };

  return new GeneticSearch<SimulationGenome>(config.geneticSearchMacroConfig, strategyConfig);
}

export function createClusterGradeMaximize(config: ClusterGradeMaximizeConfigFactoryConfig): GeneticSearchInterface<SimulationGenome> {
  config.runnerStrategyConfig.worldConfig = config.worldConfig;

  const [
    populateRandomTypesConfig,
    mutationRandomTypesConfig,
    crossoverRandomTypesConfig,
  ] = setTypesCountToRandomizeConfigCollection([
    config.populateRandomizeConfig,
    config.mutationRandomizeConfig,
    config.crossoverRandomizeConfig,
  ], config.typesCount);

  const strategyConfig: GeneticSearchStrategyConfig<SimulationGenome> = {
    populate: new SimulationRandomPopulateStrategy(populateRandomTypesConfig),
    scoring: new SimulationClusterScoringStrategy(),
    runner: new SimulationCachedMultiprocessingRunnerStrategy(config.runnerStrategyConfig),
    mutation: new SimulationDefaultMutationStrategy(config.mutationStrategyConfig, mutationRandomTypesConfig),
    crossover: new SimulationComposedCrossoverStrategy(crossoverRandomTypesConfig),
  };

  // TODO to config file
  // const composedConfig: ComposedGeneticSearchConfig = {
  //   eliminators: {
  //     populationSize: config.geneticSearchMacroConfig.populationSize / 5,
  //     survivalRate: 0.5,
  //     crossoverRate: 0.5,
  //   },
  //   final: {
  //     populationSize: 5,
  //     survivalRate: 0.5,
  //     crossoverRate: 0.5,
  //   },
  // }

  return new GeneticSearch<SimulationGenome>(config.geneticSearchMacroConfig, strategyConfig);
  // return new ComposedGeneticSearch<SimulationGenome>(composedConfig, strategyConfig);
}
