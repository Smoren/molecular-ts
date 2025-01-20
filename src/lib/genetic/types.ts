import type {
  BaseGenome,
  GeneticSearchConfig,
  PhenotypeStrategyConfig,
} from "genetic-search";
import type { MultiprocessingPhenotypeStrategyConfig } from "genetic-search-multiprocess";
import type { InitialConfig, RandomTypesConfig, TypesConfig, WorldConfig } from '../config/types';

export type ClusterizationTaskConfig = [number, WorldConfig, TypesConfig, ClusterizationWeightsConfig, number[], number];

export type SimulationMetricsStrategyConfig<TTaskConfig> = PhenotypeStrategyConfig<TTaskConfig> & {
  worldConfig: WorldConfig;
  checkpoints: number[];
  repeats: number;
};

export type SimulationMultiprocessingMetricsStrategyConfig<TTaskConfig> = SimulationMetricsStrategyConfig<TTaskConfig>
  & MultiprocessingPhenotypeStrategyConfig<TTaskConfig>;

export type SimulationGenome = BaseGenome & {
  id: number;
  typesConfig: TypesConfig;
}

export type MutationStrategyConfig = {
  dynamicProbabilities: number[];
  composedProbabilities: number[];
}

export type ClusterGradeMaximizeConfigFactoryConfig = {
  geneticSearchMacroConfig: GeneticSearchConfig;
  runnerStrategyConfig: SimulationMultiprocessingMetricsStrategyConfig<ClusterizationTaskConfig>;
  mutationStrategyConfig: MutationStrategyConfig;
  populateRandomizeConfigCollection: RandomTypesConfig[];
  mutationRandomizeConfigCollection: RandomTypesConfig[];
  crossoverRandomizeConfigCollection: RandomTypesConfig[];
  randomizeStartPopulation: boolean;
  worldConfig: WorldConfig;
  weightsConfig: ClusterizationWeightsConfig;
  typesCount: number;
  useCache: boolean;
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
  relativeFilteredCompoundsWeight: number;
  relativeClusteredCompoundsWeight: number;
  averageClusteredCompoundVertexesCountWeight: number;
  averageClusteredCompoundEdgesCountWeight: number;
  averageClusteredCompoundUniqueTypesCountWeight: number;
  averageClusteredCompoundSymmetryScoreWeight: number;
  averageClusteredCompoundRadiusWeight: number;
  averageClusteredCompoundSpeedWeight: number;
  relativeCompoundedAtomsCountWeight: number;
  averageAtomLinksWeight: number;
  newLinksCreatedPerStepScoreWeight: number;
}
