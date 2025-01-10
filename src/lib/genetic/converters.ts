import type { CompoundsClusterizationScore } from "../analysis/types";
import type { NumericVector } from "../math/types";
import type { ClusterizationWeightsConfig } from "./types";

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
    score.relativeCompoundedAtomsCount,
    score.relativeLinksCount,
    score.linksCreatedScore,
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
    relativeCompoundedAtomsCount,
    relativeLinksCount,
    linksCreatedScore,
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
    relativeCompoundedAtomsCount,
    relativeLinksCount,
    linksCreatedScore,
  };
}

export function weighCompoundClusterizationMetricsRow(metrics: NumericVector, weights: ClusterizationWeightsConfig): NumericVector {
  const score = convertCompoundsClusterizationMetricsRowToScoreObject(metrics);

  score.averageVertexesCount **= weights.vertexesCountWeight;
  score.averageEdgesCount **= weights.edgesCountWeight;
  score.averageUniqueTypesCount **= weights.uniqueTypesCountWeight;
  score.symmetryGrade **= weights.symmetryWeight;
  score.averageRadius **= weights.radiusWeight;
  score.averageSpeed **= weights.speedWeight;
  // score.averageDifference **= weights.differenceWeight; // TODO подумать, иначе без diff занулляется общий score
  score.averageClusterSize **= weights.averageClusterSizeWeight;
  score.clustersCount **= weights.clustersCountWeight;
  score.relativeClustered **= weights.relativeClusteredCountWeight;
  score.relativeFiltered **= weights.relativeFilteredCountWeight;
  score.relativeCompoundedAtomsCount **= weights.relativeCompoundedAtomsCountWeight;
  score.relativeLinksCount **= weights.relativeLinksCountWeight;
  score.linksCreatedScore **= weights.linksCreatedWeight;

  return convertCompoundsClusterizationScoreToMetricsRow(score);
}
