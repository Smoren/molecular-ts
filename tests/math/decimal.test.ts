import { describe, expect, it } from '@jest/globals'
import { convertToDecimal, getNumberSetId } from "../../src/lib/math/helpers";

describe.each([
  ...dataProviderForConvertToDecimal(),
] as Array<[number[], number, number]>)(
  'Convert To Decimal Test',
  (digits: number[], base: number, expected: number) => {
    it('', () => {
      const result = convertToDecimal(digits, base);
      expect(result).toEqual(expected);
    });
  },
);

function dataProviderForConvertToDecimal(): Array<[number[], number, number]> {
  return [
    [[0], 2, 0],
    [[0], 3, 0],
    [[0], 8, 0],
    [[0], 10, 0],
    [[0], 16, 0],

    [[1], 2, 1],
    [[1], 3, 1],
    [[1], 8, 1],
    [[1], 10, 1],
    [[1], 16, 1],

    [[1, 0], 2, 1],
    [[1, 0], 3, 1],
    [[1, 0], 8, 1],
    [[1, 0], 10, 1],
    [[1, 0], 16, 1],

    [[1, 0, 0], 2, 1],
    [[1, 0, 0], 3, 1],
    [[1, 0, 0], 8, 1],
    [[1, 0, 0], 10, 1],
    [[1, 0, 0], 16, 1],

    [[0, 1], 2, 2],
    [[0, 1], 3, 3],
    [[0, 1], 8, 8],
    [[0, 1], 10, 10],
    [[0, 1], 16, 16],

    [[1, 1], 2, 3],
    [[1, 1], 3, 4],
    [[1, 1], 8, 9],
    [[1, 1], 10, 11],
    [[1, 1], 16, 17],

    [[2, 1], 3, 5],
    [[2, 1], 8, 10],
    [[2, 1], 10, 12],
    [[2, 1], 16, 18],

    [[1, 2], 3, 7],
    [[1, 2], 8, 17],
    [[1, 2], 10, 21],
    [[1, 2], 16, 33],

    [[1, 2, 0, 0], 3, 7],
    [[1, 2, 0, 0], 8, 17],
    [[1, 2, 0, 0], 10, 21],
    [[1, 2, 0, 0], 16, 33],

    [[1, 2, 0, 1, 0], 3, 3**3 + 7],
    [[1, 2, 0, 1, 0], 8, 8**3 + 17],
    [[1, 2, 0, 1, 0], 10, 10**3 + 21],
    [[1, 2, 0, 1, 0], 16, 16**3 + 33],

    [[5, 7, 1, 3, 9], 10, 93175],
    [[5, 7, 0, 3, 9], 10, 93075],
    [[0, 0, 0, 0, 9], 10, 90000],
  ];
}

describe.each([
  ...dataProviderForGetNumberSetId(),
] as Array<[number[], number, number]>)(
  'Get Number Set Id Test',
  (digits: number[], base: number, expected: number) => {
    it('', () => {
      const result = getNumberSetId(digits, base);
      expect(result).toEqual(expected);
    });
  },
);

function dataProviderForGetNumberSetId(): Array<[number[], number, number]> {
  return [
    [[0], 2, 0],
  ];
}
