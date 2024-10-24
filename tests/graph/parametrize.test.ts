import { describe, expect, it } from "@jest/globals";
import type { GraphInterface } from "../../src/lib/graph/types";
import type { NumericVector } from "../../src/lib/math/types";
import { createGraph } from "../../src/lib/graph/factories";
import {
  calcDistanceBetweenGraphsByEdgeTypes,
  calcDistanceBetweenGraphsByVertexTypes,
  countEdgesGroupedByVertexTypes,
  countVertexesGroupedByType,
} from "../../src/lib/graph/utils";

describe.each([
  ...dataProviderForCountVertexesAndEdges(),
] as Array<[GraphInterface, NumericVector, NumericVector]>)(
  'Count Vertexes And Edges Test',
  (graph: GraphInterface, expectedVertexesCounts: NumericVector, expectedEdgesCounts: NumericVector) => {
    it('', () => {
      const actualVertexesCounts = countVertexesGroupedByType(graph);
      expect(actualVertexesCounts).toEqual(expectedVertexesCounts);

      const actualEdgesCounts = countEdgesGroupedByVertexTypes(graph);
      expect(actualEdgesCounts).toEqual(expectedEdgesCounts);
    });
  },
);

function dataProviderForCountVertexesAndEdges(): Array<[GraphInterface, NumericVector, NumericVector]> {
  return [
    [
      createGraph({
        typesCount: 1,
        vertexes: [],
        edges: [],
      }),
      [0],
      [0],
    ],
    [
      createGraph({
        typesCount: 2,
        vertexes: [],
        edges: [],
      }),
      [0, 0],
      [0, 0, 0],
    ],
    [
      createGraph({
        typesCount: 2,
        vertexes: [
          { id: 0, type: 1, position: [0, 0] },
        ],
        edges: [],
      }),
      [0, 1],
      [0, 0, 0],
    ],
    [
      createGraph({
        typesCount: 2,
        vertexes: [
          { id: 0, type: 1, position: [0, 0] },
          { id: 1, type: 0, position: [0, 0] },
        ],
        edges: [],
      }),
      [1, 1],
      [0, 0, 0],
    ],
    [
      createGraph({
        typesCount: 2,
        vertexes: [
          { id: 0, type: 1, position: [0, 0] },
          { id: 1, type: 0, position: [0, 0] },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
        ],
      }),
      [1, 1],
      [0, 1, 0],
    ],
    [
      createGraph({
        typesCount: 2,
        vertexes: [
          { id: 0, type: 0, position: [0, 0] },
          { id: 1, type: 0, position: [0, 0] },
          { id: 2, type: 1, position: [0, 0] },
          { id: 3, type: 1, position: [0, 0] },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
          { lhsId: 0, rhsId: 2 },
          { lhsId: 1, rhsId: 2 },
          { lhsId: 2, rhsId: 3 },
        ],
      }),
      [2, 2],
      [1, 2, 1],
    ],
    [
      createGraph({
        typesCount: 3,
        vertexes: [
          { id: 0, type: 0, position: [0, 0] },
          { id: 1, type: 0, position: [0, 0] },
          { id: 2, type: 1, position: [0, 0] },
          { id: 3, type: 1, position: [0, 0] },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
          { lhsId: 0, rhsId: 2 },
          { lhsId: 1, rhsId: 2 },
          { lhsId: 2, rhsId: 3 },
        ],
      }),
      [2, 2, 0],
      [1, 2, 0, 1, 0, 0],
    ],
    [
      createGraph({
        typesCount: 3,
        vertexes: [
          { id: 0, type: 0, position: [0, 0] },
          { id: 1, type: 0, position: [0, 0] },
          { id: 2, type: 1, position: [0, 0] },
          { id: 3, type: 2, position: [0, 0] },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
          { lhsId: 0, rhsId: 2 },
          { lhsId: 1, rhsId: 2 },
          { lhsId: 2, rhsId: 3 },
        ],
      }),
      [2, 1, 1],
      [1, 2, 0, 0, 1, 0], // TODO check
    ],
  ];
}

