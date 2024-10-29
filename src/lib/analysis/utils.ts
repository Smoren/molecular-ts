import { reduce } from "itertools-ts";
import type { CompoundsClusterGrade, Compound, CompoundsClusterizationSummary } from "../types/analysis";
import { clusterGraphs } from "../graph/clusterization";
import { calcGraphsClusterAverageDifference } from "../graph/utils";
import { createCompoundGraph } from "./factories";
import { scoreBilateralSymmetry, scoreSymmetryAxisByQuartering } from "./symmetry";

export function gradeCompoundClusters(compounds: Compound[], typesCount: number, minCompoundSize = 2): CompoundsClusterizationSummary {
  const graphs = compounds
    .filter((compound) => compound.size >= minCompoundSize)
    .map((compound) => createCompoundGraph(compound, typesCount));
  const clusters = clusterGraphs(graphs);

  const clusterGrades: CompoundsClusterGrade[] = clusters.map((cluster) => {
    const symmetry = reduce.toAverage(
      cluster.map((graph) => scoreBilateralSymmetry(graph, scoreSymmetryAxisByQuartering)[0])
    );
    return {
      size: cluster.length,
      difference: calcGraphsClusterAverageDifference(cluster),
      symmetry: symmetry!,
      vertexes_bounds: reduce.toMinMax(cluster.map((graph) => graph.vertexes.length)) as [number, number],
      edges_bounds: reduce.toMinMax(cluster.map((graph) => graph.edges.length)) as [number, number],
    };
  });

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
