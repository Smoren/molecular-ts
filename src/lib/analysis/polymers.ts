import type { NumericVector } from "../math/types";
import { createVector } from "../math";
import { convertDifferenceToNormalizedSimilarityGrade } from "./utils";
import type { GraphInterface } from "../graph/types";
import {
  countEdgesGroupedByVertexTypes,
  countVertexesGroupedByType,
} from "../graph/utils";

type PolymerSummary = {
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
  const monomerVertexesVector = countVertexesGroupedByType(monomerCandidate);
  const monomerEdgesVector = countEdgesGroupedByVertexTypes(monomerCandidate);
  const polymerVertexesVector = countVertexesGroupedByType(polymerCandidate);
  const polymerEdgesVector = countEdgesGroupedByVertexTypes(polymerCandidate);

  const multiplier = findPolymerMultiplier(monomerVertexesVector, polymerVertexesVector);
  const polymerSize = Math.floor(multiplier);

  if (polymerSize < minPolymerSize) {
    return createBadPolymerGradeSummary(monomerCandidate.vertexes.length);
  }

  const vertexesDiffVector = createVector(monomerVertexesVector).mul(multiplier).sub(polymerVertexesVector);
  const edgesDiffVector = createVector(monomerEdgesVector).mul(multiplier).sub(polymerEdgesVector);

  const vertexesDiff = vertexesDiffVector.abs;
  const edgesDiff = edgesDiffVector.abs;

  // TODO пока считаем, что полимеры соединены только одной связью, это допущение нужно исключить
  const clarifiedEdgesDiff = edgesDiff - (polymerSize-1);

  // TODO сделать новый граф, соединив мономер с собой polymerSize раз и сравнить с полимером по полной программе

  if (clarifiedEdgesDiff < 0) {
    // не хватает связей между мономерами
    return createBadPolymerGradeSummary(monomerCandidate.vertexes.length);
  }

  const similarity = convertDifferenceToNormalizedSimilarityGrade(vertexesDiff + clarifiedEdgesDiff, normCoefficient);

  return {
    monomerSize: monomerCandidate.vertexes.length,
    polymerSize: polymerSize,
    confidenceScore: similarity,
  };
}
