import { describe, expect, it } from "@jest/globals";
import type { Graph } from "../../src/lib/types/graph";
import type { NumericVector } from "../../src/lib/math/types";
import { countEdgesGroupedByVertexTypes, countVertexesGroupedByType } from "../../src/lib/graph/functions";

describe.each([
  ...dataProviderForCountVertexesAndEdges(),
] as Array<[Graph, NumericVector, NumericVector]>)(
  'Count Vertexes And Edges Test',
  (graph: Graph, expectedVertexesCounts: NumericVector, expectedEdgesCounts: NumericVector) => {
    it('', () => {
      const actualVertexesCounts = countVertexesGroupedByType(graph);
      expect(actualVertexesCounts).toEqual(expectedVertexesCounts);

      const actualEdgesCounts = countEdgesGroupedByVertexTypes(graph);
      expect(actualEdgesCounts).toEqual(expectedEdgesCounts);
    });
  },
);

function dataProviderForCountVertexesAndEdges(): Array<[Graph, NumericVector, NumericVector]> {
  return [
    [
      {
        typesCount: 1,
        vertexes: [],
        edges: [],
      },
      [0],
      [0],
    ],
    [
      {
        typesCount: 2,
        vertexes: [],
        edges: [],
      },
      [0, 0],
      [0, 0, 0],
    ],
    [
      {
        typesCount: 2,
        vertexes: [
          { id: 0, type: 1 },
        ],
        edges: [],
      },
      [0, 1],
      [0, 0, 0],
    ],
    [
      {
        typesCount: 2,
        vertexes: [
          { id: 0, type: 1 },
          { id: 1, type: 0 },
        ],
        edges: [],
      },
      [1, 1],
      [0, 0, 0],
    ],
    [
      {
        typesCount: 2,
        vertexes: [
          { id: 0, type: 1 },
          { id: 1, type: 0 },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
        ],
      },
      [1, 1],
      [0, 1, 0],
    ],
    [
      {
        typesCount: 2,
        vertexes: [
          { id: 0, type: 0 },
          { id: 1, type: 0 },
          { id: 2, type: 1 },
          { id: 3, type: 1 },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
          { lhsId: 0, rhsId: 2 },
          { lhsId: 1, rhsId: 2 },
          { lhsId: 2, rhsId: 3 },
        ],
      },
      [2, 2],
      [1, 2, 1],
    ],
    [
      {
        typesCount: 3,
        vertexes: [
          { id: 0, type: 0 },
          { id: 1, type: 0 },
          { id: 2, type: 1 },
          { id: 3, type: 1 },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
          { lhsId: 0, rhsId: 2 },
          { lhsId: 1, rhsId: 2 },
          { lhsId: 2, rhsId: 3 },
        ],
      },
      [2, 2, 0],
      [1, 2, 0, 1, 0, 0],
    ],
    [
      {
        typesCount: 3,
        vertexes: [
          { id: 0, type: 0 },
          { id: 1, type: 0 },
          { id: 2, type: 1 },
          { id: 3, type: 2 },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
          { lhsId: 0, rhsId: 2 },
          { lhsId: 1, rhsId: 2 },
          { lhsId: 2, rhsId: 3 },
        ],
      },
      [2, 1, 1],
      [1, 2, 0, 0, 1, 0], // TODO check
    ],
  ];
}
