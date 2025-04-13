import { multi, reduce } from "itertools-ts";
import type {
  CompoundsClusterGrade,
  Compound,
  CompoundsClusterizationSummary,
  CompoundsClusterScore,
  CompoundsClusterizationScore,
  WorldSummary, PolymerCollectionSummary,
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
import { createEmptyCompoundClusterScore } from "./utils";
import { gradeMonomerPolymerPair } from "./polymers";
import type { ClusterizationParams } from "@/lib/genetic/types";

export function calcCompoundsClusterizationSummary(
  compounds: Compound[],
  typesCount: number,
  params: ClusterizationParams,
): CompoundsClusterizationSummary {
  const [clusterGrades, graphs] = clusterizeCompounds(compounds, typesCount, params.minCompoundSize, params.minUniqueTypesCount);
  const [clusterGradesForPolymers] = clusterizeCompounds(compounds, typesCount, params.monomerCandidateVertexesCountBounds[0], params.minUniqueTypesCount);

  // TODO считать средний параметрический вектор всех кластеров, считать расстояния до него от каждого кластера
  // TODO таким образом повышаем разнообразие кластеров

  clusterGrades.sort((lhs, rhs) => rhs.size - lhs.size);

  const inputCount = compounds.length;
  const filteredCount = graphs.length;
  const clusteredCount = reduce.toSum(clusterGrades.map((cluster) => cluster.size));
  const notClusteredCount = filteredCount - clusteredCount;
  const clusteredTypesVector = calcClusteredTypesVector(clusterGrades, typesCount);

  const polymersSummary = calcClusterizationPolymersScore(
    clusterGradesForPolymers,
    graphs,
    params.monomerCandidateVertexesCountBounds,
    params.polymerCandidateVertexesCountBounds,
    params.minPolymerSize,
    params.minPolymerConfidenceScore,
  );

  return {
    clusters: clusterGrades,
    polymers: polymersSummary,
    inputCount,
    filteredCount,
    clusteredCount,
    notClusteredCount,
    clusteredTypesVector,
  };
}

export function clusterizeCompounds(
  compounds: Compound[],
  typesCount: number,
  minCompoundSize: number,
  minUniqueTypesCount: number
): [CompoundsClusterGrade[], GraphInterface[]] {
  const graphs = compounds
    .filter((compound) => compound.size >= minCompoundSize)
    .map((compound) => createCompoundGraph(compound, typesCount));
  const clusterGrades = clusterGraphs(graphs)
    .map((cluster) => calcCompoundsClusterGrade(cluster))
    .filter((grade) => grade.typesCountAverage >= minUniqueTypesCount);

  return [clusterGrades, graphs];
}

export function calcCompoundsClusterizationScore(
  summary: CompoundsClusterizationSummary,
  compounds: Compound[],
  simulation: SimulationInterface,
): CompoundsClusterizationScore {
  const clustersSizes = summary.clusters.map((c) => c.size);
  const maxClusterSize = reduce.toMax(clustersSizes) ?? 0;
  const averageClusterSize = reduce.toAverage(clustersSizes) ?? 0;
  const clustersRelativeSizes = summary.clusters.map((c) => c.size / summary.clusteredCount);

  const clustersScores = summary.clusters.map((cluster) => scoreCompoundCluster(cluster));
  const normalizedClusterScores = [...multi.zip(clustersScores, clustersRelativeSizes)]
    .map(([score, relativeSize]) => objectUnaryOperation(score, (x: number) => x * relativeSize));
  const normalizedClusterSumScores = normalizedClusterScores.reduce(
    (acc, x) => objectBinaryOperation(acc, x, (a: number, b: number) => a + b),
    createEmptyCompoundClusterScore(),
  );

  const clusterScoresMax = clustersScores.reduce(
    (acc, x) => objectBinaryOperation(acc, x, (lhs: number, rhs: number) => Math.max(lhs, rhs)),
    createEmptyCompoundClusterScore(),
  );

  const clustersCount = summary.clusters.length;
  const relativeClusteredCompounds = summary.inputCount ? summary.clusteredCount / summary.inputCount : 0;
  const relativeFilteredCompounds = summary.inputCount ? summary.filteredCount / summary.inputCount : 0;

  const relativeCompoundedAtoms = arraySum(compounds.map((compound) => compound.size)) / simulation.atoms.length;
  const relativeClusteredAtoms = arraySum(summary.clusteredTypesVector) / simulation.atoms.length;
  const averageAtomLinks = simulation.links.length / simulation.atoms.length;

  const newLinksCreatedPerStepScore = calcClusterizationLinksCreatedScore(summary, simulation.summary);
  const atomsFrequencyScore = calcAtomsFrequencyScore(simulation);

  return {
    maxClusterSize,
    averageClusterSize,
    clustersCount,
    relativeClusteredCompounds,
    relativeFilteredCompounds,
    relativeCompoundedAtoms,
    relativeClusteredAtoms,
    averageAtomLinks,
    newLinksCreatedPerStepScore,
    atomsFrequencyScore,

    maxClusteredCompoundVertexesCount: clusterScoresMax.compoundVertexesCount,
    averageClusteredCompoundVertexesCount: normalizedClusterSumScores.compoundVertexesCount,
    averageClusteredCompoundEdgesCount: normalizedClusterSumScores.compoundEdgesCount,
    averageClusteredCompoundUniqueTypesCount: normalizedClusterSumScores.compoundUniqueTypesCount,
    averageClusteredCompoundSymmetryScore: normalizedClusterSumScores.compoundSymmetryScore,
    averageClusteredCompoundRadius: normalizedClusterSumScores.compoundRadius,
    averageClusteredCompoundSpeed: normalizedClusterSumScores.compoundSpeed,

    relativePolymersCount: summary.polymers.count / simulation.atoms.length,
    maxPolymerSize: summary.polymers.maxPolymerSize,
    averageMonomerVertexesCount: summary.polymers.averageMonomerVertexesCount,
    averageMonomerUniqueTypesCount: summary.polymers.averageMonomerUniqueTypesCount,
    averagePolymerVertexesCount: summary.polymers.averagePolymerVertexesCount,
    averagePolymerSize: summary.polymers.averagePolymerSize,
    averagePolymerConfidenceScore: summary.polymers.averageConfidenceScore,
  };
}

export function scoreCompoundCluster(clusterGrade: CompoundsClusterGrade): CompoundsClusterScore {
  const averageVertexesCount = reduce.toSum(clusterGrade.vertexTypesVector)!;
  const averageEdgesCount = reduce.toSum(clusterGrade.edgeTypesVector)!;
  const averageUniqueTypesCount = reduce.toAverage(clusterGrade.typesCountBounds)!;
  const symmetryGrade = clusterGrade.symmetry;
  const averageRadius = clusterGrade.radius;
  const averageSpeed = clusterGrade.speedAverage;

  return {
    compoundVertexesCount: averageVertexesCount,
    compoundEdgesCount: averageEdgesCount,
    compoundUniqueTypesCount: averageUniqueTypesCount,
    compoundSymmetryScore: symmetryGrade,
    compoundRadius: averageRadius,
    compoundSpeed: averageSpeed,
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
    typesCountAverage: calcTypesCountAverage(cluster),
    vertexTypesVector,
    edgeTypesVector,
    typesVector,
    radius: calcAverageGraphRadius(cluster),
    speedBounds: calcSpeedBounds(cluster),
    speedAverage: calcAverageSpeed(cluster),
    graphExample: cluster[0], // TODO select average graph
  };
}

export function calcClusterizationPolymersScore(
  clusterGrades: CompoundsClusterGrade[],
  allGraphs: GraphInterface[],
  monomerVertexesCountBounds: [number, number],
  polymerVertexesCountBounds: [number, number],
  minPolymerSize: number,
  minConfidenceScore: number,
): PolymerCollectionSummary {
  const summary: PolymerCollectionSummary = {
    count: 0,
    averageMonomerVertexesCount: 0,
    averageMonomerUniqueTypesCount: 0,
    averagePolymerVertexesCount: 0,
    averagePolymerSize: 0,
    averageConfidenceScore: 0,
    maxMonomerVertexesCount: 0,
    maxPolymerSize: 0,
    polymersGrades: [],
  };

  const monomerCandidates = clusterGrades.map((cluster) => cluster.graphExample).filter(
    (graph) => (
      graph.vertexes.length > monomerVertexesCountBounds[0] &&
      graph.vertexes.length < monomerVertexesCountBounds[1]
    ),
  );
  const polymerCandidates = allGraphs.filter(
    (graph) => (
      graph.vertexes.length > polymerVertexesCountBounds[0] &&
      graph.edges.length < polymerVertexesCountBounds[1]
    ),
  );

  for (const monomerCandidate of monomerCandidates) {
    for (const polymerCandidate of polymerCandidates) {
      const grade = gradeMonomerPolymerPair(monomerCandidate, polymerCandidate, minPolymerSize);
      if (grade.confidenceScore < minConfidenceScore) {
        continue;
      }
      summary.count++;
      summary.averageMonomerVertexesCount += grade.monomerVertexesCount;
      summary.averageMonomerUniqueTypesCount += grade.monomerUniqueTypesCount;
      summary.averagePolymerVertexesCount += grade.polymerVertexesCount;
      summary.averagePolymerSize += grade.polymerSize;
      summary.averageConfidenceScore += grade.confidenceScore;
      summary.maxPolymerSize = Math.max(summary.maxPolymerSize, grade.polymerSize);
      summary.maxMonomerVertexesCount = Math.max(summary.maxMonomerVertexesCount, grade.monomerVertexesCount);
      summary.polymersGrades.push(grade);
    }
  }
  summary.averageMonomerVertexesCount = summary.count > 0 ? summary.averageMonomerVertexesCount / summary.count : 0;
  summary.averageMonomerUniqueTypesCount = summary.count > 0 ? summary.averageMonomerUniqueTypesCount / summary.count : 0;
  summary.averagePolymerVertexesCount = summary.count > 0 ? summary.averagePolymerVertexesCount / summary.count : 0;
  summary.averagePolymerSize = summary.count > 0 ? summary.averagePolymerSize / summary.count : 0;
  summary.averageConfidenceScore = summary.count > 0 ? summary.averageConfidenceScore / summary.count : 0;
  summary.polymersGrades.sort((lhs, rhs) => rhs.polymerVertexesCount - lhs.polymerVertexesCount);

  return summary;
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

export function calcTypesCountAverage(cluster: GraphInterface[]): number {
  return reduce.toAverage(cluster.map((graph) => countUniqueTypes(graph))) as number;
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

export function calcAtomsFrequencyScore(simulation: SimulationInterface): number {
  const actualVector = createVector(simulation.summary.ATOMS_TYPE_COUNT).normalize();
  const expectedVector = createVector(simulation.config.typesConfig.FREQUENCIES).normalize();
  const diff = actualVector.clone().sub(expectedVector).abs;
  return (Math.sqrt(2) - diff) / Math.sqrt(2);
}