describe.each([
  ...dataProviderForCalcDistanceBetweenGraphsByVertexTypes(),
] as Array<[GraphInterface, GraphInterface, number]>)(
  'Calc Distance Between Graphs By Vertex Types Test',
  (lhs: GraphInterface, rhs: GraphInterface, expected: number) => {
    it('', () => {
      const actual = calcDistanceBetweenGraphsByVertexTypes(lhs, rhs);
      expect(actual).toBeCloseTo(expected);
    });
  },
);

function dataProviderForCalcDistanceBetweenGraphsByVertexTypes(): Array<[GraphInterface, GraphInterface, number]> {
  return [
    [
      createGraph({
        typesCount: 1,
        vertexes: [],
        edges: [],
      }),
      createGraph({
        typesCount: 1,
        vertexes: [],
        edges: [],
      }),
      0,
    ],
    [
      createGraph({
        typesCount: 2,
        vertexes: [],
        edges: [],
      }),
      createGraph({
        typesCount: 2,
        vertexes: [
          { id: 0, type: 0, position: [0, 0] },
          { id: 1, type: 1, position: [0, 0] },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
        ],
      }),
      Math.sqrt(2),
    ],
    [
      createGraph({
        typesCount: 2,
        vertexes: [],
        edges: [],
      }),
      createGraph({
        typesCount: 2,
        vertexes: [
          { id: 0, type: 0, position: [0, 0] },
          { id: 1, type: 0, position: [0, 0] },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
        ],
      }),
      2,
    ],
    [
      createGraph({
        typesCount: 2,
        vertexes: [
          { id: 0, type: 0, position: [0, 0] },
          { id: 1, type: 0, position: [0, 0] },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
        ],
      }),
      createGraph({
        typesCount: 2,
        vertexes: [],
        edges: [],
      }),
      2,
    ],
    [
      createGraph({
        typesCount: 2,
        vertexes: [
          { id: 0, type: 0, position: [0, 0] },
          { id: 1, type: 0, position: [0, 0] },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
        ],
      }),
      createGraph({
        typesCount: 2,
        vertexes: [
          { id: 0, type: 0, position: [0, 0] },
          { id: 1, type: 0, position: [0, 0] },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
        ],
      }),
      0,
    ],
    [
      createGraph({
        typesCount: 2,
        vertexes: [
          { id: 0, type: 0, position: [0, 0] },
          { id: 1, type: 0, position: [0, 0] },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
        ],
      }),
      createGraph({
        typesCount: 2,
        vertexes: [
          { id: 0, type: 0, position: [0, 0] },
        ],
        edges: [],
      }),
      1,
    ],
    [
      createGraph({
        typesCount: 3,
        vertexes: [
          { id: 0, type: 0, position: [0, 0] },
          { id: 1, type: 0, position: [0, 0] },
          { id: 2, type: 1, position: [0, 0] },
          { id: 3, type: 2, position: [0, 0] },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
          { lhsId: 0, rhsId: 2 },
          { lhsId: 0, rhsId: 3 },
        ],
      }),
      createGraph({
        typesCount: 3,
        vertexes: [
          { id: 0, type: 0, position: [0, 0] },
          { id: 1, type: 1, position: [0, 0] },
          { id: 2, type: 1, position: [0, 0] },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
          { lhsId: 1, rhsId: 2 },
        ],
      }),
      Math.sqrt(3),
    ],
  ];
}

describe.each([
  ...dataProviderForCalcDistanceBetweenGraphsByEdgeTypes(),
] as Array<[GraphInterface, GraphInterface, number]>)(
  'Calc Distance Between Graphs By Edge Types Test',
  (lhs: GraphInterface, rhs: GraphInterface, expected: number) => {
    it('', () => {
      const actual = calcDistanceBetweenGraphsByEdgeTypes(lhs, rhs);
      expect(actual).toBeCloseTo(expected);
    });
  },
);

