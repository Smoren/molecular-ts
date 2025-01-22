import type { NumericVector } from "../../math/types";
import type { ClusterizationWeights } from "../types";
import { weighCompoundClusterizationPhenomeRow } from "./converters";
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
): GenerationFitnessColumn {
  // TODO try to use it in strategy
  const [normalized, means] = normalizeMatrixColumnsMinMax(results);
  const mean = clustersGradeMaximizeFitnessSum(means, weights);
  const fitnessColumn = normalized.map((result) => clustersGradeMaximizeFitnessSum(result, weights));
  const [normalizedFitnessColumn] = normalizeArrayMinMax(fitnessColumn);
  return normalizedFitnessColumn.map((result) => result * mean);
}

export function batchNormalizedClustersGradeMaximizeFitnessMul(
  results: GenerationPhenomeMatrix,
  weights: ClusterizationWeights,
): GenerationFitnessColumn {
  const [normalized, means] = normalizeMatrixColumnsMinMax(results);
  // TODO попробовать тоже нормализовать? Брать не среднее, а максимум? Или вообще взвешенное среднее от среднего или максимума?
  const mean = clustersGradeMaximizeFitnessMul(means, weights);
  const fitnessColumn = normalized.map((result) => clustersGradeMaximizeFitnessMul(result, weights));
  const [normalizedFitnessColumn] = normalizeArrayMinMax(fitnessColumn);
  return normalizedFitnessColumn.map((result) => result * mean);
}
