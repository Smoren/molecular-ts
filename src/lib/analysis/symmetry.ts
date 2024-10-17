import type { Edge, GraphConfig, GraphInterface, Vertex } from "../graph/types";

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

type SubgraphCount = {
  subgraph: GraphConfig;
  count: number;
};

export function findDuplicatedGraphParts(graph: GraphConfig, maxSize: number = 6): SubgraphCount[] {
  const subgraphCounts: Map<string, { subgraph: GraphConfig; count: number }> = new Map();

  // Build adjacency list for the graph
  const adjacencyList: Map<number, Set<number>> = new Map();
  for (const vertex of graph.vertexes) {
    adjacencyList.set(vertex.id, new Set());
  }
  for (const edge of graph.edges) {
    adjacencyList.get(edge.lhsId)!.add(edge.rhsId);
    adjacencyList.get(edge.rhsId)!.add(edge.lhsId);
  }

  // For memoization to avoid duplicate subgraphs
  const memo: Set<string> = new Set();

  // Generate connected subgraphs up to maxSize
  for (const vertex of graph.vertexes) {
    generateSubgraphs(
      graph,
      adjacencyList,
      [vertex.id],
      new Set([vertex.id]),
      maxSize,
      memo,
      subgraphCounts
    );
  }

  // Convert the map to an array and filter subgraphs that occur more than once
  return Array.from(subgraphCounts.values()).filter((item) => item.count > 1 && item.subgraph.edges.length > 3);
}

function generateSubgraphs(
  graph: GraphConfig,
  adjacencyList: Map<number, Set<number>>,
  currentPath: number[],
  visited: Set<number>,
  maxSize: number,
  memo: Set<string>,
  subgraphCounts: Map<string, { subgraph: GraphConfig; count: number }>
) {
  if (currentPath.length > maxSize) {
    return;
  }

  // Generate canonical label for the current subgraph
  const subgraphVertices = [...visited];
  const subgraphEdges = getSubgraphEdges(graph.edges, subgraphVertices);
  const subgraph: GraphConfig = {
    vertexes: graph.vertexes.filter((v) => visited.has(v.id)),
    edges: subgraphEdges,
    typesCount: graph.typesCount
  };
  const canonicalLabel = getCanonicalLabel(subgraph);
  if (memo.has(canonicalLabel)) {
    // Increment count if subgraph already exists
    const existing = subgraphCounts.get(canonicalLabel)!;
    existing.count += 1;
  } else {
    memo.add(canonicalLabel);
    subgraphCounts.set(canonicalLabel, { subgraph, count: 1 });
  }

  // Expand the subgraph
  for (const vid of currentPath) {
    for (const neighbor of adjacencyList.get(vid)!) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        currentPath.push(neighbor);
        generateSubgraphs(
          graph,
          adjacencyList,
          currentPath,
          visited,
          maxSize,
          memo,
          subgraphCounts
        );
        currentPath.pop();
        visited.delete(neighbor);
      }
    }
  }
}

function getSubgraphEdges(edges: Edge[], vertexIds: number[]): Edge[] {
  const vertexSet = new Set(vertexIds);
  return edges.filter(
    (e) => vertexSet.has(e.lhsId) && vertexSet.has(e.rhsId)
  );
}

function getCanonicalLabel(subgraph: GraphConfig): string {
  // Generate adjacency matrix
  const vertices = subgraph.vertexes;
  const vertexIds = vertices.map((v) => v.id);
  const idToIndex: Map<number, number> = new Map();
  vertexIds.forEach((id, idx) => idToIndex.set(id, idx));
  const size = vertices.length;
  const adjMatrix: number[][] = Array.from({ length: size }, () =>
    Array(size).fill(0)
  );

  for (const edge of subgraph.edges) {
    const i = idToIndex.get(edge.lhsId)!;
    const j = idToIndex.get(edge.rhsId)!;
    adjMatrix[i][j] = adjMatrix[j][i] = 1;
  }

  // Get all permutations of indices to generate canonical label
  const indices = [...Array(size).keys()];
  const permutations = permute(indices);
  let minCode = '';

  for (const perm of permutations) {
    // Map old indices to new ones
    const permutedTypes = perm.map((idx) => vertices[idx].type);
    const permutedMatrix = perm.map((i) => perm.map((j) => adjMatrix[i][j]));
    const code = serializeGraph(permutedTypes, permutedMatrix);
    if (!minCode || code < minCode) {
      minCode = code;
    }
  }
  return minCode;
}

function serializeGraph(types: number[], adjMatrix: number[][]): string {
  // Serialize the types and adjacency matrix into a string
  const typeStr = types.join(',');
  const adjStr = adjMatrix.map((row) => row.join('')).join(';');
  return `T:${typeStr}|A:${adjStr}`;
}

function permute(arr: number[]): number[][] {
  const result: number[][] = [];
  const n = arr.length;

  function generate(k: number, a: number[]) {
    if (k === 1) {
      result.push([...a]);
    } else {
      generate(k - 1, a);
      for (let i = 0; i < k - 1; i++) {
        if (k % 2 === 0) {
          [a[i], a[k - 1]] = [a[k - 1], a[i]];
        } else {
          [a[0], a[k - 1]] = [a[k - 1], a[0]];
        }
        generate(k - 1, a);
      }
    }
  }

  generate(n, arr.slice());
  return result;
}