function dataProviderForCalcDistanceBetweenGraphsByEdgeTypes(): Array<[GraphInterface, GraphInterface, number]> {
  return [
    [
      createGraph({
        typesCount: 1,
        vertexes: [],
        edges: [],
      }),
      createGraph({
        typesCount: 1,
        vertexes: [],
        edges: [],
      }),
      0,
    ],
    [
      createGraph({
        typesCount: 2,
        vertexes: [],
        edges: [],
      }),
      createGraph({
        typesCount: 2,
        vertexes: [
          { id: 0, type: 0, position: [0, 0] },
          { id: 1, type: 1, position: [0, 0] },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
        ],
      }),
      1,
    ],
    [
      createGraph({
        typesCount: 2,
        vertexes: [],
        edges: [],
      }),
      createGraph({
        typesCount: 2,
        vertexes: [
          { id: 0, type: 0, position: [0, 0] },
          { id: 1, type: 0, position: [0, 0] },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
        ],
      }),
      1,
    ],
    [
      createGraph({
        typesCount: 2,
        vertexes: [
          { id: 0, type: 0, position: [0, 0] },
          { id: 1, type: 0, position: [0, 0] },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
        ],
      }),
      createGraph({
        typesCount: 2,
        vertexes: [],
        edges: [],
      }),
      1,
    ],
    [
      createGraph({
        typesCount: 2,
        vertexes: [
          { id: 0, type: 0, position: [0, 0] },
          { id: 1, type: 0, position: [0, 0] },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
        ],
      }),
      createGraph({
        typesCount: 2,
        vertexes: [
          { id: 0, type: 0, position: [0, 0] },
          { id: 1, type: 0, position: [0, 0] },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
        ],
      }),
      0,
    ],
    [
      createGraph({
        typesCount: 2,
        vertexes: [
          { id: 0, type: 0, position: [0, 0] },
          { id: 1, type: 0, position: [0, 0] },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
        ],
      }),
      createGraph({
        typesCount: 2,
        vertexes: [
          { id: 0, type: 0, position: [0, 0] },
        ],
        edges: [],
      }),
      1,
    ],
    [
      createGraph({
        typesCount: 2,
        vertexes: [
          { id: 0, type: 0, position: [0, 0] },
          { id: 1, type: 0, position: [0, 0] },
          { id: 2, type: 1, position: [0, 0] },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
          { lhsId: 0, rhsId: 2 },
        ],
      }),
      createGraph({
        typesCount: 2,
        vertexes: [
          { id: 0, type: 0, position: [0, 0] },
          { id: 1, type: 0, position: [0, 0] },
          { id: 2, type: 1, position: [0, 0] },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
          { lhsId: 0, rhsId: 2 },
        ],
      }),
      0,
    ],
    [
      createGraph({
        typesCount: 2,
        vertexes: [
          { id: 0, type: 0, position: [0, 0] },
          { id: 1, type: 0, position: [0, 0] },
          { id: 2, type: 1, position: [0, 0] },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
          { lhsId: 0, rhsId: 2 },
        ],
      }),
      createGraph({
        typesCount: 2,
        vertexes: [
          { id: 0, type: 0, position: [0, 0] },
          { id: 1, type: 0, position: [0, 0] },
          { id: 2, type: 1, position: [0, 0] },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
          { lhsId: 1, rhsId: 2 },
        ],
      }),
      0,
    ],
    [
      createGraph({
        typesCount: 2,
        vertexes: [
          { id: 0, type: 0, position: [0, 0] },
          { id: 1, type: 0, position: [0, 0] },
          { id: 2, type: 1, position: [0, 0] },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
          { lhsId: 0, rhsId: 2 },
        ],
      }),
      createGraph({
        typesCount: 3,
        vertexes: [
          { id: 0, type: 0, position: [0, 0] },
          { id: 1, type: 0, position: [0, 0] },
          { id: 2, type: 1, position: [0, 0] },
        ],
        edges: [
          { lhsId: 0, rhsId: 2 },
          { lhsId: 1, rhsId: 2 },
        ],
      }),
      Math.sqrt(2),
    ],
    [
      createGraph({
        typesCount: 2,
        vertexes: [
          { id: 0, type: 0, position: [0, 0] },
          { id: 1, type: 0, position: [0, 0] },
          { id: 2, type: 1, position: [0, 0] },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
          { lhsId: 0, rhsId: 2 },
        ],
      }),
      createGraph({
        typesCount: 2,
        vertexes: [
          { id: 0, type: 0, position: [0, 0] },
          { id: 1, type: 1, position: [0, 0] },
          { id: 2, type: 1, position: [0, 0] },
        ],
        edges: [
          { lhsId: 0, rhsId: 1 },
          { lhsId: 1, rhsId: 2 },
        ],
      }),
      Math.sqrt(2),
    ],
  ];
}
