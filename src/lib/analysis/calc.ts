import { multi, reduce } from "itertools-ts";
import type {
  CompoundsClusterGrade,
  Compound,
  CompoundsClusterizationSummary,
  CompoundsClusterScore,
  CompoundsClusterizationScore,
  WorldSummary,
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
import {
  arrayBinaryOperation,
  arrayUnaryOperation,
  objectBinaryOperation,
  objectUnaryOperation,
  createFilledArray,
  createVector,
  arraySum,
} from "../math";
import type { SimulationInterface } from "../simulation/types/simulation";
import { createEmptyCompoundClusterScore } from "@/lib/analysis/utils";

export function calcCompoundsClusterizationSummary(compounds: Compound[], typesCount: number, minCompoundSize = 2): CompoundsClusterizationSummary {
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

export function calcCompoundsClusterizationScore(
  summary: CompoundsClusterizationSummary,
  compounds: Compound[],
  simulation: SimulationInterface,
): CompoundsClusterizationScore {
  const clustersSizes = summary.clusters.map((c) => c.size);
  const averageClusterSize = reduce.toAverage(clustersSizes) ?? 0;
  const clustersRelativeSizes = summary.clusters.map((c) => c.size / summary.clusteredCount);

  const clustersScores = summary.clusters.map((cluster) => scoreCompoundCluster(cluster));
  const normalizedClusterScores = [...multi.zip(clustersScores, clustersRelativeSizes)]
    .map(([score, relativeSize]) => objectUnaryOperation(score, (x: number) => x * relativeSize));
  const normalizedClusterSumScores = normalizedClusterScores.reduce(
    (acc, x) => objectBinaryOperation(acc, x, (a: number, b: number) => a + b),
    createEmptyCompoundClusterScore(),
  );

  const clustersCount = summary.clusters.length;
  const relativeClustered = summary.filteredCount ? summary.clusteredCount / summary.filteredCount : 0;
  const relativeFiltered = summary.inputCount ? summary.filteredCount / summary.inputCount : 0;

  const relativeCompoundedAtomsCount = arraySum(compounds.map((compound) => compound.size)) / simulation.atoms.length;
  const relativeLinksCount = simulation.links.length / simulation.atoms.length;

  const linksCreatedScore = calcClusterizationLinksCreatedScore(summary, simulation.summary);

  return {
    ...normalizedClusterSumScores,
    averageClusterSize,
    clustersCount,
    relativeClustered,
    relativeFiltered,
    relativeCompoundedAtomsCount,
    relativeLinksCount,
    linksCreatedScore,
  };
}

export function scoreCompoundCluster(clusterGrade: CompoundsClusterGrade): CompoundsClusterScore {
  const averageVertexesCount = reduce.toAverage(clusterGrade.vertexesBounds)!;
  const averageEdgesCount = reduce.toAverage(clusterGrade.edgesBounds)!;
  const averageUniqueTypesCount = reduce.toAverage(clusterGrade.typesCountBounds)! - 1;
  const symmetryGrade = clusterGrade.symmetry;
  const averageRadius = clusterGrade.radius;
  const averageSpeed = clusterGrade.speedAverage;

  return {
    averageVertexesCount,
    averageEdgesCount,
    averageUniqueTypesCount,
    symmetryGrade,
    averageRadius,
    averageSpeed,
  };
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

export function calcClusterizationLinksCreatedScore(
  clusterizationSummary: CompoundsClusterizationSummary,
  worldSummary: WorldSummary<number[]>,
): number {
  const linksCreatedVector = worldSummary.LINKS_TYPE_CREATED;
  const clusteredTypesVector = clusterizationSummary.clusteredTypesVector;
  const clusteredTypesSum = arraySum(clusteredTypesVector);

  if (clusteredTypesSum === 0) {
    return 0;
  }


  if (linksCreatedVector.length !== clusteredTypesVector.length) {
    throw new Error(`linksCreatedVector.length (${linksCreatedVector.length}) !== clusteredTypesVector.length (${clusteredTypesVector.length})`);
  }

  const totalAtomsCount = worldSummary.ATOMS_COUNT[0];

  if (totalAtomsCount < 1) {
    return 0;
  }

  const clusteredTypesVectorNormalized = arrayUnaryOperation(clusteredTypesVector, (x) => x / clusteredTypesSum);
  const normalizedVector = arrayBinaryOperation(
    linksCreatedVector,
    clusteredTypesVectorNormalized,
    (a, b) => a * b / Math.log(totalAtomsCount),
  );

  return arraySum(normalizedVector);
}

export function calcClusteredTypesVector(clusterGrades: CompoundsClusterGrade[], typesCount: number): NumericVector {
  return clusterGrades
    .map((grade) => arrayUnaryOperation(grade.vertexTypesVector, (x) => x * grade.size))
    .reduce(
      (acc, x) => arrayBinaryOperation(acc, x, (a, b) => a + b),
      createFilledArray(typesCount, 0),
    );
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
