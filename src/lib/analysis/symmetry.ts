import type { GraphInterface, Vertex } from "../graph/types";

/**
 * Computes a quantitative measure of bilateral symmetry for a given graph.
 * The score ranges from 0 (no symmetry) to 1 (perfect bilateral symmetry).
 *
 * @param graph - The graph to be evaluated for bilateral symmetry.
 * @returns A number representing the symmetry score.
 */
export function measureBilateralSymmetry(graph: GraphInterface): number {
  const { vertexes, edges } = graph;
  const n = vertexes.length;

  if (n === 0) return 1; // An empty graph is perfectly symmetric

  // Create a map from vertex id to vertex object for quick lookup
  const vertexMap: Map<number, Vertex> = new Map();
  vertexes.forEach(v => vertexMap.set(v.id, v));

  // Create adjacency list
  const adjacency: Map<number, Set<number>> = new Map();
  vertexes.forEach(v => adjacency.set(v.id, new Set()));
  edges.forEach(e => {
    adjacency.get(e.lhsId)!.add(e.rhsId);
    adjacency.get(e.rhsId)!.add(e.lhsId);
  });

  // Group vertices by type
  const typeGroups: Map<number, Vertex[]> = new Map();
  vertexes.forEach(v => {
    if (!typeGroups.has(v.type)) {
      typeGroups.set(v.type, []);
    }
    typeGroups.get(v.type)!.push(v);
  });

  // To have bilateral symmetry, each type group should have an even number of vertices
  // We'll attempt to pair vertices within each type group
  let totalPairs = 0;
  let matchedPairs = 0;

  typeGroups.forEach(group => {
    const size = group.length;
    if (size < 2) return; // Cannot form a pair

    // Attempt to pair vertices with identical adjacency patterns
    // For simplicity, we'll consider adjacency based on types
    const adjacencyTypes: Map<string, Vertex[]> = new Map();

    group.forEach(v => {
      // Create a signature based on sorted types of adjacent vertices
      const adjacentTypes = Array.from(adjacency.get(v.id)!)
        .map(adjId => vertexMap.get(adjId)!.type)
        .sort((a, b) => a - b)
        .join(',');

      if (!adjacencyTypes.has(adjacentTypes)) {
        adjacencyTypes.set(adjacentTypes, []);
      }
      adjacencyTypes.get(adjacentTypes)!.push(v);
    });

    // For each adjacency signature, count how many pairs can be formed
    adjacencyTypes.forEach(pairGroup => {
      const pairs = Math.floor(pairGroup.length / 2);
      totalPairs += pairs;
      matchedPairs += pairs;
    });
  });

  // The symmetry score is based on how many matched pairs exist over the total possible pairs
  const maxPairs = Math.floor(n / 2);
  if (maxPairs === 0) return 1; // Single vertex is perfectly symmetric

  const symmetryScore = matchedPairs / maxPairs;

  // Ensure the score is between 0 and 1
  return Math.min(Math.max(symmetryScore, 0), 1);
}
