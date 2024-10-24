import { describe, expect, it } from "@jest/globals";
import type { GraphConfig } from "../../src/lib/graph/types";
import type { NumericVector } from "../../src/lib/math/types";
import { Graph } from "../../src/lib/graph/models";
import { splitGraphByLine, splitVertexesByLine } from "../../src/lib/graph/utils";

describe.each([
  ...dataProviderForSplitVertexesByLine(),
] as Array<[GraphConfig, NumericVector, number, NumericVector[], NumericVector[], NumericVector[]]>)(
  'Function splitVertexesByLine Test',
  (config, [k, b], minDistance, aboveExpected, belowExpected, middleExpected) => {
    it('', () => {
      const graph = new Graph(config);
      const [
        aboveVertexesActual,
        belowVertexesActual,
        middleVertexesActual,
      ] = splitVertexesByLine(graph.vertexes, k, b, minDistance);

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

function dataProviderForSplitVertexesByLine(): Array<[GraphConfig, NumericVector, number, NumericVector[], NumericVector[], NumericVector[]]> {
  return [
    [
      {
        typesCount: 1,
        vertexes: [
          { id: 1, position: [0, 0], type: 0 },
          { id: 2, position: [1, 0], type: 0 },
          { id: 3, position: [1, -1], type: 0 },
          { id: 4, position: [0, 2], type: 0 },
          { id: 5, position: [1, 2], type: 0 },
          { id: 6, position: [1, 3], type: 0 },
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
          { id: 1, position: [1, 0], type: 0 },
          { id: 2, position: [2, 1], type: 0 },
          { id: 3, position: [3, -1], type: 0 },
          { id: 4, position: [0, 2], type: 0 },
          { id: 5, position: [1, 3], type: 0 },
          { id: 6, position: [2, 6], type: 0 },
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
          { id: 1, position: [0, 0], type: 0 },
          { id: 2, position: [1, -3], type: 0 },
          { id: 3, position: [4, -10], type: 0 },
          { id: 4, position: [3, 2], type: 0 },
          { id: 5, position: [5, -3], type: 0 },
          { id: 6, position: [8, 1], type: 0 },
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
          { id: 1, position: [1, 3], type: 0 },
          { id: 2, position: [2, 6], type: 0 },
          { id: 3, position: [5, 8], type: 0 },
          { id: 4, position: [3, 1], type: 0 },
          { id: 5, position: [4, 2], type: 0 },
          { id: 6, position: [6, 3], type: 0 },
          { id: 7, position: [4, 3], type: 0 },
          { id: 8, position: [3, 4], type: 0 },
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
] as Array<[GraphConfig, NumericVector, number, GraphConfig, GraphConfig]>)(
  'Function splitGraphByLine Test',
  (config, [k, b], minDistance, aboveExpected, belowExpected) => {
    it('', () => {
      const graph = new Graph(config);
      const [
        aboveGraphActual,
        belowGraphActual,
      ] = splitGraphByLine(graph, k, b, minDistance);

      expect(aboveGraphActual.config).toEqual(aboveExpected);
      expect(belowGraphActual.config).toEqual(belowExpected);
    });
  },
);

function dataProviderForSplitGraphByLine(): Array<[GraphConfig, NumericVector, number, GraphConfig, GraphConfig]> {
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
    ],
    // [
    //   {
    //     typesCount: 2,
    //     vertexes: [
    //
    //     ],
    //     edges: [],
    //   },
    //   [10000, 0],
    //   0.5,
    //   {
    //     typesCount: 2,
    //     vertexes: [],
    //     edges: [],
    //   },
    //   {
    //     typesCount: 2,
    //     vertexes: [],
    //     edges: [],
    //   },
    // ],
  ];
}
