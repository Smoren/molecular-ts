import { describe, expect, it } from "@jest/globals";
import type { Edge, GraphConfig, Vertex } from "../../src/lib/graph/types";
import type { LineCoefficients, NumericVector } from "../../src/lib/math/types";
import { Graph } from "../../src/lib/graph/models";
import { hasBreaks, splitGraphByLine, splitVertexesByLine } from "../../src/lib/graph/utils";

describe.each([
  ...dataProviderForSplitVertexesByLine(),
] as Array<[GraphConfig, LineCoefficients, number, NumericVector[], NumericVector[], NumericVector[]]>)(
  'Function splitVertexesByLine Test',
  (config, line, minDistance, aboveExpected, belowExpected, middleExpected) => {
    it('', () => {
      const graph = new Graph(config);
      const [
        aboveVertexesActual,
        belowVertexesActual,
        middleVertexesActual,
      ] = splitVertexesByLine(graph.vertexes, line, minDistance);

      const aboveActual = aboveVertexesActual.map((v) => v.position);
      const belowActual = belowVertexesActual.map((v) => v.position);
      const middleActual = middleVertexesActual.map((v) => v.position);

      aboveActual.sort();
      belowActual.sort();
      middleActual.sort();
      aboveExpected.sort();
      belowExpected.sort();
      middleExpected.sort();

      expect(aboveActual).toEqual(aboveExpected);
      expect(belowActual).toEqual(belowExpected);
      expect(middleActual).toEqual(middleExpected);
    });
  },
);

function dataProviderForSplitVertexesByLine(): Array<[GraphConfig, LineCoefficients, number, NumericVector[], NumericVector[], NumericVector[]]> {
  return [
    [
      {
        typesCount: 1,
        vertexes: [
          { id: 1, position: [0, 0], speed: [0, 0], type: 0 },
          { id: 2, position: [1, 0], speed: [0, 0], type: 0 },
          { id: 3, position: [1, -1], speed: [0, 0], type: 0 },
          { id: 4, position: [0, 2], speed: [0, 0], type: 0 },
          { id: 5, position: [1, 2], speed: [0, 0], type: 0 },
          { id: 6, position: [1, 3], speed: [0, 0], type: 0 },
        ],
        edges: [],
      },
      [0, 1],
      0,
      [
        [0, 2],
        [1, 2],
        [1, 3],
      ],
      [
        [0, 0],
        [1, 0],
        [1, -1],
      ],
      [],
    ],
    [
      {
        typesCount: 1,
        vertexes: [
          { id: 1, position: [1, 0], speed: [0, 0], type: 0 },
          { id: 2, position: [2, 1], speed: [0, 0], type: 0 },
          { id: 3, position: [3, -1], speed: [0, 0], type: 0 },
          { id: 4, position: [0, 2], speed: [0, 0], type: 0 },
          { id: 5, position: [1, 3], speed: [0, 0], type: 0 },
          { id: 6, position: [2, 6], speed: [0, 0], type: 0 },
        ],
        edges: [],
      },
      [1, 1],
      0,
      [
        [0, 2],
        [1, 3],
        [2, 6],
      ],
      [
        [1, 0],
        [2, 1],
        [3, -1],
      ],
      [],
    ],
    [
      {
        typesCount: 1,
        vertexes: [
          { id: 1, position: [0, 0], speed: [0, 0], type: 0 },
          { id: 2, position: [1, -3], speed: [0, 0], type: 0 },
          { id: 3, position: [4, -10], speed: [0, 0], type: 0 },
          { id: 4, position: [3, 2], speed: [0, 0], type: 0 },
          { id: 5, position: [5, -3], speed: [0, 0], type: 0 },
          { id: 6, position: [8, 1], speed: [0, 0], type: 0 },
        ],
        edges: [],
      },
      [-2, 3],
      0,
      [
        [3, 2],
        [5, -3],
        [8, 1],
      ],
      [
        [0, 0],
        [1, -3],
        [4, -10],
      ],
      [],
    ],
    [
      {
        typesCount: 1,
        vertexes: [
          { id: 1, position: [1, 3], speed: [0, 0], type: 0 },
          { id: 2, position: [2, 6], speed: [0, 0], type: 0 },
          { id: 3, position: [5, 8], speed: [0, 0], type: 0 },
          { id: 4, position: [3, 1], speed: [0, 0], type: 0 },
          { id: 5, position: [4, 2], speed: [0, 0], type: 0 },
          { id: 6, position: [6, 3], speed: [0, 0], type: 0 },
          { id: 7, position: [4, 3], speed: [0, 0], type: 0 },
          { id: 8, position: [3, 4], speed: [0, 0], type: 0 },
        ],
        edges: [],
      },
      [1, 0],
      1,
      [
        [1, 3],
        [2, 6],
        [5, 8],
      ],
      [
        [3, 1],
        [4, 2],
        [6, 3],
      ],
      [
        [4, 3],
        [3, 4],
      ],
    ],
  ];
}

