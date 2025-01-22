import type { ClusterizationConfig } from "../genetic/types";
import type { CompoundsClusterScore } from "./types";

export function convertDifferenceToNormalizedSimilarityGrade(diff: number, normCoefficient: number = 0.5): number {
  return 1 / (1 + Math.abs(diff)*normCoefficient);
}

export function createEmptyCompoundClusterScore(): CompoundsClusterScore {
  return {
    compoundVertexesCount: 0,
    compoundEdgesCount: 0,
    compoundUniqueTypesCount: 0,
    compoundSymmetryScore: 0,
    compoundRadius: 0,
    compoundSpeed: 0,
  };
}

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
      relativeCompoundedAtomsCountWeight: 1,
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
      relativeCompoundedAtomsCountWeight: 1,
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
      relativeCompoundedAtomsCountWeight: 1,
      averageAtomLinksWeight: 1,
      newLinksCreatedPerStepScoreWeight: 1,
    },
  };
}
