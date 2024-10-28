import type { GraphInterface } from "./types";
import { calcDistanceBetweenGraphsByTypesCombined } from "./utils";

export function clusterGraphs(graphs: GraphInterface[], epsilon: number = 1.0, minPts: number = 2): GraphInterface[][] {
  const clusters: Array<Set<GraphInterface>> = [];
  const visited = new Set<number>();
  const clusterAssignments: Map<number, number> = new Map(); // Maps graph index to cluster index

  for (let i = 0; i < graphs.length; i++) {
    const graph = graphs[i];
    if (visited.has(i)) {
      continue;
    }

    visited.add(i);
    const neighborIndices = regionQuery(graphs, i, epsilon);

    if (neighborIndices.length < minPts) {
      // Point is considered noise (optional to handle)
      continue;
    }

    // Start a new cluster
    const clusterIndex = clusters.length;
    clusters.push(new Set());
    expandCluster(
      graphs,
      i,
      neighborIndices,
      clusters[clusterIndex],
      clusterIndex,
      visited,
      clusterAssignments,
      epsilon,
      minPts
    );
  }

  return clusters.map((cluster) => [...cluster]);
}

/**
 * Expands the cluster to include density-reachable items.
 * @param graphs - The array of all graphs.
 * @param index - The index of the current graph.
 * @param neighborIndices - Neighboring graph indices of the current graph.
 * @param cluster - The current cluster being expanded.
 * @param clusterIndex - The index of the current cluster.
 * @param visited - Set of visited graph indices.
 * @param clusterAssignments - Map of graph indices to their cluster indices.
 * @param epsilon - The maximum distance for neighborhood.
 * @param minPts - The minimum number of points to form a dense region.
 */
function expandCluster(
  graphs: GraphInterface[],
  index: number,
  neighborIndices: number[],
  cluster: Set<GraphInterface>,
  clusterIndex: number,
  visited: Set<number>,
  clusterAssignments: Map<number, number>,
  epsilon: number,
  minPts: number
) {
  // Add the starting point to the cluster
  cluster.add(graphs[index]);
  clusterAssignments.set(index, clusterIndex);

  let i = 0;
  while (i < neighborIndices.length) {
    const neighborIndex = neighborIndices[i];

    if (!visited.has(neighborIndex)) {
      visited.add(neighborIndex);
      const neighborNeighborIndices = regionQuery(graphs, neighborIndex, epsilon);

      if (neighborNeighborIndices.length >= minPts) {
        // Add new neighbors to the list if they are not already included
        for (const nIdx of neighborNeighborIndices) {
          if (!neighborIndices.includes(nIdx)) {
            neighborIndices.push(nIdx);
          }
        }
      }
    }

    if (!clusterAssignments.has(neighborIndex)) {
      // Assign the neighbor to the cluster
      cluster.add(graphs[neighborIndex]);
      clusterAssignments.set(neighborIndex, clusterIndex);
    }

    i++;
  }
}

/**
 * Finds the neighbors of a given graph within the epsilon distance.
 * @param graphs - The array of all graphs.
 * @param index - The index of the graph to find neighbors for.
 * @param epsilon - The maximum distance for neighborhood.
 * @returns An array of indices of neighboring graphs.
 */
function regionQuery(graphs: GraphInterface[], index: number, epsilon: number): number[] {
  const neighbors: number[] = [];

  for (let i = 0; i < graphs.length; i++) {
    if (i === index) {
      continue;
    }

    const distance = calcDistanceBetweenGraphsByTypesCombined(graphs[index], graphs[i]);
    if (distance <= epsilon) {
      neighbors.push(i);
    }
  }

  return neighbors;
}
