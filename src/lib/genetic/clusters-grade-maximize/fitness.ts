import type { NumericVector } from "../../math/types";
import type { ClusterizationWeights } from "../types";
import { weighCompoundClusterizationMetricsRow } from "./converters";
import { arraySum, arrayProduct } from "../../math";

export function clustersGradeMaximizeFitnessMul(
  metrics: NumericVector,
  weights: ClusterizationWeights,
  debug: boolean = false,
): number {
  const weigher = ((value: number, weight: number) => value**weight);
  return arrayProduct(weighCompoundClusterizationMetricsRow(metrics, weights, weigher, debug));
}

export function clustersGradeMaximizeFitnessLog(
  metrics: NumericVector,
  weights: ClusterizationWeights,
  debug: boolean = false,
): number {
  const weigher = ((value: number, weight: number) => Math.log(1+value) * weight);
  return arraySum(weighCompoundClusterizationMetricsRow(metrics, weights, weigher, debug));
}
