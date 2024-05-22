import { describe, expect, it } from '@jest/globals'
import type { Tensor } from "../../src/lib/math/types";
import {
  crossArrays,
  crossMatrices,
  crossTensors,
  tensorBinaryOperation,
  tensorUnaryOperation,
} from '../../src/lib/math/operations';

describe.each([
  ...dataProviderForTensorUnaryOperation(),
] as Array<[Tensor<number>, (x: number) => number, Tensor<number>]>)(
  'Tensor Unary Operation Test',
  (tensor, operation, expected) => {
    it('', () => {
      const result = tensorUnaryOperation(tensor, operation);
      expect(result).toEqual(expected);
    });
  },
);

function dataProviderForTensorUnaryOperation(): Array<[Tensor<number>, (x: number) => number, Tensor<number>]> {
  return [
    [
      [],
      (x: number) => x*2,
      [],
    ],
    [
      [1],
      (x: number) => x*2,
      [2],
    ],
    [
      [1, 2, 3],
      (x: number) => x*2,
      [2, 4, 6],
    ],
    [
      [
        [1, 2, 3],
        [4, 5, 6],
      ],
      (x: number) => x*2,
      [
        [2, 4, 6],
        [8, 10, 12],
      ],
    ],
    [
      [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
      (x: number) => x*2,
      [
        [2, 4, 6],
        [8, 10, 12],
        [14, 16, 18],
      ],
    ],
    [
      [
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ],
      ],
      (x: number) => x*2,
      [
        [
          [2, 4, 6],
          [8, 10, 12],
          [14, 16, 18],
        ],
      ],
    ],
    [
      [
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ],
        [
          [10, 20, 30],
          [40, 50, 60],
          [70, 80, 90],
        ],
      ],
      (x: number) => x*2,
      [
        [
          [2, 4, 6],
          [8, 10, 12],
          [14, 16, 18],
        ],
        [
          [20, 40, 60],
          [80, 100, 120],
          [140, 160, 180],
        ],
      ],
    ],
    [
      [
        [
          [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
          ],
          [
            [10, 20, 30],
            [40, 50, 60],
            [70, 80, 90],
          ],
        ],
      ],
      (x: number) => x*2,
      [
        [
          [
            [2, 4, 6],
            [8, 10, 12],
            [14, 16, 18],
          ],
          [
            [20, 40, 60],
            [80, 100, 120],
            [140, 160, 180],
          ],
        ],
      ],
    ],
  ];
}

describe.each([
  ...dataProviderForTensorBinaryOperation(),
] as Array<[Tensor<number>, Tensor<number>, (lhs: number, rhs: number) => number, Tensor<number>]>)(
  'Tensor Binary Operation Test',
  (lhs, rhs, operation, expected) => {
    it('', () => {
      const result = tensorBinaryOperation(lhs, rhs, operation);
      expect(result).toEqual(expected);
    });
  },
);

function dataProviderForTensorBinaryOperation(): Array<[Tensor<number>, Tensor<number>, (lhs: number, rhs: number) => number, Tensor<number>]> {
  return [
    [
      [],
      [],
      (lhs: number, rhs: number) => lhs + rhs,
      [],
    ],
    [
      [1],
      [2],
      (lhs: number, rhs: number) => lhs + rhs,
      [3],
    ],
    [
      [1, 2, 3],
      [10, 20, 30],
      (lhs: number, rhs: number) => lhs + rhs,
      [11, 22, 33],
    ],
    [
      [
        [1, 2, 3],
        [4, 5, 6],
      ],
      [
        [10, 20, 30],
        [40, 50, 60],
      ],
      (lhs: number, rhs: number) => lhs + rhs,
      [
        [11, 22, 33],
        [44, 55, 66],
      ],
    ],
    [
      [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
      [
        [10, 20, 30],
        [40, 50, 60],
        [70, 80, 90],
      ],
      (lhs: number, rhs: number) => lhs + rhs,
      [
        [11, 22, 33],
        [44, 55, 66],
        [77, 88, 99],
      ],
    ],
    [
      [
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ],
      ],
      [
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ],
      ],
      (lhs: number, rhs: number) => lhs + rhs,
      [
        [
          [2, 4, 6],
          [8, 10, 12],
          [14, 16, 18],
        ],
      ],
    ],
    [
      [
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ],
        [
          [10, 20, 30],
          [40, 50, 60],
          [70, 80, 90],
        ],
      ],
      [
        [
          [10, 20, 30],
          [40, 50, 60],
          [70, 80, 90],
        ],
        [
          [100, 200, 300],
          [400, 500, 600],
          [700, 800, 900],
        ],
      ],
      (lhs: number, rhs: number) => lhs + rhs,
      [
        [
          [11, 22, 33],
          [44, 55, 66],
          [77, 88, 99],
        ],
        [
          [110, 220, 330],
          [440, 550, 660],
          [770, 880, 990],
        ],
      ],
    ],
    [
      [
        [
          [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
          ],
          [
            [10, 20, 30],
            [40, 50, 60],
            [70, 80, 90],
          ],
        ],
      ],
      [
        [
          [
            [10, 20, 30],
            [40, 50, 60],
            [70, 80, 90],
          ],
          [
            [100, 200, 300],
            [400, 500, 600],
            [700, 800, 900],
          ],
        ],
      ],
      (lhs: number, rhs: number) => lhs + rhs,
      [
        [
          [
            [11, 22, 33],
            [44, 55, 66],
            [77, 88, 99],
          ],
          [
            [110, 220, 330],
            [440, 550, 660],
            [770, 880, 990],
          ],
        ],
      ],
    ],
  ];
}