describe.each([
  ...dataProviderForSplitGraphByLine(),
] as Array<[GraphConfig, LineCoefficients, number, GraphConfig, GraphConfig, [boolean, boolean]]>)(
  'Function splitGraphByLine Test',
  (config, line, minDistance, aboveExpected, belowExpected, [lhsHasBreaks, rhsHasBreaks]) => {
    it('', () => {
      const graph = new Graph(config);
      const [
        aboveGraphActual,
        belowGraphActual,
      ] = splitGraphByLine(graph, line, minDistance);

      const vertexComparator = (lhs: Vertex, rhs: Vertex) => lhs.id - rhs.id;
      const edgeComparator = (lhs: Edge, rhs: Edge) => lhs.lhsId - rhs.lhsId || lhs.rhsId - rhs.rhsId;

      expect(lhsHasBreaks).toBe(hasBreaks(aboveGraphActual));
      expect(rhsHasBreaks).toBe(hasBreaks(belowGraphActual));

      aboveGraphActual.vertexes.sort(vertexComparator);
      belowGraphActual.vertexes.sort(vertexComparator);
      aboveExpected.vertexes.sort(vertexComparator);
      belowExpected.vertexes.sort(vertexComparator);

      aboveGraphActual.edges.sort(edgeComparator);
      belowGraphActual.edges.sort(edgeComparator);
      aboveExpected.edges.sort(edgeComparator);
      belowExpected.edges.sort(edgeComparator);

      expect(aboveGraphActual.config).toEqual(aboveExpected);
      expect(belowGraphActual.config).toEqual(belowExpected);
    });
  },
);

