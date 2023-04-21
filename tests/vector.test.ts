import { NumericVector } from '../src/vector/types';
import { toVector } from '../src/vector';

describe.each([
  ...dataProviderForAdd(),
] as Array<[NumericVector, NumericVector, NumericVector]>)(
  'Vector add test',
  (lhs: NumericVector, rhs: NumericVector, expected: NumericVector) => {
    it('', () => {
      const a = toVector(lhs).clone().add(rhs);
      expect(toVector(lhs).clone().add(rhs)).toEqual(expected);
      expect(toVector(rhs).clone().add(lhs)).toEqual(expected);
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