describe.each([
  ...dataProviderForCrossArrays(),
] as Array<[number[], number[], number, number[]]>)(
  'Cross Arrays Test',
  (lhs, rhs, separator, expected) => {
    it('', () => {
      const result = crossArrays(lhs, rhs, separator);
      expect(result).toEqual(expected);
    });
  },
);

function dataProviderForCrossArrays(): Array<[number[], number[], number, number[]]> {
  return [
    [
      [],
      [],
      0,
      [],
    ],
    [
      [1, 2, 3],
      [11, 22, 33],
      0,
      [11, 22, 33],
    ],
    [
      [1, 2, 3],
      [11, 22, 33],
      1,
      [1, 22, 33],
    ],
    [
      [1, 2, 3],
      [11, 22, 33],
      2,
      [1, 2, 33],
    ],
    [
      [1, 2, 3],
      [11, 22, 33],
      3,
      [1, 2, 3],
    ],
  ];
}

describe.each([
  ...dataProviderForCrossMatrices(),
] as Array<[number[][], number[][], number, number[][]]>)(
  'Cross Matrices Test',
  (lhs, rhs, separator, expected) => {
    it('', () => {
      const result = crossMatrices(lhs, rhs, separator);
      expect(result).toEqual(expected);
    });
  },
);

function dataProviderForCrossMatrices(): Array<[number[][], number[][], number, number[][]]> {
  return [
    [
      [],
      [],
      0,
      [],
    ],
    [
      [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ],
      [
        [2, 2, 2],
        [2, 2, 2],
        [2, 2, 2],
      ],
      0,
      [
        [2, 2, 2],
        [2, 2, 2],
        [2, 2, 2],
      ],
    ],
    [
      [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ],
      [
        [2, 2, 2],
        [2, 2, 2],
        [2, 2, 2],
      ],
      1,
      [
        [1, 0, 0],
        [0, 2, 2],
        [0, 2, 2],
      ],
    ],
    [
      [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ],
      [
        [2, 2, 2],
        [2, 2, 2],
        [2, 2, 2],
      ],
      2,
      [
        [1, 1, 0],
        [1, 1, 0],
        [0, 0, 2],
      ],
    ],
    [
      [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ],
      [
        [2, 2, 2],
        [2, 2, 2],
        [2, 2, 2],
      ],
      3,
      [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ],
    ],
  ];
}


describe.each([
  ...dataProviderForCrossTensors(),
] as Array<[number[][][], number[][][], number, number[][][]]>)(
  'Cross Tensors Test',
  (lhs, rhs, separator, expected) => {
    it('', () => {
      const result = crossTensors(lhs, rhs, separator);
      expect(result).toEqual(expected);
    });
  },
);

function dataProviderForCrossTensors(): Array<[number[][][], number[][][], number, number[][][]]> {
  return [
    [
      [],
      [],
      0,
      [],
    ],
    [
      [
        [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
        ],
        [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
        ],
        [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
        ],
      ],
      [
        [
          [2, 2, 2],
          [2, 2, 2],
          [2, 2, 2],
        ],
        [
          [2, 2, 2],
          [2, 2, 2],
          [2, 2, 2],
        ],
        [
          [2, 2, 2],
          [2, 2, 2],
          [2, 2, 2],
        ],
      ],
      0,
      [
        [
          [2, 2, 2],
          [2, 2, 2],
          [2, 2, 2],
        ],
        [
          [2, 2, 2],
          [2, 2, 2],
          [2, 2, 2],
        ],
        [
          [2, 2, 2],
          [2, 2, 2],
          [2, 2, 2],
        ],
      ],
    ],
    [
      [
        [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
        ],
        [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
        ],
        [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
        ],
      ],
      [
        [
          [2, 2, 2],
          [2, 2, 2],
          [2, 2, 2],
        ],
        [
          [2, 2, 2],
          [2, 2, 2],
          [2, 2, 2],
        ],
        [
          [2, 2, 2],
          [2, 2, 2],
          [2, 2, 2],
        ],
      ],
      1,
      [
        [
          [1, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
        [
          [0, 0, 0],
          [0, 2, 2],
          [0, 2, 2],
        ],
        [
          [0, 0, 0],
          [0, 2, 2],
          [0, 2, 2],
        ],
      ],
    ],
    [
      [
        [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
        ],
        [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
        ],
        [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
        ],
      ],
      [
        [
          [2, 2, 2],
          [2, 2, 2],
          [2, 2, 2],
        ],
        [
          [2, 2, 2],
          [2, 2, 2],
          [2, 2, 2],
        ],
        [
          [2, 2, 2],
          [2, 2, 2],
          [2, 2, 2],
        ],
      ],
      2,
      [
        [
          [1, 1, 0],
          [1, 1, 0],
          [0, 0, 0],
        ],
        [
          [1, 1, 0],
          [1, 1, 0],
          [0, 0, 0],
        ],
        [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 2],
        ],
      ],
    ],
    [
      [
        [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
        ],
        [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
        ],
        [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
        ],
      ],
      [
        [
          [2, 2, 2],
          [2, 2, 2],
          [2, 2, 2],
        ],
        [
          [2, 2, 2],
          [2, 2, 2],
          [2, 2, 2],
        ],
        [
          [2, 2, 2],
          [2, 2, 2],
          [2, 2, 2],
        ],
      ],
      3,
      [
        [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
        ],
        [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
        ],
        [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
        ],
      ],
    ],
  ];
}
