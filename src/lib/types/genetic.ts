import type {
  BaseMutationStrategyConfig,
  GeneticSearchConfig,
  RunnerStrategyConfig,
  MultiprocessingRunnerStrategyConfig,
} from "genetic-search";
import type { InitialConfig, RandomTypesConfig, TypesConfig, WorldConfig } from './config';
import type { SummaryMatrixRowObject, TotalSummaryWeights } from '../types/analysis';

export type SimulationTaskConfig = [number, WorldConfig, TypesConfig, number[], number];

export type SimulationRunnerStrategyConfig = RunnerStrategyConfig<SimulationTaskConfig> & {
  worldConfig: WorldConfig;
  checkpoints: number[];
  repeats: number;
};

export type SimulationMultiprocessingRunnerStrategyConfig = SimulationRunnerStrategyConfig & MultiprocessingRunnerStrategyConfig<SimulationTaskConfig> & {
  poolSize: number;
};

export type SimulationGenome = {
  id: number;
  typesConfig: TypesConfig;
}

export type SimulationGeneticSearchByTypesConfigFactoryConfig = {
  geneticSearchMacroConfig: GeneticSearchConfig;
  runnerStrategyConfig: SimulationMultiprocessingRunnerStrategyConfig;
  mutationStrategyConfig: BaseMutationStrategyConfig;
  populateRandomizeConfig: RandomTypesConfig;
  mutationRandomizeConfig: RandomTypesConfig;
  crossoverRandomizeConfig: RandomTypesConfig;
  referenceTypesConfig: TypesConfig;
  referenceSummaryRowObject?: SummaryMatrixRowObject;
  weights: TotalSummaryWeights;
  worldConfig: WorldConfig;
  targetClustersScore?: number;
}

export type SimulationRandomSearchByTypesConfigFactoryConfig = {
  geneticSearchMacroConfig: GeneticSearchConfig;
  runnerStrategyConfig: SimulationMultiprocessingRunnerStrategyConfig;
  mutationStrategyConfig: BaseMutationStrategyConfig;
  populateRandomizeConfig: RandomTypesConfig;
  mutationRandomizeConfig: RandomTypesConfig;
  crossoverRandomizeConfig: RandomTypesConfig;
  sourceTypesConfig: TypesConfig;
  referenceTypesConfig: TypesConfig;
  referenceSummaryRowObject?: SummaryMatrixRowObject;
  weights: TotalSummaryWeights;
  worldConfig: WorldConfig;
  targetClustersScore?: number;
}

export type SimulationGeneticMainConfig = {
  macro: GeneticSearchConfig;
  initial: InitialConfig;
  runner: SimulationMultiprocessingRunnerStrategyConfig;
  mutation: BaseMutationStrategyConfig;
}

export type SimulationMainConfig = {
  initial: InitialConfig;
  runner: SimulationMultiprocessingRunnerStrategyConfig;
}
