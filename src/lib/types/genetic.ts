import type {
  BaseMutationStrategyConfig,
  GeneticSearchConfig,
  MetricsStrategyConfig,
  MultiprocessingMetricsStrategyConfig,
} from "genetic-search";
import type { InitialConfig, RandomTypesConfig, TypesConfig, WorldConfig } from './config';
import type { SummaryMatrixRowObject, TotalSummaryWeights } from '../types/analysis';

export type ReferenceTaskConfig = [number, WorldConfig, TypesConfig, number[], number];
export type ClusterizationTaskConfig = [number, WorldConfig, TypesConfig, ClusterizationWeightsConfig, number[], number];

export type SimulationMetricsStrategyConfig<TTaskConfig> = MetricsStrategyConfig<TTaskConfig> & {
  worldConfig: WorldConfig;
  checkpoints: number[];
  repeats: number;
};

export type SimulationMultiprocessingMetricsStrategyConfig<TTaskConfig> = SimulationMetricsStrategyConfig<TTaskConfig>
  & MultiprocessingMetricsStrategyConfig<TTaskConfig>;

export type SimulationGenome = {
  id: number;
  typesConfig: TypesConfig;
}

export type ReferenceSearchConfigFactoryConfig = {
  geneticSearchMacroConfig: GeneticSearchConfig;
  metricsStrategyConfig: SimulationMultiprocessingMetricsStrategyConfig<ReferenceTaskConfig>;
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

export type ReferenceRandomSearchConfigFactoryConfig = {
  geneticSearchMacroConfig: GeneticSearchConfig;
  metricsStrategyConfig: SimulationMultiprocessingMetricsStrategyConfig<ReferenceTaskConfig>;
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
  runnerStrategyConfig: SimulationMultiprocessingMetricsStrategyConfig<ClusterizationTaskConfig>;
  mutationStrategyConfig: BaseMutationStrategyConfig;
  populateRandomizeConfig: RandomTypesConfig;
  mutationRandomizeConfig: RandomTypesConfig;
  crossoverRandomizeConfig: RandomTypesConfig;
  worldConfig: WorldConfig;
  weightsConfig: ClusterizationWeightsConfig;
  typesCount: number;
  useComposedAlgo: boolean;
  composedFinalPopulation: number;
}

export type SimulationGeneticMainConfig<TTaskConfig> = {
  macro: GeneticSearchConfig;
  initial: InitialConfig;
  metrics: SimulationMultiprocessingMetricsStrategyConfig<TTaskConfig>;
  mutation: BaseMutationStrategyConfig;
}

export type SimulationMainConfig<TTaskConfig> = {
  initial: InitialConfig;
  metrics: SimulationMultiprocessingMetricsStrategyConfig<TTaskConfig>;
}

export type ClusterizationWeightsConfig = {
  minCompoundSize: number;
  clustersCountWeight: number;
  clusterSizeWeight: number;
  relativeFilteredCountWeight: number;
  relativeClusteredCountWeight: number;
  vertexesCountWeight: number;
  edgesCountWeight: number;
  uniqueTypesCountWeight: number;
  symmetryWeight: number;
  differenceWeight: number;
  radiusWeight: number;
  speedWeight: number;
}
