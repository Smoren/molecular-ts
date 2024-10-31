import { describe, expect, it } from "@jest/globals";
import type { GraphConfig } from "../../src/lib/graph/types";
import type { LineCoefficients } from "../../src/lib/math/types";
import { Graph } from "../../src/lib/graph/models";
import { scoreBilateralSymmetry, scoreSymmetryAxis } from "../../src/lib/analysis/symmetry";
import { expectVectorToBeCloseTo } from "../helpers";

describe.each([
  ...dataProviderForScoreBilateralSymmetry(),
] as Array<[GraphConfig, LineCoefficients, number]>)(
  'Function scoreBilateralSymmetry Test',
  (config, lineExpected, scoreExpected) => {
    it('', () => {
      const graph = new Graph(config);
      const [scoreActual, lineActual] = scoreBilateralSymmetry({
        graph,
        scoreAxisFunction: scoreSymmetryAxis,
      });
      expectVectorToBeCloseTo(lineActual, lineExpected, 4);
      expect(scoreActual).toBeCloseTo(scoreExpected, 4);
    });
  },
);

function dataProviderForScoreBilateralSymmetry(): Array<[GraphConfig, LineCoefficients, number]> {
  return [
    [
      {
        typesCount: 4,
        vertexes: [
          { id: 103, position: [0, 3], type: 0 },
          { id: 102, position: [-0, 2], type: 0 },
          { id: -11, position: [-1, 1], type: 1 },
          { id: 111, position: [1, 1], type: 1 },
          { id: 122, position: [2, 2], type: 2 },
          { id: -22, position: [-2, 2], type: 2 },
          { id: 120, position: [2, 0], type: 3 },
          { id: -20, position: [-2, 0], type: 3 },
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
      [-13750000000, 1.375],
      1,
    ],
    // [
    //   {
    //     typesCount: 4,
    //     vertexes: [
    //       { id: 103, position: [0, 3], type: 0 },
    //       { id: 102, position: [-0, 2], type: 0 },
    //       { id: -11, position: [-1, 1], type: 1 },
    //       { id: 111, position: [1, 1], type: 1 },
    //       { id: 122, position: [2, 2], type: 2 },
    //       { id: -22, position: [-2, 2], type: 2 },
    //       { id: 120, position: [2, 0], type: 3 },
    //     ],
    //     edges: [
    //       { lhsId: 103, rhsId: 102 },
    //       { lhsId: 102, rhsId: 111 },
    //       { lhsId: 102, rhsId: -11 },
    //       { lhsId: 111, rhsId: -11 },
    //       { lhsId: -11, rhsId: -22 },
    //       { lhsId: 111, rhsId: 122 },
    //       { lhsId: 111, rhsId: 120 },
    //     ],
    //   },
    //   [-8190077370.8092, 1.375],
    //   0,
    // ],
  ];
}
