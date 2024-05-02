import type { NumericVector } from "../../src/lib/math/types";
import { createVector, toVector } from "../../src/lib/math";

import { describe, expect, it } from '@jest/globals'

describe.each([
  ...dataProviderForAbs(),
] as Array<[NumericVector, number]>)(
  'Vector abs test',
  (input: NumericVector, expected: number) => {
    it('', () => {
      expect(toVector(input).abs).toEqual(expected);
    });
  },
);

function dataProviderForAbs(): Array<unknown> {
  return [
    [[0], 0],
    [[0, 0], 0],
    [[0, 0, 0], 0],
    [[1], 1],
    [[4, 3], 5],
  ];
}

describe.each([
  ...dataProviderForAdd(),
] as Array<[NumericVector, NumericVector, NumericVector]>)(
  'Vector add test',
  (lhs: NumericVector, rhs: NumericVector, expected: NumericVector) => {
    it('', () => {
      expect(toVector(lhs).clone().add(rhs)).toEqual(expected);
      expect(toVector(rhs).clone().add(lhs)).toEqual(expected);
      expect(toVector(lhs).clone().add(lhs)).toEqual(toVector(lhs).clone().mul(2));
    });
  },
);

function dataProviderForAdd(): Array<unknown> {
  return [
    [[], [], []],
    [[0], [0], [0]],
    [[2], [2], [4]],
    [[0, 0], [0, 0], [0, 0]],
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    [[1, 2, 3], [1, 2, 3], [2, 4, 6]],
    [[1, 2, 3], [1, 2, 3], [2, 4, 6]],
    [[], [], toVector([])],
    [[0], [0], toVector([0])],
    [[2], [2], toVector([4])],
    [[0, 0], [0, 0], toVector([0, 0])],
    [[0, 0, 0], [0, 0, 0], toVector([0, 0, 0])],
    [[1, 2, 3], [1, 2, 3], toVector([2, 4, 6])],
    [[1, 2, 3], [1, 2, 3], toVector([2, 4, 6])],
  ];
}

describe.each([
  ...dataProviderForSub(),
] as Array<[NumericVector, NumericVector, NumericVector]>)(
  'Vector sub test',
  (lhs: NumericVector, rhs: NumericVector, expected: NumericVector) => {
    it('', () => {
      expect(toVector(lhs).clone().sub(rhs)).toEqual(expected);
    });
  },
);

function dataProviderForSub(): Array<unknown> {
  return [
    [[], [], []],
    [[0], [0], [0]],
    [[2], [2], [0]],
    [[0, 0], [0, 0], [0, 0]],
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    [[1, 2, 3], [1, 2, 3], [0, 0, 0]],
    [[1, 2, 3], [1, 1, 1], [0, 1, 2]],
  ];
}

describe.each([
  ...dataProviderForMul(),
] as Array<[NumericVector, number, NumericVector]>)(
  'Vector mul test',
  (input: NumericVector, multiplier: number, expected: NumericVector) => {
    it('', () => {
      expect(toVector(input).clone().mul(multiplier)).toEqual(expected);
    });
  },
);

function dataProviderForMul(): Array<unknown> {
  return [
    [[], 1, []],
    [[0], 1, [0]],
    [[2], 1, [2]],
    [[2], 2, [4]],
    [[0, 0], -3, [-0, -0]],
    [[1, 2, 3], 2, [2, 4, 6]],
    [[1, 2, 3], 3, [3, 6, 9]],
    [[1, 2, 3], -3, [-3, -6, -9]],
  ];
}

describe.each([
  ...dataProviderForDiv(),
] as Array<[NumericVector, number, NumericVector]>)(
  'Vector div test',
  (input: NumericVector, divider: number, expected: NumericVector) => {
    it('', () => {
      expect(toVector(input).clone().div(divider).isEqual(expected)).toBeTruthy();
    });
  },
);

function dataProviderForDiv(): Array<unknown> {
  return [
    [[], 1, []],
    [[0], 1, [0]],
    [[2], 1, [2]],
    [[2], 2, [1]],
    [[0, 0], -3, [0, 0]],
    [[2, 4, 6], 2, [1, 2, 3]],
    [[3, 6, 9], 3, [1, 2, 3]],
    [[-3, -6, -9], -3, [1, 2, 3]],
  ];
}

describe.each([
  ...dataProviderForInverse(),
] as Array<[NumericVector, NumericVector]>)(
  'Vector inverse test',
  (input: NumericVector, expected: NumericVector) => {
    it('', () => {
      expect(toVector(input).clone().inverse()).toEqual(expected);
    });
  },
);

