import type { NumericVector } from "../math/types";
import type { ClusterizationWeightsConfig } from "./types";
import { weighCompoundClusterizationMetricsRow } from "./converters";
import { arraySum } from "@/lib/math";
import { arrayProduct } from "@/lib/math/operations";

export function clusterizationFitnessMul(
  metrics: NumericVector,
  weights: ClusterizationWeightsConfig,
  debug: boolean = false,
): number {
  const weigher = ((value: number, weight: number) => value**weight);
  return arrayProduct(weighCompoundClusterizationMetricsRow(metrics, weights, weigher, debug));
}

export function clusterizationFitnessLog(
  metrics: NumericVector,
  weights: ClusterizationWeightsConfig,
  debug: boolean = false,
): number {
  const weigher = ((value: number, weight: number) => Math.log(1+value) * weight);
  return arraySum(weighCompoundClusterizationMetricsRow(metrics, weights, weigher, debug));
}
