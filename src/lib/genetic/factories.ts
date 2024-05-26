import os from 'os';
import type {
  GeneticSearchInputConfig,
  GeneticSearchInterface,
  GeneticSearchLikeTypesFactoryConfig,
  StrategyConfig,
} from '../types/genetic';
import {
  convertWeightsToSummaryMatrixRow,
  repeatTestSimulation,
  setTypesCountToRandomizeConfigCollection,
} from '../genetic/helpers';
import {
  CachedMultiprocessingRunnerStrategy,
  ComposedCrossoverStrategy,
  GeneticSearch,
  MutationStrategy,
  RandomPopulateStrategy,
} from '../genetic/genetic';

export function createGeneticSearchLikeTypesConfig(config: GeneticSearchLikeTypesFactoryConfig): GeneticSearchInterface {
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

  const strategyConfig: StrategyConfig = {
    populate: new RandomPopulateStrategy(populateRandomTypesConfig),
    runner: new CachedMultiprocessingRunnerStrategy(config.runnerStrategyConfig, os.cpus().length),
    mutation: new MutationStrategy(mutationRandomTypesConfig),
    crossover: new ComposedCrossoverStrategy(crossoverRandomTypesConfig),
  };

  const reference = repeatTestSimulation(
    config.worldConfig,
    config.referenceTypesConfig,
    config.runnerStrategyConfig.checkpoints,
    config.runnerStrategyConfig.repeats,
  );

  const geneticInputConfig: GeneticSearchInputConfig = {
    reference,
    weights: convertWeightsToSummaryMatrixRow(config.weights, typesCount),
  };

  return new GeneticSearch(config.geneticSearchMacroConfig, geneticInputConfig, strategyConfig);
}
