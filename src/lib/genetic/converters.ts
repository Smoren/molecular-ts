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
    averageClusterSize,
    clustersCount,
    relativeClustered,
    relativeFiltered,
    relativeCompoundedAtomsCount,
    relativeLinksCount,
    linksCreatedScore,
  };
}

export function weighCompoundClusterizationMetricsRow(
  metrics: NumericVector,
  weights: ClusterizationWeightsConfig,
  weigher: (value: number, weight: number) => number,
  debug: boolean = false,
): NumericVector {
  const score = convertCompoundsClusterizationMetricsRowToScoreObject(metrics);
  if (debug) {
    console.log('RAW SCORE', { ...score });
  }

  score.averageVertexesCount = weigher(score.averageVertexesCount, weights.vertexesCountWeight);
  score.averageEdgesCount = weigher(score.averageEdgesCount, weights.edgesCountWeight);
  score.averageUniqueTypesCount = weigher(score.averageUniqueTypesCount, weights.uniqueTypesCountWeight);
  score.symmetryGrade = weigher(score.symmetryGrade, weights.symmetryWeight);
  score.averageRadius = weigher(score.averageRadius, weights.radiusWeight);
  score.averageSpeed = weigher(score.averageSpeed, weights.speedWeight);
  score.averageClusterSize = weigher(score.averageClusterSize, weights.averageClusterSizeWeight);
  score.clustersCount = weigher(score.clustersCount, weights.clustersCountWeight);
  score.relativeClustered = weigher(score.relativeClustered, weights.relativeClusteredCountWeight);
  score.relativeFiltered = weigher(score.relativeFiltered, weights.relativeFilteredCountWeight);
  score.relativeCompoundedAtomsCount = weigher(score.relativeCompoundedAtomsCount, weights.relativeCompoundedAtomsCountWeight);
  score.relativeLinksCount = weigher(score.relativeLinksCount, weights.relativeLinksCountWeight);
  score.linksCreatedScore = weigher(score.linksCreatedScore, weights.linksCreatedWeight);

  if (debug) {
    console.log('WEIGHTED SCORE', { ...score });
  }

  return convertCompoundsClusterizationScoreToMetricsRow(score);
}
