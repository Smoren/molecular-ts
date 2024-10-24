import { describe, expect, it } from "@jest/globals";
import type { GraphConfig } from "../../src/lib/graph/types";
import type { NumericVector } from "../../src/lib/math/types";
import { Graph } from "../../src/lib/graph/models";
import { expectVectorToBeCloseTo } from "../helpers";
import { createVector } from "../../src/lib/math";
import { getGraphAverageRadius, getGraphCentroid } from "../../src/lib/graph/utils";

describe.each([
  ...dataProviderForGetCentroid(),
] as Array<[GraphConfig, NumericVector]>)(
  'Function getCentroid Test',
  (config: GraphConfig, expected: NumericVector) => {
    it('', () => {
      const graph = new Graph(config);
      const actual = getGraphCentroid(graph);
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
          { id: 1, position: [3, 4], type: 1 },
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
          { id: 1, position: [-1, 1], type: 1 },
          { id: 2, position: [1, -1], type: 1 },
          { id: 3, position: [1, 1], type: 0 },
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
          { id: 1, position: [0, 1], type: 1 },
          { id: 2, position: [1, 0], type: 1 },
          { id: 3, position: [1, 1], type: 0 },
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
      const centroid = getGraphCentroid(graph);
      const actual = getGraphAverageRadius(graph, centroid);
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
          { id: 1, position: [3, 4], type: 1 },
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
          { id: 1, position: [-1, 1], type: 1 },
          { id: 2, position: [1, -1], type: 1 },
          { id: 3, position: [1, 1], type: 0 },
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
          { id: 1, position: [0, 1], type: 1 },
          { id: 2, position: [1, 0], type: 1 },
          { id: 3, position: [1, 1], type: 0 },
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
          { id: 1, position: [-1, 1], type: 1 },
          { id: 2, position: [1, -1], type: 1 },
          { id: 3, position: [1, 1], type: 0 },
          { id: 4, position: [-2, -2], type: 0 },
          { id: 5, position: [-2, 2], type: 1 },
          { id: 6, position: [2, -2], type: 1 },
          { id: 7, position: [2, 2], type: 0 },
        ],
        edges: [],
      },
      (createVector([0, 0]).sub([1, 1]).abs + createVector([0, 0]).sub([2, 2]).abs)/2,
    ],
  ];
}
