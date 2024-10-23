import { describe, expect, it } from '@jest/globals';
import type { GraphConfig } from "../../src/lib/graph/types";
import type { NumericVector } from "../../src/lib/math/types";
import { Graph } from "../../src/lib/graph/models";
import { distanceToLine, getAverageRadius, getCentroid } from "../../src/lib/analysis/symmetry/utils";
import { expectVectorToBeCloseTo } from "../helpers";
import { createVector } from "../../src/lib/math";

describe.each([
  ...dataProviderForGetCentroid(),
] as Array<[GraphConfig, NumericVector]>)(
  'Function getCentroid Test',
  (config: GraphConfig, expected: NumericVector) => {
    it('', () => {
      const graph = new Graph(config);
      const actual = getCentroid(graph);
      expectVectorToBeCloseTo(actual, expected, 4);
    });
  },
);

function dataProviderForGetCentroid(): Array<[GraphConfig, NumericVector]> {
  return [
    [
      {
        typesCount: 1,
        vertexes: [],
        edges: [],
      },
      [0, 0],
    ],
    [
      {
        typesCount: 1,
        vertexes: [
          { id: 0, position: [0, 0], type: 0 },
        ],
        edges: [],
      },
      [0, 0],
    ],
    [
      {
        typesCount: 1,
        vertexes: [
          { id: 0, position: [1, 2], type: 0 },
        ],
        edges: [],
      },
      [1, 2],
    ],
    [
      {
        typesCount: 2,
        vertexes: [
          { id: 0, position: [1, 2], type: 0 },
          { id: 0, position: [3, 4], type: 1 },
        ],
        edges: [],
      },
      [2, 3],
    ],
    [
      {
        typesCount: 2,
        vertexes: [
          { id: 0, position: [-1, -1], type: 0 },
          { id: 0, position: [-1, 1], type: 1 },
          { id: 0, position: [1, -1], type: 1 },
          { id: 0, position: [1, 1], type: 0 },
        ],
        edges: [],
      },
      [0, 0],
    ],
    [
      {
        typesCount: 2,
        vertexes: [
          { id: 0, position: [0, 0], type: 0 },
          { id: 0, position: [0, 1], type: 1 },
          { id: 0, position: [1, 0], type: 1 },
          { id: 0, position: [1, 1], type: 0 },
        ],
        edges: [],
      },
      [0.5, 0.5],
    ],
  ];
}

describe.each([
  ...dataProviderForGetAverageRadius(),
] as Array<[GraphConfig, number]>)(
  'Function getAverageRadius Test',
  (config: GraphConfig, expected: number) => {
    it('', () => {
      const graph = new Graph(config);
      const centroid = getCentroid(graph);
      const actual = getAverageRadius(graph, centroid);
      expect(actual).toBeCloseTo(expected, 4);
    });
  },
);

function dataProviderForGetAverageRadius(): Array<[GraphConfig, number]> {
  return [
    [
      {
        typesCount: 1,
        vertexes: [],
        edges: [],
      },
      0,
    ],
    [
      {
        typesCount: 1,
        vertexes: [
          { id: 0, position: [0, 0], type: 0 },
        ],
        edges: [],
      },
      0,
    ],
    [
      {
        typesCount: 1,
        vertexes: [
          { id: 0, position: [1, 2], type: 0 },
        ],
        edges: [],
      },
      0,
    ],
    [
      {
        typesCount: 2,
        vertexes: [
          { id: 0, position: [1, 2], type: 0 },
          { id: 0, position: [3, 4], type: 1 },
        ],
        edges: [],
      },
      createVector([2, 3]).sub([1, 2]).abs,
    ],
    [
      {
        typesCount: 2,
        vertexes: [
          { id: 0, position: [-1, -1], type: 0 },
          { id: 0, position: [-1, 1], type: 1 },
          { id: 0, position: [1, -1], type: 1 },
          { id: 0, position: [1, 1], type: 0 },
        ],
        edges: [],
      },
      createVector([0, 0]).sub([1, 1]).abs,
    ],
    [
      {
        typesCount: 2,
        vertexes: [
          { id: 0, position: [0, 0], type: 0 },
          { id: 0, position: [0, 1], type: 1 },
          { id: 0, position: [1, 0], type: 1 },
          { id: 0, position: [1, 1], type: 0 },
        ],
        edges: [],
      },
      createVector([0.5, 0.5]).sub([1, 1]).abs,
    ],
    [
      {
        typesCount: 2,
        vertexes: [
          { id: 0, position: [-1, -1], type: 0 },
          { id: 0, position: [-1, 1], type: 1 },
          { id: 0, position: [1, -1], type: 1 },
          { id: 0, position: [1, 1], type: 0 },
          { id: 0, position: [-2, -2], type: 0 },
          { id: 0, position: [-2, 2], type: 1 },
          { id: 0, position: [2, -2], type: 1 },
          { id: 0, position: [2, 2], type: 0 },
        ],
        edges: [],
      },
      (createVector([0, 0]).sub([1, 1]).abs + createVector([0, 0]).sub([2, 2]).abs)/2,
    ],
  ];
}

describe.each([
  ...dataProviderForDistanceToLine(),
] as Array<[NumericVector, NumericVector, number]>)(
  'Function distanceToLine Test',
  (point: NumericVector, [k, b]: NumericVector, expected: number) => {
    it('', () => {
      const actual = distanceToLine(point, k, b);
      expect(actual).toBeCloseTo(expected, 4);
    });
  },
);

function dataProviderForDistanceToLine(): Array<[NumericVector, NumericVector, number]> {
  return [
    [
      [0, 0],
      [1, 0],
      0,
    ],
    [
      [1, 1],
      [1, 0],
      0,
    ],
    [
      [0, 0],
      [0, 1],
      1,
    ],
    [
      [5, 2],
      [2, 1],
      4.0249,
    ],
    [
      [5, -2],
      [-3, -7],
      6.3246,
    ],
  ];
}
