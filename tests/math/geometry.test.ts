import { describe, expect, it } from "@jest/globals";
import type { NumericVector } from "../../src/lib/math/types";
import { distanceToLine } from "../../src/lib/math/geometry";

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
