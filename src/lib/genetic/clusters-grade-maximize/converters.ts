import type { CompoundsClusterizationScore } from "../../analysis/types";
import type { NumericVector } from "../../math/types";
import type { ClusterizationWeights } from "../types";
import { createClusterizationReferenceWeights } from "../../analysis/utils";

export function convertCompoundsClusterizationScoreToPhenomeRow(score: CompoundsClusterizationScore): NumericVector {
  return [
    score.maxClusteredCompoundVertexesCount,
    score.averageClusteredCompoundVertexesCount,
    score.averageClusteredCompoundEdgesCount,
    score.averageClusteredCompoundUniqueTypesCount,
    score.averageClusteredCompoundSymmetryScore,
    score.averageClusteredCompoundRadius,
    score.averageClusteredCompoundSpeed,
    score.maxClusterSize,
    score.averageClusterSize,
    score.clustersCount,
    score.relativeClusteredCompounds,
    score.relativeFilteredCompounds,
    score.relativeCompoundedAtomsCount,
    score.averageAtomLinks,
    score.newLinksCreatedPerStepScore,
  ]
}

export function convertCompoundsClusterizationPhenomeRowToScoreObject(phenome: NumericVector): CompoundsClusterizationScore {
  const [
    maxClusteredCompoundVertexesCount,
    averageClusteredCompoundVertexesCount,
    averageClusteredCompoundEdgesCount,
    averageClusteredCompoundUniqueTypesCount,
    averageClusteredCompoundSymmetryScore,
    averageClusteredCompoundRadius,
    averageClusteredCompoundSpeed,
    maxClusterSize,
    averageClusterSize,
    clustersCount,
    relativeClusteredCompounds,
    relativeFilteredCompounds,
    relativeCompoundedAtomsCount,
    averageAtomLinks,
    newLinksCreatedPerStepScore,
  ] = phenome;
  return {
    maxClusteredCompoundVertexesCount,
    averageClusteredCompoundVertexesCount,
    averageClusteredCompoundEdgesCount,
    averageClusteredCompoundUniqueTypesCount,
    averageClusteredCompoundSymmetryScore,
    averageClusteredCompoundRadius,
    averageClusteredCompoundSpeed,
    maxClusterSize,
    averageClusterSize,
    clustersCount,
    relativeClusteredCompounds,
    relativeFilteredCompounds,
    relativeCompoundedAtomsCount,
    averageAtomLinks,
    newLinksCreatedPerStepScore,
  };
}

export function weighCompoundClusterizationPhenomeRow(
  phenome: NumericVector,
  weights: ClusterizationWeights,
  weigher: (value: number, weight: number) => number,
  debug: boolean = false,
): NumericVector {
  const score = convertCompoundsClusterizationPhenomeRowToScoreObject(phenome);
  if (debug) {
    console.log('RAW SCORE', { ...score });
  }

  score.maxClusteredCompoundVertexesCount = weigher(score.maxClusteredCompoundVertexesCount, weights.maxClusteredCompoundVertexesCountWeight);
  score.averageClusteredCompoundVertexesCount = weigher(score.averageClusteredCompoundVertexesCount, weights.averageClusteredCompoundVertexesCountWeight);
  score.averageClusteredCompoundEdgesCount = weigher(score.averageClusteredCompoundEdgesCount, weights.averageClusteredCompoundEdgesCountWeight);
  score.averageClusteredCompoundUniqueTypesCount = weigher(score.averageClusteredCompoundUniqueTypesCount, weights.averageClusteredCompoundUniqueTypesCountWeight);
  score.averageClusteredCompoundSymmetryScore = weigher(score.averageClusteredCompoundSymmetryScore, weights.averageClusteredCompoundSymmetryScoreWeight);
  score.averageClusteredCompoundRadius = weigher(score.averageClusteredCompoundRadius, weights.averageClusteredCompoundRadiusWeight);
  score.averageClusteredCompoundSpeed = weigher(score.averageClusteredCompoundSpeed, weights.averageClusteredCompoundSpeedWeight);
  score.maxClusterSize = weigher(score.maxClusterSize, weights.maxClusterSizeWeight);
  score.averageClusterSize = weigher(score.averageClusterSize, weights.averageClusterSizeWeight);
  score.clustersCount = weigher(score.clustersCount, weights.clustersCountWeight);
  score.relativeClusteredCompounds = weigher(score.relativeClusteredCompounds, weights.relativeClusteredCompoundsWeight);
  score.relativeFilteredCompounds = weigher(score.relativeFilteredCompounds, weights.relativeFilteredCompoundsWeight);
  score.relativeCompoundedAtomsCount = weigher(score.relativeCompoundedAtomsCount, weights.relativeCompoundedAtomsCountWeight);
  score.averageAtomLinks = weigher(score.averageAtomLinks, weights.averageAtomLinksWeight);
  score.newLinksCreatedPerStepScore = weigher(score.newLinksCreatedPerStepScore, weights.newLinksCreatedPerStepScoreWeight);

  if (debug) {
    console.log('WEIGHTED SCORE', { ...score });
  }

  return convertCompoundsClusterizationScoreToPhenomeRow(score);
}

export function applyReferenceWeightsToCompoundsClusterizationPhenomeRow(
  phenome: NumericVector,
  weights?: ClusterizationWeights,
) {
  weights = weights ?? createClusterizationReferenceWeights();
  return weighCompoundClusterizationPhenomeRow(phenome, weights, (x, w) => x/w);
}