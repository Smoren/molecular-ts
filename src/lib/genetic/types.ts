import type { BaseGenome, PhenomeStrategyConfig } from "genetic-search";
import type { MultiprocessingPhenomeStrategyConfig } from "genetic-search-multiprocess";
import type { TypesConfig, WorldConfig } from '../config/types';

export type SimulationGenome = BaseGenome & {
  id: number;
  typesConfig: TypesConfig;
}

export type SimulationRunConfig = {
  worldConfig: WorldConfig;
  checkpoints: number[];
  repeats: number;
};

export type SimulationPhenomeStrategyConfig<TTaskConfig> = SimulationRunConfig
  & PhenomeStrategyConfig<TTaskConfig>;
export type SimulationMultiprocessingPhenomeStrategyConfig<TTaskConfig> = SimulationPhenomeStrategyConfig<TTaskConfig>
  & MultiprocessingPhenomeStrategyConfig<TTaskConfig>;

export type MutationStrategyConfig = {
  dynamicProbabilities: number[];
  composedProbabilities: number[];
}

export type ClusterizationParams = {
  minCompoundSize: number;
  minUniqueTypesCount: number;
  monomerCandidateVertexesCountBounds: [number, number];
  polymerCandidateVertexesCountBounds: [number, number];
  minPolymerSize: number;
  minPolymerConfidenceScore: number;
}

export type ClusterizationWeights = {
  clustersCountWeight: number;
  maxClusterSizeWeight: number;
  averageClusterSizeWeight: number;
  relativeFilteredCompoundsWeight: number;
  relativeClusteredCompoundsWeight: number;
  maxClusteredCompoundVertexesCountWeight: number;
  averageClusteredCompoundVertexesCountWeight: number;
  averageClusteredCompoundEdgesCountWeight: number;
  averageClusteredCompoundUniqueTypesCountWeight: number;
  averageClusteredCompoundSymmetryScoreWeight: number;
  averageClusteredCompoundRadiusWeight: number;
  averageClusteredCompoundSpeedWeight: number;
  relativeCompoundedAtomsWeight: number;
  relativeClusteredAtomsWeight: number;
  averageAtomLinksWeight: number;
  newLinksCreatedPerStepScoreWeight: number;
  relativePolymersCountWeight: number;
  maxPolymerSizeWeight: number;
  averageMonomerVertexesCountWeight: number;
  averagePolymerVertexesCountWeight: number;
  averagePolymerSizeWeight: number;
  averagePolymerConfidenceScoreWeight: number;
}

export type ClusterizationConfig = {
  params: ClusterizationParams;
  weights: ClusterizationWeights;
}

export type SelectionStrategyType = 'random' | 'truncation' | 'proportional' | 'tournament';

export type SelectionStrategyFactoryConfig = {
  type: SelectionStrategyType;
  crossoverParentsCount?: number;
  truncationSliceThresholdRate?: number;
  tournamentSize?: number;
}
