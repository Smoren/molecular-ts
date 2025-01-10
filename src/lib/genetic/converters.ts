import type {CompoundsClusterizationScore} from "@/lib/analysis/types";
import type {NumericVector} from "@/lib/math/types";
import type {ClusterizationWeightsConfig} from "@/lib/genetic/types";

export function convertCompoundsClusterizationScoreToMetricsRow(score: CompoundsClusterizationScore): NumericVector {
  return [
    score.averageVertexesCount,
    score.averageEdgesCount,
    score.averageUniqueTypesCount,
    score.symmetryGrade,
    score.averageRadius,
    score.averageSpeed,
    score.averageDifference,
    score.averageClusterSize,
    score.clustersCount,
    score.relativeClustered,
    score.relativeFiltered,
  ]
}

export function convertCompoundsClusterizationMetricsRowToScoreObject(metrics: NumericVector): CompoundsClusterizationScore {
  const [
    averageVertexesCount,
    averageEdgesCount,
    averageUniqueTypesCount,
    symmetryGrade,
    averageRadius,
    averageSpeed,
    averageDifference,
    averageClusterSize,
    clustersCount,
    relativeClustered,
    relativeFiltered,
  ] = metrics;
  return {
    averageVertexesCount,
    averageEdgesCount,
    averageUniqueTypesCount,
    symmetryGrade,
    averageRadius,
    averageSpeed,
    averageDifference,
    averageClusterSize,
    clustersCount,
    relativeClustered,
    relativeFiltered,
  };
}

export function weighCompoundClusterizationMetricsRow(metrics: NumericVector, weights: ClusterizationWeightsConfig): number {
  const score = convertCompoundsClusterizationMetricsRowToScoreObject(metrics);
  return score.averageVertexesCount ** weights.vertexesCountWeight
    * score.averageEdgesCount ** weights.edgesCountWeight
    * score.averageUniqueTypesCount ** weights.uniqueTypesCountWeight
    * score.symmetryGrade ** weights.symmetryWeight
    * score.averageRadius ** weights.radiusWeight
    * score.averageSpeed ** weights.speedWeight
    * score.averageDifference ** weights.differenceWeight
    * score.averageClusterSize ** weights.averageClusterSizeWeight
    * score.clustersCount ** weights.clustersCountWeight
    * score.relativeClustered ** weights.relativeClusteredCountWeight
    * score.relativeFiltered ** weights.relativeFilteredCountWeight;
}