function dataProviderForInverse(): Array<unknown> {
  return [
    [[], []],
    [[0], [-0]],
    [[1], [-1]],
    [[-1], [1]],
    [[2], [-2]],
    [[0, 0], [-0, -0]],
    [[0, 1], [-0, -1]],
    [[0, -1], [-0, 1]],
    [[2, -1], [-2, 1]],
    [[1, -2, 3], [-1, 2, -3]],
  ];
}

describe.each([
  ...dataProviderForMulScalar(),
] as Array<[NumericVector, NumericVector, number]>)(
  'Vector mul scalar test',
  (lhs: NumericVector, rhs: NumericVector, expected: number) => {
    it('', () => {
      expect(toVector(lhs).clone().mulScalar(rhs)).toBeCloseTo(expected);
      expect(toVector(rhs).clone().mulScalar(lhs)).toBeCloseTo(expected);
    });
  },
);

function dataProviderForMulScalar(): Array<unknown> {
  return [
    [[], [], 0],
    [[0], [0], 0],
    [[1], [2], 2],
    [[0, 1, 2], [3, 0, 0], 0],
    [[2, 3, 4], [5, 1, 7], 41],
  ];
}

describe.each([
  ...dataProviderForMulCoords(),
] as Array<[NumericVector, NumericVector, NumericVector]>)(
  'Vector mul coords test',
  (lhs: NumericVector, rhs: NumericVector, expected: NumericVector) => {
    it('', () => {
      expect(toVector(lhs).clone().mulCoords(rhs)).toEqual(expected);
      expect(toVector(rhs).clone().mulCoords(lhs)).toEqual(expected);
    });
  },
);

function dataProviderForMulCoords(): Array<unknown> {
  return [
    [[], [], []],
    [[0], [0], [0]],
    [[2], [2], [4]],
    [[0, 0], [0, 0], [0, 0]],
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    [[1, 2, 3], [1, 2, 3], [1, 4, 9]],
  ];
}

describe.each([
  ...dataProviderForDivCoords(),
] as Array<[NumericVector, NumericVector, NumericVector]>)(
  'Vector div coords test',
  (lhs: NumericVector, rhs: NumericVector, expected: NumericVector) => {
    it('', () => {
      expect(toVector(lhs).clone().divCoords(rhs).isEqual(expected)).toBeTruthy();
    });
  },
);

function dataProviderForDivCoords(): Array<unknown> {
  return [
    [[], [], []],
    [[0], [1], [0]],
    [[4], [2], [2]],
    [[0, 0], [1, 1], [0, 0]],
    [[9, 4, 1], [3, 2, 1], [3, 2, 1]],
  ];
}

describe.each([
  ...dataProviderForIsEqualTrue(),
] as Array<[NumericVector, NumericVector]>)(
  'Vector is equal test',
  (input: NumericVector, expected: NumericVector) => {
    it('', () => {
      expect(toVector(input).clone().isEqual(expected)).toBeTruthy();
    });
  },
);

function dataProviderForIsEqualTrue(): Array<unknown> {
  return [
    [[], []],
    [[0], [0]],
    [[0.1], [0.1]],
    [[0.1, 1, 2], [0.1, 1, 2]],
  ];
}

describe.each([
  ...dataProviderForIsEqualFalse(),
] as Array<[NumericVector, NumericVector]>)(
  'Vector is equal test',
  (input: NumericVector, expected: NumericVector) => {
    it('', () => {
      expect(toVector(input).clone().isEqual(expected)).toBeFalsy();
    });
  },
);

function dataProviderForIsEqualFalse(): Array<unknown> {
  return [
    [[0.000001], [0]],
    [[0.1], [0.2]],
    [[0.2, 1, 2], [0.1, 1, 2]],
    [[0.2, 1, 2], [0.2, 1, 2.00001]],
  ];
}

describe.each([
  ...dataProviderForIsNormalizedTrue(),
] as Array<[NumericVector]>)(
  'Vector is normalized true test',
  (input: NumericVector) => {
    it('', () => {
      expect(toVector(input).isNormalized()).toBeTruthy();
    });
  },
);

function dataProviderForIsNormalizedTrue(): Array<unknown> {
  return [
    [[1]],
    [createVector([0.1]).normalize()],
    [createVector([0.1, 1, 2]).normalize()],
  ];
}

describe.each([
  ...dataProviderForIsNormalizedFalse(),
] as Array<[NumericVector]>)(
  'Vector is normalized false test',
  (input: NumericVector) => {
    it('', () => {
      expect(toVector(input).isNormalized()).toBeFalsy();
    });
  },
);

function dataProviderForIsNormalizedFalse(): Array<unknown> {
  return [
    [[0]],
    [[0.1]],
    [[0.1, 2, 5]],
  ];
}
