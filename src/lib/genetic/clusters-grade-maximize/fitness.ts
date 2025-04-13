import type { NumericVector } from "../../math/types";
import type { ClusterizationWeights } from "../types";
import {
  applyReferenceWeightsToCompoundsClusterizationPhenomeRow,
  weighCompoundClusterizationPhenomeRow
} from "./converters";
import { arraySum, arrayProduct, normalizeMatrixColumnsMinMax, normalizeArrayMinMax } from "../../math";
import type { GenerationFitnessColumn, GenerationPhenomeMatrix } from "genetic-search";
import { multi, reduce } from "itertools-ts";

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
  const [normalized, _, maxColumns] = normalizeMatrixColumnsMinMax(results);
  const fitnessColumn = normalized.map((result) => clustersGradeMaximizeFitnessSum(result, weights));
  const [normalizedFitnessColumn] = normalizeArrayMinMax(fitnessColumn);

  const [bestPhenome] = reduce.toMax(multi.zip(results, normalizedFitnessColumn), ([_, fitness]) => fitness)!;
  const referencedBestPhenome = applyReferenceWeightsToCompoundsClusterizationPhenomeRow(bestPhenome);
  const referencedBestPhenomeScore = clustersGradeMaximizeFitnessSum(referencedBestPhenome, weights);

  return normalizedFitnessColumn.map((result) => result * referencedBestPhenomeScore);
}

export function batchNormalizedClustersGradeMaximizeFitnessMul(
  results: GenerationPhenomeMatrix,
  weights: ClusterizationWeights,
): GenerationFitnessColumn {
  const [normalized] = normalizeMatrixColumnsMinMax(results);
  const fitnessColumn = normalized.map((result) => clustersGradeMaximizeFitnessMul(result, weights));
  const [normalizedFitnessColumn] = normalizeArrayMinMax(fitnessColumn);

  debugger;
  const [bestPhenome] = reduce.toMax(multi.zip(results, normalizedFitnessColumn), ([_, fitness]) => fitness)!;
  const referencedBestPhenome = applyReferenceWeightsToCompoundsClusterizationPhenomeRow(bestPhenome);
  const referencedBestPhenomeScore = clustersGradeMaximizeFitnessMul(referencedBestPhenome, weights);

  return normalizedFitnessColumn.map((result) => result * referencedBestPhenomeScore);
}
