import type { ClusterizationWeightsConfig } from "../genetic/types";
import type { CompoundsClusterScore } from "./types";

export function convertDifferenceToNormalizedSimilarityGrade(diff: number, normCoefficient: number = 0.5): number {
  return 1 / (1 + Math.abs(diff)*normCoefficient);
}

export function createEmptyCompoundClusterScore(): CompoundsClusterScore {
  return {
    averageClusteredCompoundVertexesCount: 0,
    averageClusteredCompoundEdgesCount: 0,
    averageClusteredCompoundUniqueTypesCount: 0,
    averageClusteredCompoundSymmetryScore: 0,
    averageClusteredCompoundRadius: 0,
    averageClusteredCompoundSpeed: 0,
  };
}

export function createDefaultClusterizationWeightsConfig(): ClusterizationWeightsConfig {
  return {
    minCompoundSize: 5,
    clustersCountWeight: 1,
    averageClusterSizeWeight: 1,
    relativeFilteredCompoundsWeight: 1,
    relativeClusteredCompoundsWeight: 1,
    averageClusteredCompoundVertexesCountWeight: 1.5,
    averageClusteredCompoundEdgesCountWeight: 0.7,
    averageClusteredCompoundUniqueTypesCountWeight: 1.5,
    averageClusteredCompoundSymmetryScoreWeight: 2,
    averageClusteredCompoundRadiusWeight: 0.5,
    averageClusteredCompoundSpeedWeight: 0.5,
    relativeCompoundedAtomsCountWeight: 1,
    averageAtomLinksWeight: 1,
    newLinksCreatedPerStepScoreWeight: 0.2,
  };
}

export function createModifiedClusterizationWeightsConfig(): ClusterizationWeightsConfig {
  return {
    minCompoundSize: 6,
    clustersCountWeight: 1,
    averageClusterSizeWeight: 1,
    relativeFilteredCompoundsWeight: 1,
    relativeClusteredCompoundsWeight: 1,
    averageClusteredCompoundVertexesCountWeight: 2,
    averageClusteredCompoundEdgesCountWeight: 1,
    averageClusteredCompoundUniqueTypesCountWeight: 1,
    averageClusteredCompoundSymmetryScoreWeight: 1,
    averageClusteredCompoundRadiusWeight: 0.5,
    averageClusteredCompoundSpeedWeight: 0.5,
    relativeCompoundedAtomsCountWeight: 1,
    averageAtomLinksWeight: 1,
    newLinksCreatedPerStepScoreWeight: 1,
  };
}
