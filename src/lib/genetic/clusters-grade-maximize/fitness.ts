import type { NumericVector } from "../../math/types";
import type { ClusterizationWeights } from "../types";
import { weighCompoundClusterizationPhenotypeRow } from "./converters";
import { arraySum, arrayProduct } from "../../math";

export function clustersGradeMaximizeFitnessMul(
  phenotype: NumericVector,
  weights: ClusterizationWeights,
  debug: boolean = false,
): number {
  const weigher = ((value: number, weight: number) => value**weight);
  return arrayProduct(weighCompoundClusterizationPhenotypeRow(phenotype, weights, weigher, debug));
}

export function clustersGradeMaximizeFitnessLog(
  phenotype: NumericVector,
  weights: ClusterizationWeights,
  debug: boolean = false,
): number {
  const weigher = ((value: number, weight: number) => Math.log(1+value) * weight);
  return arraySum(weighCompoundClusterizationPhenotypeRow(phenotype, weights, weigher, debug));
}
