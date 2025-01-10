import { createPipe, multi, reduce, single } from "itertools-ts";
import type {
  CompoundsClusterGrade,
  Compound,
  CompoundsClusterizationSummary,
  CompoundsClustersSummaryMetrics, CompoundsClusterScore
} from "./types";
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
import type { NumericVector, VectorInterface } from "../math/types";
import { arrayBinaryOperation, arrayUnaryOperation, createFilledArray, createVector } from "../math";
import type { ClusterizationWeightsConfig } from '../genetic/types';

export function gradeCompoundClusters(compounds: Compound[], typesCount: number, minCompoundSize = 2): CompoundsClusterizationSummary {
  const graphs = compounds
    .filter((compound) => compound.size >= minCompoundSize)
    .map((compound) => createCompoundGraph(compound, typesCount));
  const clusters = clusterGraphs(graphs);
  const clusterGrades: CompoundsClusterGrade[] = clusters.map((cluster) => calcCompoundsClusterGrade(cluster));
  // TODO считать средний параметрический вектор всех кластеров, считать расстояния до него от каждого кластера
  // TODO таким образом повышаем разнообразие кластеров

  clusterGrades.sort((lhs, rhs) => rhs.size - lhs.size);

  const inputCount = compounds.length;
  const filteredCount = graphs.length;
  const clusteredCount = reduce.toSum(clusterGrades.map((cluster) => cluster.size));
  const notClusteredCount = filteredCount - clusteredCount;
  const clusteredTypesVector = calcClusteredTypesVector(clusterGrades, typesCount);
  return {
    clusters: clusterGrades,
    inputCount,
    filteredCount,
    clusteredCount,
    notClusteredCount,
    clusteredTypesVector,
  };
}

export function calcClusteredTypesVector(clusterGrades: CompoundsClusterGrade[], typesCount: number): NumericVector {
  return clusterGrades
    .map((grade) => arrayUnaryOperation(grade.vertexTypesVector, (x) => x * grade.size))
    .reduce(
      (acc, x) => arrayBinaryOperation(acc, x, (a, b) => a + b),
      createFilledArray(typesCount, 0),
    );
}

export function scoreCompoundCluster(clusterGrade: CompoundsClusterGrade): CompoundsClusterScore {
  const averageVertexesCount = reduce.toAverage(clusterGrade.vertexesBounds)!;
  const averageEdgesCount = reduce.toAverage(clusterGrade.edgesBounds)!;
  const averageUniqueTypesCount = reduce.toAverage(clusterGrade.typesCountBounds)! - 1;
  const symmetryGrade = clusterGrade.symmetry;
  const averageRadius = clusterGrade.radius;
  const averageSpeed = clusterGrade.speedAverage;
  const averageDifference = 1 + clusterGrade.difference;

  return {
    averageVertexesCount,
    averageEdgesCount,
    averageUniqueTypesCount,
    symmetryGrade,
    averageRadius,
    averageSpeed,
    averageDifference,
  };
}

export function calcMetricsForCompoundClustersSummary(
  summary: CompoundsClusterizationSummary,
  weights: ClusterizationWeightsConfig,
): CompoundsClustersSummaryMetrics {
  const clustersSizes = summary.clusters.map((c) => c.size);
  const clusterSize = reduce.toAverage(clustersSizes) ?? 0;
  const clustersRelativeSizes = summary.clusters.map((c) => c.size / summary.clusteredCount);

  // const clustersScore = reduce.toSum(single.map(
  //   multi.zip(summary.clusters, clustersRelativeSizes),
  //   ([cluster, relativeSize]) => (relativeSize) * scoreCompoundCluster(cluster, weights),
  // ));

  const clustersScores = summary.clusters.map((cluster) => scoreCompoundCluster(cluster));
  const clustersScoresVectors = clustersScores.map((score) => [
    score.averageVertexesCount,
    score.averageEdgesCount,
    score.averageUniqueTypesCount,
    score.symmetryGrade,
    score.averageRadius,
    score.averageSpeed,
    score.averageDifference,
  ]);
  const clustersScoresNormalizedVectors = [...multi.zip(clustersScoresVectors, clustersRelativeSizes)]
    .map(([clusterScoreVector, relativeSize]) => arrayUnaryOperation(clusterScoreVector, (x) => x * relativeSize));

  // return averageVertexesCount ** weights.vertexesCountWeight
  //   * averageEdgesCount ** weights.edgesCountWeight
  //   * averageUniqueTypesCount ** weights.uniqueTypesCountWeight
  //   * symmetryGrade ** weights.symmetryWeight
  //   * averageRadius ** weights.radiusWeight
  //   * averageSpeed ** weights.speedWeight
  //   / averageDifference ** weights.differenceWeight;


  const clustersCount = summary.clusters.length;
  const relativeClustered = summary.filteredCount ? summary.clusteredCount / summary.filteredCount : 0;
  const relativeFiltered = summary.inputCount ? summary.filteredCount / summary.inputCount : 0;

  return [clustersScore, clusterSize, clustersCount, relativeClustered, relativeFiltered];
}

