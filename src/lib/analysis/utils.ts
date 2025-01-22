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
