import type {
  BaseMutationStrategyConfig,
  GeneticSearchConfig,
  MetricsStrategyConfig,
  MultiprocessingMetricsStrategyConfig,
} from "genetic-search";
import type { InitialConfig, RandomTypesConfig, TypesConfig, WorldConfig } from './config';
import type { SummaryMatrixRowObject, TotalSummaryWeights } from '../types/analysis';

export type SimulationTaskConfig = [number, WorldConfig, TypesConfig, number[], number];

export type SimulationMetricsStrategyConfig = MetricsStrategyConfig<SimulationTaskConfig> & {
  worldConfig: WorldConfig;
  checkpoints: number[];
  repeats: number;
};

export type SimulationMultiprocessingMetricsStrategyConfig = SimulationMetricsStrategyConfig & MultiprocessingMetricsStrategyConfig<SimulationTaskConfig> & {
  poolSize: number;
};

export type SimulationGenome = {
  id: number;
  typesConfig: TypesConfig;
}

export type ComplexGeneticSearchConfigFactoryConfig = {
  geneticSearchMacroConfig: GeneticSearchConfig;
  runnerStrategyConfig: SimulationMultiprocessingMetricsStrategyConfig;
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

export type ComplexRandomSearchConfigFactoryConfig = {
  geneticSearchMacroConfig: GeneticSearchConfig;
  runnerStrategyConfig: SimulationMultiprocessingMetricsStrategyConfig;
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

export type ClusterGradeMaximizeConfigFactoryConfig = {
  geneticSearchMacroConfig: GeneticSearchConfig;
  runnerStrategyConfig: SimulationMultiprocessingMetricsStrategyConfig;
  mutationStrategyConfig: BaseMutationStrategyConfig;
  populateRandomizeConfig: RandomTypesConfig;
  mutationRandomizeConfig: RandomTypesConfig;
  crossoverRandomizeConfig: RandomTypesConfig;
  worldConfig: WorldConfig;
  typesCount: number;
  useComposedAlgo: boolean;
  composedFinalPopulation: number;
}

export type SimulationGeneticMainConfig = {
  macro: GeneticSearchConfig;
  initial: InitialConfig;
  runner: SimulationMultiprocessingMetricsStrategyConfig;
  mutation: BaseMutationStrategyConfig;
}

export type SimulationMainConfig = {
  initial: InitialConfig;
  runner: SimulationMultiprocessingMetricsStrategyConfig;
}