export function weighCompoundClustersSummaryMetrics(
  metrics: CompoundsClustersSummaryMetrics,
  weights: ClusterizationWeightsConfig,
): number {
  const [clustersScore, clusterSize, clustersCount, relativeClustered, relativeFiltered] = metrics;
  return clustersScore
    * clusterSize ** weights.clusterSizeWeight
    * clustersCount ** weights.clustersCountWeight
    * relativeClustered ** weights.relativeClusteredCountWeight
    * relativeFiltered ** weights.relativeFilteredCountWeight;
}

export function calcCompoundsClusterGrade(cluster: GraphInterface[]): CompoundsClusterGrade {
  const vertexTypesVector = calcAverageVertexTypesVector(cluster);
  const edgeTypesVector = calcAverageEdgeTypesVector(cluster);
  const typesVector = [...vertexTypesVector].concat(edgeTypesVector).map((x) => Math.round(x));
  return {
    size: cluster.length,
    difference: calcGraphsClusterAverageDifference(cluster),
    symmetry: calcAverageSymmetry(cluster),
    vertexesBounds: calcVertexesBounds(cluster),
    edgesBounds: calcEdgesBounds(cluster),
    typesCountBounds: calcTypesCountBounds(cluster),
    vertexTypesVector,
    edgeTypesVector,
    typesVector,
    radius: calcAverageGraphRadius(cluster),
    speedBounds: calcSpeedBounds(cluster),
    speedAverage: calcAverageSpeed(cluster),
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

export function calcSpeedBounds(cluster: GraphInterface[]): [number, number] {
  const speeds = cluster.map((graph) => createVector(graph.speed).abs);
  return reduce.toMinMax(speeds) as [number, number];
}

export function calcAverageSpeed(cluster: GraphInterface[]): number {
  const speeds = cluster.map((graph) => createVector(graph.speed));
  const speedSum = speeds.reduce((a, b) => a.add(b), createVector([0, 0]));
  return speedSum.div(speeds.length).abs;
}

export function calcGraphRadius(graph: GraphInterface): number {
  return getGraphAverageRadius(graph, getGraphCentroid(graph));
}

export function convertDifferenceToNormalizedSimilarityGrade(diff: number, normCoefficient: number = 0.5): number {
  return 1 / (1 + Math.abs(diff)*normCoefficient);
}

export function createDefaultClusterizationWeightsConfig(): ClusterizationWeightsConfig {
  return {
    minCompoundSize: 5,
    clustersCountWeight: 1,
    clusterSizeWeight: 1,
    relativeFilteredCountWeight: 1,
    relativeClusteredCountWeight: 1,
    vertexesCountWeight: 1,
    edgesCountWeight: 1,
    uniqueTypesCountWeight: 1,
    symmetryWeight: 1,
    differenceWeight: 1,
    radiusWeight: 0.5,
    speedWeight: 0.5,
    relativeCompoundedAtomsCountWeight: 1,
    relativeLinksCountWeight: 1,
    linksCreatedWeight: 1,
  };
}

export function createModifiedClusterizationWeightsConfig(): ClusterizationWeightsConfig {
  return {
    minCompoundSize: 6,
    clustersCountWeight: 1,
    clusterSizeWeight: 1,
    relativeFilteredCountWeight: 1,
    relativeClusteredCountWeight: 1,
    vertexesCountWeight: 2,
    edgesCountWeight: 1,
    uniqueTypesCountWeight: 1,
    symmetryWeight: 1,
    differenceWeight: 1,
    radiusWeight: 0.5,
    speedWeight: 0.5,
    relativeCompoundedAtomsCountWeight: 1,
    relativeLinksCountWeight: 1,
    linksCreatedWeight: 1,
  };
}
