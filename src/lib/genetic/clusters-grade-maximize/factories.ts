import type { ClusterizationConfig, ClusterizationWeights } from "../types";

export function createDefaultClusterizationConfig(): ClusterizationConfig {
  return {
    params: {
      minCompoundSize: 5,
    },
    weights: {
      clustersCountWeight: 1.5,
      maxClusterSizeWeight: 0.5,
      averageClusterSizeWeight: 1,
      relativeFilteredCompoundsWeight: 0.7,
      relativeClusteredCompoundsWeight: 1,
      maxClusteredCompoundVertexesCountWeight: 0.5,
      averageClusteredCompoundVertexesCountWeight: 1.5,
      averageClusteredCompoundEdgesCountWeight: 0.7,
      averageClusteredCompoundUniqueTypesCountWeight: 1.5,
      averageClusteredCompoundSymmetryScoreWeight: 2,
      averageClusteredCompoundRadiusWeight: 0.5,
      averageClusteredCompoundSpeedWeight: 0.5,
      relativeCompoundedAtomsWeight: 1,
      relativeClusteredAtomsWeight: 1,
      averageAtomLinksWeight: 0.5,
      newLinksCreatedPerStepScoreWeight: 0.3,
    },
  };
}

export function createOldClusterizationConfig(): ClusterizationConfig {
  return {
    params: {
      minCompoundSize: 5,
    },
    weights: {
      clustersCountWeight: 1,
      maxClusterSizeWeight: 0.5,
      averageClusterSizeWeight: 1,
      relativeFilteredCompoundsWeight: 0.7,
      relativeClusteredCompoundsWeight: 1,
      maxClusteredCompoundVertexesCountWeight: 0.5,
      averageClusteredCompoundVertexesCountWeight: 1.5,
      averageClusteredCompoundEdgesCountWeight: 0.7,
      averageClusteredCompoundUniqueTypesCountWeight: 1.5,
      averageClusteredCompoundSymmetryScoreWeight: 2,
      averageClusteredCompoundRadiusWeight: 0.5,
      averageClusteredCompoundSpeedWeight: 0.5,
      relativeCompoundedAtomsWeight: 1,
      relativeClusteredAtomsWeight: 2,
      averageAtomLinksWeight: 0.5,
      newLinksCreatedPerStepScoreWeight: 0.3,
    },
  };
}

export function createModifiedClusterizationConfig(): ClusterizationConfig {
  return {
    params: {
      minCompoundSize: 6,
    },
    weights: {
      clustersCountWeight: 1,
      maxClusterSizeWeight: 0.2,
      averageClusterSizeWeight: 1,
      relativeFilteredCompoundsWeight: 1,
      relativeClusteredCompoundsWeight: 1,
      maxClusteredCompoundVertexesCountWeight: 0.5,
      averageClusteredCompoundVertexesCountWeight: 2,
      averageClusteredCompoundEdgesCountWeight: 1,
      averageClusteredCompoundUniqueTypesCountWeight: 1,
      averageClusteredCompoundSymmetryScoreWeight: 1,
      averageClusteredCompoundRadiusWeight: 0.5,
      averageClusteredCompoundSpeedWeight: 0.5,
      relativeCompoundedAtomsWeight: 1,
      relativeClusteredAtomsWeight: 2,
      averageAtomLinksWeight: 1,
      newLinksCreatedPerStepScoreWeight: 1,
    },
  };
}

export function createClusterizationReferenceDividers(): ClusterizationWeights {
  return {
    clustersCountWeight: 10,
    maxClusterSizeWeight: 20,
    averageClusterSizeWeight: 5,
    maxClusteredCompoundVertexesCountWeight: 10,
    averageClusteredCompoundVertexesCountWeight: 5,
    averageClusteredCompoundEdgesCountWeight: 3,
    averageClusteredCompoundUniqueTypesCountWeight: 2,
    averageClusteredCompoundSymmetryScoreWeight: 1,
    averageClusteredCompoundRadiusWeight: 20,
    averageClusteredCompoundSpeedWeight: 1,
    relativeFilteredCompoundsWeight: 0.5,
    relativeClusteredCompoundsWeight: 0.3,
    relativeCompoundedAtomsWeight: 1,
    relativeClusteredAtomsWeight: 0.3,
    averageAtomLinksWeight: 1,
    newLinksCreatedPerStepScoreWeight: 0.1,
  };
}
