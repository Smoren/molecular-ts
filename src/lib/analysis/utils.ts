import { reduce } from "itertools-ts";
import type { CompoundsClusterGrade, Compound, CompoundsClusterizationSummary } from "../types/analysis";
import { clusterGraphs } from "../graph/clusterization";
import {
  calcGraphsClusterAverageDifference,
  countEdgesGroupedByVertexTypes,
  countUniqueTypes,
  countVertexesGroupedByType,
  getGraphAverageRadius,
  getGraphCentroid,
} from "../graph/utils";
import { createCompoundGraph } from "./factories";
import { scoreBilateralSymmetry, scoreSymmetryAxisByQuartering } from "./symmetry";
import type { GraphInterface } from "../graph/types";
import type { VectorInterface } from "../math/types";
import { createFilledArray, createVector } from "../math";
import type { ClusterizationWeightsConfig } from '@/lib/types/genetic';

export function gradeCompoundClusters(compounds: Compound[], typesCount: number, minCompoundSize = 2): CompoundsClusterizationSummary {
  const graphs = compounds
    .filter((compound) => compound.size >= minCompoundSize)
    .map((compound) => createCompoundGraph(compound, typesCount));
  const clusters = clusterGraphs(graphs);
  const clusterGrades: CompoundsClusterGrade[] = clusters.map((cluster) => calcCompoundsClusterGrade(cluster));

  clusterGrades.sort((lhs, rhs) => rhs.size - lhs.size);
  const inputCount = compounds.length;
  const filteredCount = graphs.length;
  const clusteredCount = reduce.toSum(clusterGrades.map((cluster) => cluster.size));
  const notClusteredCount = filteredCount - clusteredCount;
  return {
    clusters: clusterGrades,
    inputCount,
    filteredCount,
    clusteredCount,
    notClusteredCount,
  };
}

export function scoreCompoundCluster(clusterGrade: CompoundsClusterGrade, weights: ClusterizationWeightsConfig): number {
  const averageVertexesCount = reduce.toAverage(clusterGrade.vertexesBounds)!;
  const averageEdgesCount = reduce.toAverage(clusterGrade.edgesBounds)!;
  const averageUniqueTypesCount = reduce.toAverage(clusterGrade.typesCountBounds)! - 1;
  const symmetryGrade = clusterGrade.symmetry;
  const averageRadius = clusterGrade.radius;
  const averageDifference = 1 + clusterGrade.difference;
  return averageVertexesCount ** weights.vertexesCountWeight
    * averageEdgesCount ** weights.edgesCountWeight
    * averageUniqueTypesCount ** weights.uniqueTypesCountWeight
    * symmetryGrade ** weights.symmetryWeight
    * averageRadius ** weights.radiusWeight
    / averageDifference ** weights.differenceWeight;
}

export function scoreCompoundClustersSummary(
  summary: CompoundsClusterizationSummary,
  weights: ClusterizationWeightsConfig,
): number {
  const clustersScore = reduce.toSum(
    summary.clusters.map((c) => scoreCompoundCluster(c, weights))
  );
  const relativeClustered = summary.clusteredCount / summary.filteredCount;
  const relativeFiltered = summary.filteredCount / summary.inputCount;
  return clustersScore
    * relativeClustered ** weights.relativeClusteredCountWeight
    * relativeFiltered ** weights.relativeFilteredCountWeight;
}

export function calcCompoundsClusterGrade(cluster: GraphInterface[]): CompoundsClusterGrade {
  // TODO compound speed
  return {
    size: cluster.length,
    difference: calcGraphsClusterAverageDifference(cluster),
    symmetry: calcAverageSymmetry(cluster),
    vertexesBounds: calcVertexesBounds(cluster),
    edgesBounds: calcEdgesBounds(cluster),
    typesCountBounds: calcTypesCountBounds(cluster),
    vertexTypesVector: calcAverageVertexTypesVector(cluster),
    edgeTypesVector: calcAverageEdgeTypesVector(cluster),
    radius: calcAverageGraphRadius(cluster),
  };
}

export function calcAverageSymmetry(cluster: GraphInterface[]): number {
  return reduce.toAverage(
    cluster.map((graph) => scoreBilateralSymmetry({
      graph,
      scoreAxisFunction: scoreSymmetryAxisByQuartering,
    })[0])
  )!;
}

export function calcVertexesBounds(cluster: GraphInterface[]): [number, number] {
  return reduce.toMinMax(cluster.map((graph) => graph.vertexes.length)) as [number, number];
}

export function calcEdgesBounds(cluster: GraphInterface[]): [number, number] {
  return reduce.toMinMax(cluster.map((graph) => graph.edges.length)) as [number, number];
}

export function calcTypesCountBounds(cluster: GraphInterface[]): [number, number] {
  return reduce.toMinMax(cluster.map((graph) => countUniqueTypes(graph))) as [number, number];
}

export function calcAverageVertexTypesVector(cluster: GraphInterface[]): VectorInterface {
  const vectors = cluster.map((graph) => createVector(countVertexesGroupedByType(graph)));
  const vectorsSum = vectors.reduce((acc, v) => acc.add(v), createVector(createFilledArray(vectors[0].length, 0)));
  return vectorsSum.div(vectors.length);
}

export function calcAverageEdgeTypesVector(cluster: GraphInterface[]): VectorInterface {
  const vectors = cluster.map((graph) => createVector(countEdgesGroupedByVertexTypes(graph)));
  const vectorsSum = vectors.reduce((acc, v) => acc.add(v), createVector(createFilledArray(vectors[0].length, 0)));
  return vectorsSum.div(vectors.length);
}

export function calcAverageGraphRadius(cluster: GraphInterface[]): number {
  return reduce.toAverage(cluster.map((graph) => calcGraphRadius(graph)))!;
}

export function calcGraphRadius(graph: GraphInterface): number {
  return getGraphAverageRadius(graph, getGraphCentroid(graph));
}
