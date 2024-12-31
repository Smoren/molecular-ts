import { describe, expect, it } from "@jest/globals";
import type { Edge, GraphConfig, Vertex } from "../../src/lib/graph/types";
import type { PolymerSummary } from "../../src/lib/analysis/polymers";
import { Graph } from "../../src/lib/graph/models";
import { gradeMonomerPolymerPair } from "../../src/lib/analysis/polymers";

describe.each([
  ...dataProviderForScoreBilateralSymmetry(),
] as Array<[() => [GraphConfig, GraphConfig], PolymerSummary]>)(
  'Polymer Detection Test',
  (configsGetter, expected) => {
    it('', () => {
      const [monomerConfig, polymerConfig] = configsGetter();
      const monomerGraph = new Graph(monomerConfig);
      const polymerGraph = new Graph(polymerConfig);

      const grade = gradeMonomerPolymerPair(monomerGraph, polymerGraph);
      expect(grade).toEqual(expected);
    });
  },
);

function createVertex(id: number, type: number): Vertex {
  return { id, type, position: [0, 0], speed: [0, 0] };
}

function copyVertex(vertex: Vertex, idOffset: number): Vertex {
  return {
    ...vertex,
    id: vertex.id + idOffset,
  };
}

function copyEdge(edge: Edge, idOffset: number): Edge {
  return {
    lhsId: edge.lhsId + idOffset,
    rhsId: edge.rhsId + idOffset,
  };
}

function dataProviderForScoreBilateralSymmetry(): Array<[() => [GraphConfig, GraphConfig], PolymerSummary]> {
  return [
    [
      () => {
        const typesCount = 2;

        const monomer1Vertexes = [
          createVertex(1, 0),
          createVertex(2, 1),
          createVertex(3, 0),
          createVertex(4, 1),
        ];
        const monomer1Edges = [
          { lhsId: 1, rhsId: 2 },
          { lhsId: 2, rhsId: 3 },
          { lhsId: 3, rhsId: 4 },
          { lhsId: 4, rhsId: 1 },
        ];

        const monomer2Vertexes = monomer1Vertexes.map((vertex) => copyVertex(vertex, 4));
        const monomer2Edges = monomer1Edges.map((edge) => copyEdge(edge, 4));

        const monomer3Vertexes = monomer2Vertexes.map((vertex) => copyVertex(vertex, 4));
        const monomer3Edges = monomer2Edges.map((edge) => copyEdge(edge, 4));

        const extraEdge12 = { lhsId: 3, rhsId: 5 };
        const extraEdge23 = copyEdge(extraEdge12, 4);

        const extraEdges = [
          extraEdge12,
          extraEdge23,
        ];

        return [
          {
            typesCount,
            vertexes: monomer1Vertexes,
            edges: monomer1Edges,
          },
          {
            typesCount,
            vertexes: [
              ...monomer1Vertexes,
              ...monomer2Vertexes,
              ...monomer3Vertexes,
            ],
            edges: [
              ...monomer1Edges,
              ...monomer2Edges,
              ...monomer3Edges,
              ...extraEdges,
            ],
          }
        ];
      },
      {
        confidenceScore: 1,
        monomerSize: 4,
        polymerSize: 3,
      },
    ],
  ];
}
