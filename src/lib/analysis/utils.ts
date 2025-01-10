import type { ClusterizationWeightsConfig } from "../genetic/types";
import type { CompoundsClusterScore } from "./types";

export function convertDifferenceToNormalizedSimilarityGrade(diff: number, normCoefficient: number = 0.5): number {
  return 1 / (1 + Math.abs(diff)*normCoefficient);
}

export function createEmptyCompoundClusterScore(): CompoundsClusterScore {
  return {
    averageVertexesCount: 0,
    averageEdgesCount: 0,
    averageUniqueTypesCount: 0,
    symmetryGrade: 0,
    averageRadius: 0,
    averageSpeed: 0,
  };
}

export function createDefaultClusterizationWeightsConfig(): ClusterizationWeightsConfig {
  return {
    minCompoundSize: 6,
    vertexesCountWeight: 0.5,
    edgesCountWeight: 0.5,
    uniqueTypesCountWeight: 1,
    symmetryWeight: 3,
    radiusWeight: 0.3,
    speedWeight: 2,
    averageClusterSizeWeight: 0.5,
    clustersCountWeight: 0.5,
    relativeClusteredCountWeight: 2,
    relativeFilteredCountWeight: 2,
    relativeCompoundedAtomsCountWeight: 2,
    relativeLinksCountWeight: 1,
    linksCreatedWeight: 2,
  };
}

export function createModifiedClusterizationWeightsConfig(): ClusterizationWeightsConfig {
  return {
    minCompoundSize: 6,
    clustersCountWeight: 1,
    averageClusterSizeWeight: 1,
    relativeFilteredCountWeight: 1,
    relativeClusteredCountWeight: 1,
    vertexesCountWeight: 2,
    edgesCountWeight: 1,
    uniqueTypesCountWeight: 1,
    symmetryWeight: 1,
    radiusWeight: 0.5,
    speedWeight: 0.5,
    relativeCompoundedAtomsCountWeight: 1,
    relativeLinksCountWeight: 1,
    linksCreatedWeight: 1,
  };
}
