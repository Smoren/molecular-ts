import type {
  BaseGenome,
  GeneticSearchConfig,
  PhenotypeStrategyConfig,
} from "genetic-search";
import type { MultiprocessingPhenotypeStrategyConfig } from "genetic-search-multiprocess";
import type { InitialConfig, RandomTypesConfig, TypesConfig, WorldConfig } from '../config/types';

export type SimulationGenome = BaseGenome & {
  id: number;
  typesConfig: TypesConfig;
}

export type SimulationRunConfig = {
  worldConfig: WorldConfig;
  checkpoints: number[];
  repeats: number;
};

export type SimulationPhenotypeStrategyConfig<TTaskConfig> = SimulationRunConfig
  & PhenotypeStrategyConfig<TTaskConfig>;
export type SimulationMultiprocessingPhenotypeStrategyConfig<TTaskConfig> = SimulationPhenotypeStrategyConfig<TTaskConfig>
  & MultiprocessingPhenotypeStrategyConfig<TTaskConfig>;

export type MutationStrategyConfig = {
  dynamicProbabilities: number[];
  composedProbabilities: number[];
}

export type ClustersGradeMaximizeTaskConfig = [number, WorldConfig, TypesConfig, ClusterizationParams, number[], number];

export type ClusterGradeMaximizeConfigFactoryConfig = {
  geneticSearchMacroConfig: GeneticSearchConfig;
  runnerStrategyConfig: SimulationMultiprocessingPhenotypeStrategyConfig<ClustersGradeMaximizeTaskConfig>;
  mutationStrategyConfig: MutationStrategyConfig;
  populateRandomizeConfigCollection: RandomTypesConfig[];
  mutationRandomizeConfigCollection: RandomTypesConfig[];
  crossoverRandomizeConfigCollection: RandomTypesConfig[];
  randomizeStartPopulation: boolean;
  worldConfig: WorldConfig;
  clusterizationConfig: ClusterizationConfig;
  typesCount: number;
  useCache: boolean;
  useComposedAlgo: boolean;
  composedFinalPopulation: number;
  genomeAgeWeight: number;
}

export type ClusterGradeMaximizeGeneticMainConfig<TTaskConfig> = {
  macro: GeneticSearchConfig;
  initial: InitialConfig;
  metrics: SimulationMultiprocessingPhenotypeStrategyConfig<TTaskConfig>;
  mutation: MutationStrategyConfig;
}

export type ClusterizationParams = {
  minCompoundSize: number;
}

export type ClusterizationWeights = {
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

export type ClusterizationConfig = {
  params: ClusterizationParams;
  weights: ClusterizationWeights;
}
