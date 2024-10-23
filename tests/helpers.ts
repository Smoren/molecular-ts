import { expect } from '@jest/globals';
import type { NumericVector } from "../src/lib/math/types";
import { round } from "../src/lib/math";

export function expectVectorToBeCloseTo(actual: NumericVector, expected: NumericVector, precision: number) {
  actual = actual.map((x) => round(x, precision));
  expected = expected.map((x) => round(x, precision));
  expect(actual).toEqual(expected);
}
