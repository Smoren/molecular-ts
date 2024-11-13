import { describe, expect, it } from '@jest/globals'
import type { Tensor } from "../../src/lib/math/types";
import type { TypesConfig } from "../../src/lib/config/types";
import type { ArgumentName, OperationInterface } from "../../src/lib/operations/types";
import { OperationType } from "../../src/lib/operations/types";
import { Operation, OperationPipe } from "../../src/lib/operations/operation";
import { createTransparentTypesConfig } from "../../src/lib/config/atom-types";

describe.each([
  ...dataProviderForOperationsPipe(),
] as Array<[TypesConfig, ArgumentName, OperationInterface[], Tensor<number>]>)(
  'Operations Pipe Test',
  (typesConfig, inputArgumentName, operations, expected) => {
    it('', () => {
      const pipe = new OperationPipe({ inputArgument: inputArgumentName }, typesConfig);

      for (const operation of operations) {
        pipe.push(operation);
      }

      const actual = pipe.run();
      expect(actual).toEqual(expected);
    });
  },
);

function dataProviderForOperationsPipe(): Array<[TypesConfig, ArgumentName, OperationInterface[], Tensor<number>]> {
  return [
    [
      {
        ...createTransparentTypesConfig(3),
        RADIUS: [1, 2, 3],
      },
      'RADIUS',
      [
        new Operation({
          type: OperationType.UNARY,
          factoryName: 'ADD',
        }).setFactoryArgValues([1]),
      ],
      [2, 3, 4],
    ],
    [
      {
        ...createTransparentTypesConfig(4),
        RADIUS: [1, 2, 3, 4],
      },
      'RADIUS',
      [
        new Operation({
          type: OperationType.UNARY,
          factoryName: 'MUL',
        }).setFactoryArgValues([2]),
        new Operation({
          type: OperationType.UNARY,
          factoryName: 'MINMAX',
        }).setFactoryArgValues([4, 6]),
      ],
      [4, 4, 6, 6],
    ],
    [
      {
        ...createTransparentTypesConfig(3),
        GRAVITY: [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ],
      },
      'GRAVITY',
      [
        new Operation({
          type: OperationType.UNARY,
          factoryName: 'SUB',
        }).setFactoryArgValues([1]),
      ],
      [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
      ],
    ],
    [
      {
        ...createTransparentTypesConfig(3),
        GRAVITY: [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ],
      },
      'GRAVITY',
      [
        new Operation({
          type: OperationType.UNARY,
          factoryName: 'SUB',
        }).setFactoryArgValues([1]),
        new Operation({
          type: OperationType.UNARY,
          factoryName: 'MINMAX',
        }).setFactoryArgValues([1, 7]),
      ],
      [
        [1, 1, 2],
        [3, 4, 5],
        [6, 7, 7],
      ],
    ],
    [
      {
        ...createTransparentTypesConfig(3),
        GRAVITY: [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ],
        LINK_GRAVITY: [
          [1, 1, 1],
          [2, 2, 2],
          [3, 3, 3],
        ],
      },
      'GRAVITY',
      [
        new Operation({
          type: OperationType.BINARY,
          factoryName: 'ADD',
          rightArgument: 'LINK_GRAVITY',
        }).setFactoryArgValues([1]),
      ],
      [
        [2, 3, 4],
        [6, 7, 8],
        [10, 11, 12],
      ],
    ],
    [
      {
        ...createTransparentTypesConfig(3),
        GRAVITY: [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ],
        LINK_GRAVITY: [
          [1, 1, 1],
          [2, 2, 2],
          [3, 3, 3],
        ],
      },
      'GRAVITY',
      [
        new Operation({
          type: OperationType.BINARY,
          factoryName: 'ADD',
          rightArgument: 'LINK_GRAVITY',
        }).setFactoryArgValues([1]),
        new Operation({
          type: OperationType.UNARY,
          factoryName: 'MINMAX',
        }).setFactoryArgValues([3, 9]),
      ],
      [
        [3, 3, 4],
        [6, 7, 8],
        [9, 9, 9],
      ],
    ],
  ];
}
