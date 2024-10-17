import type { GraphConfig } from "../graph/types";

export function measureBilateralSymmetry(graph: GraphConfig): number {
  // Build adjacency map
  const adjacencyMap: Map<number, Set<number>> = new Map();
  for (const vertex of graph.vertexes) {
    adjacencyMap.set(vertex.id, new Set());
  }
  for (const edge of graph.edges) {
    adjacencyMap.get(edge.lhsId)!.add(edge.rhsId);
    adjacencyMap.get(edge.rhsId)!.add(edge.lhsId);
  }

  // Group vertices by type
  const typeToVertices: Map<number, number[]> = new Map();
  for (const vertex of graph.vertexes) {
    if (!typeToVertices.has(vertex.type)) {
      typeToVertices.set(vertex.type, []);
    }
    typeToVertices.get(vertex.type)!.push(vertex.id);
  }

  // Build involutive mapping σ: V → V
  const mapping: Map<number, number> = new Map();
  for (const [type, vertices] of typeToVertices.entries()) {
    // Try to pair vertices of the same type
    const ids = vertices.slice();
    while (ids.length >= 2) {
      const u = ids.pop()!;
      const v = ids.pop()!;
      mapping.set(u, v);
      mapping.set(v, u);
    }
    // If an odd number, map the last vertex to itself
    if (ids.length === 1) {
      const u = ids.pop()!;
      mapping.set(u, u);
    }
  }

  // Check involutive property σ² = identity
  let isInvolutive = true;
  for (const [u, v] of mapping.entries()) {
    if (mapping.get(v)! !== u) {
      isInvolutive = false;
      break;
    }
  }
  if (!isInvolutive) {
    console.error('Mapping is not involutive');
    return 0;
  }

  // Count preserved edges
  let preservedEdges = 0;
  for (const edge of graph.edges) {
    const u = edge.lhsId;
    const v = edge.rhsId;
    const mappedU = mapping.get(u)!;
    const mappedV = mapping.get(v)!;
    if (adjacencyMap.get(mappedU)!.has(mappedV)) {
      preservedEdges += 1;
    }
  }

  // Compute symmetry measure
  return preservedEdges / graph.edges.length;
}
