import type {
  GeneticSearchReferenceConfig,
  GeneticSearchInterface,
  StrategyConfig,
  GeneticSearchByTypesConfigFactoryConfig,
  RandomSearchByTypesConfigFactoryConfig,
} from '../types/genetic';
import {
  convertWeightsToSummaryMatrixRow,
  setTypesCountToRandomizeConfigCollection,
  convertSummaryMatrixRowObjectToArray,
  repeatTestSimulation,
} from '../genetic/helpers';
import { GeneticSearch } from '../genetic/genetic';
import {
  CachedMultiprocessingRunnerStrategy,
  ComposedCrossoverStrategy,
  MutationStrategy,
  RandomPopulateStrategy,
  ReferenceLossScoringStrategy,
  SourceMutationPopulateStrategy,
  SourceMutationStrategy,
} from '../genetic/strategies';

export function createGeneticSearchByTypesConfig(config: GeneticSearchByTypesConfigFactoryConfig): GeneticSearchInterface {
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

  const reference = config.referenceSummaryRowObject === undefined
    ? repeatTestSimulation(
      config.worldConfig,
      config.referenceTypesConfig,
      config.runnerStrategyConfig.checkpoints,
      config.runnerStrategyConfig.repeats,
    )
    : convertSummaryMatrixRowObjectToArray(config.referenceSummaryRowObject);

  const referenceConfig: GeneticSearchReferenceConfig = {
    reference,
    weights: convertWeightsToSummaryMatrixRow(config.weights, typesCount),
  };

  const strategyConfig: StrategyConfig = {
    populate: new RandomPopulateStrategy(populateRandomTypesConfig),
    scoring: new ReferenceLossScoringStrategy(referenceConfig),
    runner: new CachedMultiprocessingRunnerStrategy(config.runnerStrategyConfig),
    mutation: new MutationStrategy(config.mutationStrategyConfig, mutationRandomTypesConfig),
    crossover: new ComposedCrossoverStrategy(crossoverRandomTypesConfig),
  };

  return new GeneticSearch(config.geneticSearchMacroConfig, strategyConfig);
}

export function createRandomSearchByTypesConfig(config: RandomSearchByTypesConfigFactoryConfig): GeneticSearchInterface {
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

  const reference = config.referenceSummaryRowObject === undefined
    ? repeatTestSimulation(
      config.worldConfig,
      config.referenceTypesConfig,
      config.runnerStrategyConfig.checkpoints,
      config.runnerStrategyConfig.repeats,
    )
    : convertSummaryMatrixRowObjectToArray(config.referenceSummaryRowObject);

  const referenceConfig: GeneticSearchReferenceConfig = {
    reference,
    weights: convertWeightsToSummaryMatrixRow(config.weights, typesCount),
  };

  const strategyConfig: StrategyConfig = {
    populate: new SourceMutationPopulateStrategy(
      config.sourceTypesConfig,
      populateRandomTypesConfig,
      config.mutationStrategyConfig.probability,
    ),
    scoring: new ReferenceLossScoringStrategy(referenceConfig),
    runner: new CachedMultiprocessingRunnerStrategy(config.runnerStrategyConfig),
    mutation: new SourceMutationStrategy(config.mutationStrategyConfig, mutationRandomTypesConfig, config.sourceTypesConfig),
    crossover: new ComposedCrossoverStrategy(crossoverRandomTypesConfig),
  };

  return new GeneticSearch(config.geneticSearchMacroConfig, strategyConfig);
}
