import { describe, expect, it } from "@jest/globals";
import type { LineCoefficients, NumericVector } from "../../src/lib/math/types";
import { distanceToLine, getLineByPoints } from "../../src/lib/math/geometry";

describe.each([
  ...dataProviderForDistanceToLine(),
] as Array<[NumericVector, LineCoefficients, number]>)(
  'Function distanceToLine Test',
  (point: NumericVector, [k, b]: LineCoefficients, expected: number) => {
    it('', () => {
      const actual = distanceToLine(point, k, b);
      expect(actual).toBeCloseTo(expected, 4);
    });
  },
);

function dataProviderForDistanceToLine(): Array<[NumericVector, LineCoefficients, number]> {
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

describe.each([
  ...dataProviderForGetLineByPoints(),
] as Array<[NumericVector, NumericVector]>)(
  'Function getLineByPoints Test',
  (lhs: NumericVector, rhs: NumericVector) => {
    it('', () => {
      const [k, b] = getLineByPoints(lhs, rhs);
      expect(lhs[0]*k + b).toBeCloseTo(lhs[1], 4);
      expect(rhs[0]*k + b).toBeCloseTo(rhs[1], 4);
    });
  },
);

function dataProviderForGetLineByPoints(): Array<[NumericVector, NumericVector]> {
  return [
    [
      [0, 0],
      [1, 0],
    ],
    [
      [0, 0],
      [0.00000001, 1],
    ],
    [
      [-100, 5],
      [25.3, -11],
    ],
    [
      [1, 2],
      [3, 4],
    ],
    [
      [1, 2],
      [1.00000000001, 2],
    ],
  ];
}
