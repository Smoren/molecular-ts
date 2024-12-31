import type { NumericVector } from "../math/types";
import { createVector, toVector } from "../math";
import { convertDifferenceToNormalizedSimilarityGrade } from "./utils";
import type { GraphInterface } from "../graph/types";
import {
  countEdgesGroupedByVertexTypes,
  countVertexesGroupedByType,
} from "../graph/utils";

export type PolymerSummary = {
  confidenceScore: number;
  monomerSize: number;
  polymerSize: number;
}

export function findPolymerMultiplier(monomerCandidateVector: NumericVector, polymerCandidateVector: NumericVector): number {
  // Using the least squares method to find multiplier
  const numerator = monomerCandidateVector.reduce((sum, x, i) => sum + x * polymerCandidateVector[i], 0);
  const denominator = monomerCandidateVector.reduce((sum, x) => sum + x**2, 0);
  return numerator / denominator;
}

function createBadPolymerGradeSummary(monomerSize: number): PolymerSummary {
  return {
    monomerSize,
    polymerSize: 0,
    confidenceScore: 0,
  };
}

export function gradeMonomerPolymerPair(
  monomerCandidate: GraphInterface,
  polymerCandidate: GraphInterface,
  minPolymerSize: number = 2,
  normCoefficient: number = 0.5,
): PolymerSummary {
  const monomerVertexesVector = toVector(countVertexesGroupedByType(monomerCandidate));
  const monomerEdgesVector = toVector(countEdgesGroupedByVertexTypes(monomerCandidate));
  const polymerVertexesVector = toVector(countVertexesGroupedByType(polymerCandidate));
  const polymerEdgesVector = toVector(countEdgesGroupedByVertexTypes(polymerCandidate));

  const multiplier = findPolymerMultiplier(monomerVertexesVector, polymerVertexesVector);
  const polymerSize = Math.floor(multiplier);

  if (polymerSize < minPolymerSize) {
    return createBadPolymerGradeSummary(monomerCandidate.vertexes.length);
  }

  const vertexesDiffVector = createVector(polymerVertexesVector).sub(monomerVertexesVector.clone().mul(multiplier));
  const edgesDiffVector = createVector(polymerEdgesVector).sub(monomerEdgesVector.clone().mul(multiplier));

  // Extra vertexes between 2 monomers
  const monomerVertexesDiffVector = vertexesDiffVector.clone().div(polymerSize-1);
  // Extra edges between 2 monomers
  const monomerEdgesDiffVector = edgesDiffVector.clone().div(polymerSize-1);

  const monomerExtraVertexesVector = toVector(monomerVertexesDiffVector.map((x) => Math.floor(x)));
  const monomerExtraEdgesVector = toVector(monomerEdgesDiffVector.map((x) => Math.floor(x)));

  // TODO доработать условие
  if (monomerExtraVertexesVector.abs2 >= monomerVertexesVector.abs2 || monomerExtraEdgesVector.abs2 >= monomerEdgesVector.abs2) {
    return createBadPolymerGradeSummary(monomerCandidate.vertexes.length);
  }

  // TODO можно попробовать выяснить, соотвтетсвуют ли дополнительные вертексы дополнительным связям

  const assembledPolymerVertexesVector = monomerVertexesVector.clone().mul(polymerSize)
    .add(monomerExtraVertexesVector.clone().mul(polymerSize-1));
  const assembledPolymerEdgesVector = monomerEdgesVector.clone().mul(polymerSize)
    .add(monomerExtraEdgesVector.clone().mul(polymerSize-1));

  const assembledVertexesDiff = assembledPolymerVertexesVector.clone().sub(polymerVertexesVector).abs;
  const assembledEdgesDiff = assembledPolymerEdgesVector.clone().sub(polymerEdgesVector).abs;

  const similarity = convertDifferenceToNormalizedSimilarityGrade(
    assembledVertexesDiff + assembledEdgesDiff,
    normCoefficient,
  );

  // const monomerVertexesDiff = monomerVertexesDiffVector.abs;
  // // TODO допущение, что дополнительная связь только одна
  // const monomerEdgesDiff = Math.max(0, monomerEdgesDiffVector.abs-1);
  //
  // const similarity = convertDifferenceToNormalizedSimilarityGrade(
  //   monomerVertexesDiff + monomerEdgesDiff,
  //   normCoefficient,
  // );

  return {
    monomerSize: monomerCandidate.vertexes.length,
    polymerSize: polymerSize,
    confidenceScore: similarity,
  };
}
