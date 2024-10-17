import { describe, expect, it } from '@jest/globals'
import { getPairsCount, getPairIndex } from "../../src/lib/math/helpers";

describe.each([
  ...dataProviderForGetPairIndex(),
] as Array<[[number, number], number, number]>)(
  'Get Pair Index Test',
  (pair: [number, number], base: number, expected: number) => {
    it('', () => {
      const result = getPairIndex(pair, base);
      expect(result).toEqual(expected);
    });
  },
);

function dataProviderForGetPairIndex(): Array<[[number, number], number, number]> {
  return [
    [[0, 0], 2, 0],
    [[0, 1], 2, 1],
    [[1, 0], 2, 1],
    [[1, 1], 2, 2],

    [[0, 0], 3, 0],
    [[0, 1], 3, 1],
    [[1, 0], 3, 1],
    [[0, 2], 3, 2],
    [[2, 0], 3, 2],
    [[1, 1], 3, 3],
    [[1, 2], 3, 4],
    [[2, 1], 3, 4],
    [[2, 2], 3, 5],

    [[0, 0], 4, 0],
    [[0, 1], 4, 1],
    [[1, 0], 4, 1],
    [[0, 2], 4, 2],
    [[2, 0], 4, 2],
    [[0, 3], 4, 3],
    [[3, 0], 4, 3],
    [[1, 1], 4, 4],
    [[1, 2], 4, 5],
    [[2, 1], 4, 5],
    [[1, 3], 4, 6],
    [[3, 1], 4, 6],
    [[2, 2], 4, 7],
    [[2, 3], 4, 8],
    [[3, 2], 4, 8],
    [[3, 3], 4, 9],
  ];
}

describe.each([
  ...dataProviderForGetPairsCount(),
] as Array<[number, number]>)(
  'Get Pairs Count Test',
  (base: number, expected: number) => {
    it('', () => {
      const result = getPairsCount(base);
      expect(result).toEqual(expected);
    });
  },
);

function dataProviderForGetPairsCount(): Array<[number, number]> {
  return [
    [2, 3],
    [3, 6],
    [4, 10],
  ];
}
