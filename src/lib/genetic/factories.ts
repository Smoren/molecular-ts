import type {
  GeneticSearchReferenceConfig,
  GeneticSearchInterface,
  StrategyConfig,
  SimulationGeneticSearchByTypesConfigFactoryConfig,
  SimulationRandomSearchByTypesConfigFactoryConfig,
  SimulationGenome,
} from '../types/genetic';
import {
  convertWeightsToSummaryMatrixRow,
  setTypesCountToRandomizeConfigCollection,
  convertSummaryMatrixRowObjectToArray,
  repeatTestSimulation,
  convertSummaryMatrixRowToObject,
} from '../genetic/helpers';
import { GeneticSearch } from '../genetic/genetic';
import {
  SimulationCachedMultiprocessingRunnerStrategy,
  SimulationComposedCrossoverStrategy,
  SimulationDefaultMutationStrategy,
  SimulationRandomPopulateStrategy,
  ReferenceLossScoringStrategy,
  SimulationSourceMutationPopulateStrategy,
  SimulationSourceMutationStrategy,
} from '../genetic/strategies';

export function createGeneticSearchByTypesConfig(config: SimulationGeneticSearchByTypesConfigFactoryConfig): GeneticSearchInterface<SimulationGenome> {
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

  const summaryRowObject = config.referenceSummaryRowObject ?? convertSummaryMatrixRowToObject(repeatTestSimulation(
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

  const strategyConfig: StrategyConfig<SimulationGenome> = {
    populate: new SimulationRandomPopulateStrategy(populateRandomTypesConfig),
    scoring: new ReferenceLossScoringStrategy(referenceConfig),
    runner: new SimulationCachedMultiprocessingRunnerStrategy(config.runnerStrategyConfig),
    mutation: new SimulationDefaultMutationStrategy(config.mutationStrategyConfig, mutationRandomTypesConfig),
    crossover: new SimulationComposedCrossoverStrategy(crossoverRandomTypesConfig),
  };

  return new GeneticSearch<SimulationGenome>(config.geneticSearchMacroConfig, strategyConfig);
}

export function createRandomSearchByTypesConfig(config: SimulationRandomSearchByTypesConfigFactoryConfig): GeneticSearchInterface<SimulationGenome> {
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

  const summaryRowObject = config.referenceSummaryRowObject ?? convertSummaryMatrixRowToObject(repeatTestSimulation(
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

  const strategyConfig: StrategyConfig<SimulationGenome> = {
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
