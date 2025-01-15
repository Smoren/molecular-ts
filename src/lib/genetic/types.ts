import type {
  BaseGenome,
  GeneticSearchConfig,
  MetricsStrategyConfig,
} from "genetic-search";
import type { MultiprocessingMetricsStrategyConfig } from "genetic-search-multiprocess";
import type { InitialConfig, RandomTypesConfig, TypesConfig, WorldConfig } from '../config/types';
import type { SummaryMatrixRowObject, TotalSummaryWeights } from '../analysis/types';

export type ReferenceTaskConfig = [number, WorldConfig, TypesConfig, number[], number];
export type ClusterizationTaskConfig = [number, WorldConfig, TypesConfig, ClusterizationWeightsConfig, number[], number];

export type SimulationMetricsStrategyConfig<TTaskConfig> = MetricsStrategyConfig<TTaskConfig> & {
  worldConfig: WorldConfig;
  checkpoints: number[];
  repeats: number;
};

export type SimulationMultiprocessingMetricsStrategyConfig<TTaskConfig> = SimulationMetricsStrategyConfig<TTaskConfig>
  & MultiprocessingMetricsStrategyConfig<TTaskConfig>;

export type SimulationGenome = BaseGenome & {
  id: number;
  typesConfig: TypesConfig;
}

export type MutationStrategyConfig = {
  dynamicProbabilities: number[];
  composedProbabilities: number[];
}

export type ReferenceSearchConfigFactoryConfig = {
  geneticSearchMacroConfig: GeneticSearchConfig;
  metricsStrategyConfig: SimulationMultiprocessingMetricsStrategyConfig<ReferenceTaskConfig>;
  mutationStrategyConfig: MutationStrategyConfig;
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
  mutationStrategyConfig: MutationStrategyConfig;
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
  mutationStrategyConfig: MutationStrategyConfig;
  populateRandomizeConfigCollection: RandomTypesConfig[];
  mutationRandomizeConfigCollection: RandomTypesConfig[];
  crossoverRandomizeConfigCollection: RandomTypesConfig[];
  worldConfig: WorldConfig;
  weightsConfig: ClusterizationWeightsConfig;
  typesCount: number;
  useConstCache: boolean;
  useComposedAlgo: boolean;
  composedFinalPopulation: number;
  genomeAgeWeight: number;
}

export type SimulationGeneticMainConfig<TTaskConfig> = {
  macro: GeneticSearchConfig;
  initial: InitialConfig;
  metrics: SimulationMultiprocessingMetricsStrategyConfig<TTaskConfig>;
  mutation: MutationStrategyConfig;
}

export type SimulationMainConfig<TTaskConfig> = {
  initial: InitialConfig;
  metrics: SimulationMultiprocessingMetricsStrategyConfig<TTaskConfig>;
}

export type ClusterizationWeightsConfig = {
  minCompoundSize: number;
  clustersCountWeight: number;
  averageClusterSizeWeight: number;
  relativeFilteredCountWeight: number;
  relativeClusteredCountWeight: number;
  vertexesCountWeight: number;
  edgesCountWeight: number;
  uniqueTypesCountWeight: number;
  symmetryWeight: number;
  radiusWeight: number;
  speedWeight: number;
  relativeCompoundedAtomsCountWeight: number;
  relativeLinksCountWeight: number;
  linksCreatedWeight: number;
}