function dataProviderForSplitGraphByLine(): Array<[GraphConfig, LineCoefficients, number, GraphConfig, GraphConfig, [boolean, boolean]]> {
  return [
    [
      {
        typesCount: 2,
        vertexes: [],
        edges: [],
      },
      [10000, 0],
      0.5,
      {
        typesCount: 2,
        vertexes: [],
        edges: [],
      },
      {
        typesCount: 2,
        vertexes: [],
        edges: [],
      },
      [false, false],
    ],
    [
      {
        typesCount: 2,
        vertexes: [
          { id: 103, position: [0, 3], speed: [0, 0], type: 0 },
          { id: 102, position: [0, 2], speed: [0, 0], type: 0 },
          { id: -11, position: [-1, 1], speed: [0, 0], type: 0 },
          { id: 111, position: [1, 1], speed: [0, 0], type: 0 },
          { id: 122, position: [2, 2], speed: [0, 0], type: 1 },
          { id: -22, position: [-2, 2], speed: [0, 0], type: 1 },
          { id: 120, position: [2, 0], speed: [0, 0], type: 1 },
          { id: -20, position: [-2, 0], speed: [0, 0], type: 1 },
        ],
        edges: [
          { lhsId: 103, rhsId: 102 },
          { lhsId: 102, rhsId: 111 },
          { lhsId: 102, rhsId: -11 },
          { lhsId: 111, rhsId: -11 },
          { lhsId: -11, rhsId: -22 },
          { lhsId: -11, rhsId: -20 },
          { lhsId: 111, rhsId: 122 },
          { lhsId: 111, rhsId: 120 },
        ],
      },
      [0, -5],
      0.5,
      {
        typesCount: 2,
        vertexes: [
          { id: 103, position: [0, 3], speed: [0, 0], type: 0 },
          { id: 102, position: [0, 2], speed: [0, 0], type: 0 },
          { id: -11, position: [-1, 1], speed: [0, 0], type: 0 },
          { id: 111, position: [1, 1], speed: [0, 0], type: 0 },
          { id: 122, position: [2, 2], speed: [0, 0], type: 1 },
          { id: -22, position: [-2, 2], speed: [0, 0], type: 1 },
          { id: 120, position: [2, 0], speed: [0, 0], type: 1 },
          { id: -20, position: [-2, 0], speed: [0, 0], type: 1 },
        ],
        edges: [
          { lhsId: 103, rhsId: 102 },
          { lhsId: 102, rhsId: 111 },
          { lhsId: 102, rhsId: -11 },
          { lhsId: 111, rhsId: -11 },
          { lhsId: -11, rhsId: -22 },
          { lhsId: -11, rhsId: -20 },
          { lhsId: 111, rhsId: 122 },
          { lhsId: 111, rhsId: 120 },
        ],
      },
      {
        typesCount: 2,
        vertexes: [],
        edges: [],
      },
      [false, false],
    ],
    [
      {
        typesCount: 2,
        vertexes: [
          { id: 103, position: [0, 3], speed: [0, 0], type: 0 },
          { id: 102, position: [0, 2], speed: [0, 0], type: 0 },
          { id: -11, position: [-1, 1], speed: [0, 0], type: 0 },
          { id: 111, position: [1, 1], speed: [0, 0], type: 0 },
          { id: 122, position: [2, 2], speed: [0, 0], type: 1 },
          { id: -22, position: [-2, 2], speed: [0, 0], type: 1 },
          { id: 120, position: [2, 0], speed: [0, 0], type: 1 },
          { id: -20, position: [-2, 0], speed: [0, 0], type: 1 },
        ],
        edges: [
          { lhsId: 103, rhsId: 102 },
          { lhsId: 102, rhsId: 111 },
          { lhsId: 102, rhsId: -11 },
          { lhsId: 111, rhsId: -11 },
          { lhsId: -11, rhsId: -22 },
          { lhsId: -11, rhsId: -20 },
          { lhsId: 111, rhsId: 122 },
          { lhsId: 111, rhsId: 120 },
        ],
      },
      [0, 5],
      0.5,
      {
        typesCount: 2,
        vertexes: [],
        edges: [],
      },
      {
        typesCount: 2,
        vertexes: [
          { id: 103, position: [0, 3], speed: [0, 0], type: 0 },
          { id: 102, position: [0, 2], speed: [0, 0], type: 0 },
          { id: -11, position: [-1, 1], speed: [0, 0], type: 0 },
          { id: 111, position: [1, 1], speed: [0, 0], type: 0 },
          { id: 122, position: [2, 2], speed: [0, 0], type: 1 },
          { id: -22, position: [-2, 2], speed: [0, 0], type: 1 },
          { id: 120, position: [2, 0], speed: [0, 0], type: 1 },
          { id: -20, position: [-2, 0], speed: [0, 0], type: 1 },
        ],
        edges: [
          { lhsId: 103, rhsId: 102 },
          { lhsId: 102, rhsId: 111 },
          { lhsId: 102, rhsId: -11 },
          { lhsId: 111, rhsId: -11 },
          { lhsId: -11, rhsId: -22 },
          { lhsId: -11, rhsId: -20 },
          { lhsId: 111, rhsId: 122 },
          { lhsId: 111, rhsId: 120 },
        ],
      },
      [false, false],
    ],
    [
      {
        typesCount: 2,
        vertexes: [
          { id: 103, position: [0, 3], speed: [0, 0], type: 0 },
          { id: 102, position: [0, 2], speed: [0, 0], type: 0 },
          { id: -11, position: [-1, 1], speed: [0, 0], type: 0 },
          { id: 111, position: [1, 1], speed: [0, 0], type: 0 },
          { id: 122, position: [2, 2], speed: [0, 0], type: 1 },
          { id: -22, position: [-2, 2], speed: [0, 0], type: 1 },
          { id: 120, position: [2, 0], speed: [0, 0], type: 1 },
          { id: -20, position: [-2, 0], speed: [0, 0], type: 1 },
        ],
        edges: [
          { lhsId: 103, rhsId: 102 },
          { lhsId: 102, rhsId: 111 },
          { lhsId: 102, rhsId: -11 },
          { lhsId: 111, rhsId: -11 },
          { lhsId: -11, rhsId: -22 },
          { lhsId: -11, rhsId: -20 },
          { lhsId: 111, rhsId: 122 },
          { lhsId: 111, rhsId: 120 },
        ],
      },
      [0, 2],
      0.5,
      {
        typesCount: 2,
        vertexes: [
          { id: 103, position: [0, 3], speed: [0, 0], type: 0 },
          { id: 102, position: [0, 2], speed: [0, 0], type: 0 },
          { id: 122, position: [2, 2], speed: [0, 0], type: 1 },
          { id: -22, position: [-2, 2], speed: [0, 0], type: 1 },
        ],
        edges: [
          { lhsId: 103, rhsId: 102 },
        ],
      },
      {
        typesCount: 2,
        vertexes: [
          { id: 102, position: [0, 2], speed: [0, 0], type: 0 },
          { id: -11, position: [-1, 1], speed: [0, 0], type: 0 },
          { id: 111, position: [1, 1], speed: [0, 0], type: 0 },
          { id: 122, position: [2, 2], speed: [0, 0], type: 1 },
          { id: -22, position: [-2, 2], speed: [0, 0], type: 1 },
          { id: 120, position: [2, 0], speed: [0, 0], type: 1 },
          { id: -20, position: [-2, 0], speed: [0, 0], type: 1 },
        ],
        edges: [
          { lhsId: 102, rhsId: 111 },
          { lhsId: 102, rhsId: -11 },
          { lhsId: 111, rhsId: -11 },
          { lhsId: -11, rhsId: -22 },
          { lhsId: -11, rhsId: -20 },
          { lhsId: 111, rhsId: 122 },
          { lhsId: 111, rhsId: 120 },
        ],
      },
      [true, false],
    ],
    [
      {
        typesCount: 2,
        vertexes: [
          { id: 103, position: [0, 3], speed: [0, 0], type: 0 },
          { id: 102, position: [0, 2], speed: [0, 0], type: 0 },
          { id: -11, position: [-1, 1], speed: [0, 0], type: 0 },
          { id: 111, position: [1, 1], speed: [0, 0], type: 0 },
          { id: 122, position: [2, 2], speed: [0, 0], type: 1 },
          { id: -22, position: [-2, 2], speed: [0, 0], type: 1 },
          { id: 120, position: [2, 0], speed: [0, 0], type: 1 },
          { id: -20, position: [-2, 0], speed: [0, 0], type: 1 },
        ],
        edges: [
          { lhsId: 103, rhsId: 102 },
          { lhsId: 102, rhsId: 111 },
          { lhsId: 102, rhsId: -11 },
          { lhsId: 111, rhsId: -11 },
          { lhsId: -11, rhsId: -22 },
          { lhsId: -11, rhsId: -20 },
          { lhsId: 111, rhsId: 122 },
          { lhsId: 111, rhsId: 120 },
        ],
      },
      [10000, 0],
      0.5,
      {
        typesCount: 2,
        vertexes: [
          { id: 103, position: [0, 3], speed: [0, 0], type: 0 },
          { id: 102, position: [0, 2], speed: [0, 0], type: 0 },
          { id: -11, position: [-1, 1], speed: [0, 0], type: 0 },
          { id: -22, position: [-2, 2], speed: [0, 0], type: 1 },
          { id: -20, position: [-2, 0], speed: [0, 0], type: 1 },
        ],
        edges: [
          { lhsId: 103, rhsId: 102 },
          { lhsId: 102, rhsId: -11 },
          { lhsId: -11, rhsId: -22 },
          { lhsId: -11, rhsId: -20 },
        ],
      },
      {
        typesCount: 2,
        vertexes: [
          { id: 103, position: [0, 3], speed: [0, 0], type: 0 },
          { id: 102, position: [0, 2], speed: [0, 0], type: 0 },
          { id: 111, position: [1, 1], speed: [0, 0], type: 0 },
          { id: 122, position: [2, 2], speed: [0, 0], type: 1 },
          { id: 120, position: [2, 0], speed: [0, 0], type: 1 },
        ],
        edges: [
          { lhsId: 103, rhsId: 102 },
          { lhsId: 102, rhsId: 111 },
          { lhsId: 111, rhsId: 122 },
          { lhsId: 111, rhsId: 120 },
        ],
      },
      [false, false],
    ],
    [
      {
        typesCount: 2,
        vertexes: [
          { id: 100, position: [0, 0], speed: [0, 0], type: 0 },
          { id: 101, position: [0, 1], speed: [0, 0], type: 0 },
          { id: 110, position: [1, 0], speed: [0, 0], type: 1 },
          { id: 111, position: [1, 1], speed: [0, 0], type: 1 },
        ],
        edges: [
          { lhsId: 100, rhsId: 101 },
          { lhsId: 100, rhsId: 110 },
          { lhsId: 101, rhsId: 111 },
          { lhsId: 110, rhsId: 111 },
        ],
      },
      [1, 0.1],
      0.2,
      {
        typesCount: 2,
        vertexes: [
          { id: 100, position: [0, 0], speed: [0, 0], type: 0 },
          { id: 101, position: [0, 1], speed: [0, 0], type: 0 },
          { id: 111, position: [1, 1], speed: [0, 0], type: 1 },
        ],
        edges: [
          { lhsId: 100, rhsId: 101 },
          { lhsId: 101, rhsId: 111 },
        ],
      },
      {
        typesCount: 2,
        vertexes: [
          { id: 100, position: [0, 0], speed: [0, 0], type: 0 },
          { id: 110, position: [1, 0], speed: [0, 0], type: 1 },
          { id: 111, position: [1, 1], speed: [0, 0], type: 1 },
        ],
        edges: [
          { lhsId: 100, rhsId: 110 },
          { lhsId: 110, rhsId: 111 },
        ],
      },
      [false, false],
    ],
  ];
}
