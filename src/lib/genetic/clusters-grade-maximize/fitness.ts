import type { NumericVector } from "../../math/types";
import type { ClusterizationWeights } from "../types";
import {
  applyReferenceWeightsToCompoundsClusterizationPhenomeRow,
  weighCompoundClusterizationPhenomeRow
} from "./converters";
import { arraySum, arrayProduct, normalizeMatrixColumnsMinMax, normalizeArrayMinMax } from "../../math";
import type { GenerationFitnessColumn, GenerationPhenomeMatrix } from "genetic-search";

export function clustersGradeMaximizeFitnessSum(
  phenome: NumericVector,
  weights: ClusterizationWeights,
  debug: boolean = false,
): number {
  const weigher = ((value: number, weight: number) => value*weight);
  return arraySum(weighCompoundClusterizationPhenomeRow(phenome, weights, weigher, debug));
}

export function clustersGradeMaximizeFitnessMul(
  phenome: NumericVector,
  weights: ClusterizationWeights,
  debug: boolean = false,
): number {
  const weigher = ((value: number, weight: number) => value**weight);
  return arrayProduct(weighCompoundClusterizationPhenomeRow(phenome, weights, weigher, debug));
}

export function clustersGradeMaximizeFitnessLog(
  phenome: NumericVector,
  weights: ClusterizationWeights,
  debug: boolean = false,
): number {
  const weigher = ((value: number, weight: number) => Math.log(1+value) * weight);
  return arraySum(weighCompoundClusterizationPhenomeRow(phenome, weights, weigher, debug));
}

export function batchNormalizedClustersGradeMaximizeFitnessSum(
  results: GenerationPhenomeMatrix,
  weights: ClusterizationWeights,
  applyReferenceWeights: boolean = true,
): GenerationFitnessColumn {
  // TODO try to use it in strategy
  const [normalized, _, maxColumns] = normalizeMatrixColumnsMinMax(results);
  const referencedMaxColumns = applyReferenceWeights ? applyReferenceWeightsToCompoundsClusterizationPhenomeRow(maxColumns) : maxColumns;
  const max = clustersGradeMaximizeFitnessSum(referencedMaxColumns, weights);
  const fitnessColumn = normalized.map((result) => clustersGradeMaximizeFitnessSum(result, weights));
  const [normalizedFitnessColumn] = normalizeArrayMinMax(fitnessColumn);
  return normalizedFitnessColumn.map((result) => result * max);
}

export function batchNormalizedClustersGradeMaximizeFitnessMul(
  results: GenerationPhenomeMatrix,
  weights: ClusterizationWeights,
  applyReferenceWeights: boolean = true,
): GenerationFitnessColumn {
  // TODO попробовать тоже нормализовать? Брать не среднее, а максимум? Или вообще взвешенное среднее от среднего или максимума?

  const [normalized, _1, maxColumns] = normalizeMatrixColumnsMinMax(results);
  const referencedMaxColumns = applyReferenceWeights ? applyReferenceWeightsToCompoundsClusterizationPhenomeRow(maxColumns) : maxColumns;
  const max = clustersGradeMaximizeFitnessMul(referencedMaxColumns, weights);
  const fitnessColumn = normalized.map((result) => clustersGradeMaximizeFitnessMul(result, weights));
  const [normalizedFitnessColumn] = normalizeArrayMinMax(fitnessColumn);
  return normalizedFitnessColumn.map((result) => result * max);
}
