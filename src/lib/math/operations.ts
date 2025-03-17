import { createFilledMatrix, createFilledTensor } from './factories';
import type { OperatorFactory, Tensor } from './types';
import { round } from "./helpers";
import { fullCopyObject } from "../utils/functions";

export const UNARY_OPERATOR_FACTORY: Record<string, OperatorFactory> = {
  ZEROS: {
    arguments: [],
    call: () => () => 0,
  },
  CONST: {
    arguments: ['value'],
    call: (value: number) => () => value,
  },
  REV: {
    arguments: [],
    call: () => (x: number) => 1 / x,
  },
  NEG: {
    arguments: [],
    call: () => (x: number) => -x,
  },
  ABS: {
    arguments: [],
    call: () => (x: number) => Math.abs(x),
  },
  ROUND: {
    arguments: ['precision'],
    call: (precision: number) => (x: number) => round(x, precision),
  },
  LOG: {
    arguments: [],
    call: () => (x: number) => Math.log(x),
  },
  ADD: {
    arguments: ['value'],
    call: (value: number) => (x: number) => x + value,
  },
  SUB: {
    arguments: ['value'],
    call: (value: number) => (x: number) => x - value,
  },
  MUL: {
    arguments: ['value'],
    call: (value: number) => (x: number) => x * value,
  },
  DIV: {
    arguments: ['value'],
    call: (value: number) => (x: number) => x / value,
  },
  MIN: {
    arguments: ['value'],
    call: (value: number) => (x: number) => Math.min(x, value),
  },
  MAX: {
    arguments: ['value'],
    call: (value: number) => (x: number) => Math.max(x, value),
  },
  MINMAX: {
    arguments: ['min', 'max'],
    call: (min: number, max: number) => (x: number) => Math.min(Math.max(x, min), max),
  },
};

export const BINARY_OPERATOR_FACTORY: Record<string, OperatorFactory> = {
  ADD: {
    arguments: [],
    call: () => (lhs: number, rhs: number) => lhs + rhs,
  },
  SUB: {
    arguments: [],
    call: () => (lhs: number, rhs: number) => lhs - rhs,
  },
  MUL: {
    arguments: [],
    call: () => (lhs: number, rhs: number) => lhs * rhs,
  },
  DIV: {
    arguments: [],
    call: () => (lhs: number, rhs: number) => lhs / rhs,
  },
  REPLACE_FROM: {
    arguments: [],
    call: () => (lhs: number, rhs: number) => rhs,
  },
};

export function arrayUnaryOperation<T>(input: Array<T>, operator: (item: T) => T): Array<T> {
  const result: Array<T> = [];

  for (const item of input) {
    result.push(operator(item));
  }

  return result;
}

export function arrayBinaryOperation<T>(lhs: Array<T>, rhs: Array<T>, operator: (lhs: T, rhs: T) => T): Array<T> {
  const result: Array<T> = [];
  const len = Math.min(lhs.length, rhs.length);

  for (let i = 0; i < len; ++i) {
    result.push(operator(lhs[i], rhs[i]));
  }

  return result;
}

export function objectUnaryOperation<T, U extends Record<string, T>>(input: U, operator: (item: T) => T): U {
  const result: Record<string, T> = {};

  for (const key of Object.keys(input)) {
    result[key] = operator(input[key]);
  }

  return result as U;
}

export function objectBinaryOperation<T, U extends Record<string, T>>(lhs: U, rhs: U, operator: (lhs: T, rhs: T) => T): U {
  const result: Record<string, T> = {};

  for (const key of Object.keys(lhs)) {
    result[key] = operator(lhs[key], rhs[key]);
  }

  return result as U;
}

export function arraySum(input: number[]): number {
  return input.reduce((acc, val) => acc + val, 0);
}

export function arrayProduct(input: number[]): number {
  return input.reduce((acc, val) => acc * val, 1);
}

export function tensorUnaryOperation<T>(operand: Tensor<T>, operation: (x: T) => T): Tensor<T> {
  const result: Tensor<T> = [];
  for (const item of operand) {
    if (item instanceof Array) {
      result.push(tensorUnaryOperation(item, operation));
    } else {
      result.push(operation(item));
    }
  }
  return result;
}

export function tensorBinaryOperation<T>(lhs: Tensor<T>, rhs: Tensor<T>, operation: (x: T, y: T) => T): Tensor<T> {
  const result: Tensor<T> = [];
  for (let i = 0; i < lhs.length; ++i) {
    const lhsItem = lhs[i];
    const rhsItem = rhs[i];
    if (lhsItem instanceof Array) {
      result.push(tensorBinaryOperation(lhsItem, rhsItem as Tensor<T>, operation));
    } else {
      result.push(operation(lhsItem, rhsItem as T));
    }
  }
  return result;
}

export function concatArrays<T>(lhs: T[], rhs: T[]): T[] {
  return [...lhs, ...rhs];
}

export function concatMatrices<T>(lhs: T[][], rhs: T[][], defaultValue: T): T[][] {
  const n = lhs.length + rhs.length;
  const m = (lhs[0]?.length ?? 0) + (rhs[0]?.length ?? 0);
  const result = createFilledMatrix(n, m, defaultValue);

  for (let i = 0; i < lhs.length; ++i) {
    const row = lhs[i];
    for (let j = 0; j < row.length; ++j) {
      result[i][j] = row[j];
    }
  }

  for (let i = 0; i < rhs.length; ++i) {
    const row = rhs[i];
    for (let j = 0; j < row.length; ++j) {
      result[lhs.length + i][(lhs[0]?.length ?? 0) + j] = row[j];
    }
  }

  return result;
}

export function concatTensors<T>(lhs: T[][][], rhs: T[][][], defaultValue: T): T[][][] {
  const n = lhs.length + rhs.length;
  const m = (lhs[0]?.length ?? 0) + (rhs[0]?.length ?? 0);
  const k = ((lhs[0] ?? [])[0]?.length ?? 0) + ((rhs[0] ?? [])[0]?.length ?? 0);
  const result = createFilledTensor(n, m, k, defaultValue);

  for (let i = 0; i < lhs.length; ++i) {
    for (let j = 0; j < lhs[i].length; ++j) {
      for (let k = 0; k < lhs[i][j].length; ++k) {
        result[i][j][k] = lhs[i][j][k];
      }
    }
  }

  for (let i = 0; i < rhs.length; ++i) {
    for (let j = 0; j < rhs[i].length; ++j) {
      for (let k = 0; k < rhs[i][j].length; ++k) {
        result[lhs.length + i][(lhs[0]?.length ?? 0) + j][((lhs[0] ?? [])[0]?.length ?? 0) + k] = rhs[i][j][k];
      }
    }
  }

  return result;
}

export function crossArrays<T>(lhs: T[], rhs: T[], separator: number): T[] {
  lhs = lhs.slice(0, separator);
  rhs = rhs.slice(separator);
  return concatArrays(lhs, rhs);
}

export function crossMatrices<T>(lhs: T[][], rhs: T[][], separator: number, defaultValue: T): T[][] {
  lhs = lhs.slice(0, separator).map((row) => row.slice(0, separator));
  rhs = rhs.slice(separator).map((row) => row.slice(separator));
  return concatMatrices(lhs, rhs, defaultValue);
}

export function crossTensors<T>(lhs: T[][][], rhs: T[][][], separator: number, defaultValue: T): T[][][] {
  lhs = lhs.slice(0, separator).map((row) => row.slice(0, separator).map((col) => col.slice(0, separator)));
  rhs = rhs.slice(separator).map((row) => row.slice(separator).map((col) => col.slice(separator)));
  return concatTensors(lhs, rhs, defaultValue);
}

export function randomCrossArrays<T>(lhs: T[], rhs: T[], separator: number): T[] {
  return lhs.map((_, i) => Math.random() < separator ? lhs[i] : rhs[i]);
}

export function randomCrossMatrices<T>(lhs: T[][], rhs: T[][], separator: number): T[][] {
  return lhs.map((row, i) => row.map((_, j) => Math.random() < separator ? lhs[i][j] : rhs[i][j]));
}

export function randomCrossTensors<T>(lhs: T[][][], rhs: T[][][], separator: number): T[][][] {
  return lhs.map((row, i) => row.map((col, j) => col.map((_, k) => Math.random() < separator ? lhs[i][j][k] : rhs[i][j][k])));
}

export function crossArraysByIndexes<T>(lhs: T[], rhs: T[], indexes: number[]): T[] {
    const result = fullCopyObject(lhs);
    for (const index of indexes) {
        result[index] = rhs[index];
    }
    return result;
}

export function crossMatricesByIndexes<T>(lhs: T[][], rhs: T[][], indexes: number[]): T[][] {
    const result = lhs.map((row) => fullCopyObject(row));
    for (const index of indexes) {
        result[index] = fullCopyObject(rhs[index]);
    }
    return result;
}

export function crossTensorsByIndexes<T>(lhs: T[][][], rhs: T[][][], indexes: number[]): T[][][] {
    const result = lhs.map((row) => row.map((col) => fullCopyObject(col)));
    for (const index of indexes) {
        result[index] = fullCopyObject(rhs[index]);
    }
    return result;
}

export function removeIndexFromArray<T>(input: T[], index: number): T[] {
  return input.filter((_, i) => i !== index);
}

export function removeIndexFromMatrix<T>(matrix: T[][], index: number): T[][] {
  return matrix.filter((_, i) => i !== index).map((row) => removeIndexFromArray(row, index));
}

export function removeIndexFromTensor<T>(tensor: T[][][], index: number): T[][][] {
  return tensor.filter((_, i) => i !== index).map((row) => removeIndexFromMatrix(row, index));
}

export function copyArrayIndex<T>(array: T[], indexFrom: number, indexTo: number): T[] {
  const result = fullCopyObject(array);
  result[indexTo] = array[indexFrom];
  return result;
}

export function copyMatrixIndex<T>(matrix: T[][], indexFrom: number, indexTo: number): T[][] {
  const result = fullCopyObject(matrix);
  result[indexTo] = fullCopyObject(matrix[indexFrom]);
  for (let i = 0; i < matrix[indexFrom].length; ++i) {
    result[i][indexTo] = matrix[i][indexFrom];
  }
  result[indexTo][indexTo] = matrix[indexFrom][indexFrom];
  return result;
}

export function copyTensorIndex<T>(tensor: T[][][], indexFrom: number, indexTo: number): T[][][] {
  const result = fullCopyObject(tensor);
  for (let i = 0; i < tensor[indexFrom].length; ++i) {
    result[i][indexTo] = fullCopyObject(tensor[i][indexFrom]);
    for (let j = 0; j < tensor[i][indexFrom].length; ++j) {
      result[i][j][indexTo] = tensor[i][j][indexFrom];
    }
    result[i][indexTo][indexTo] = tensor[i][indexFrom][indexFrom];
  }
  result[indexTo] = copyMatrixIndex(tensor[indexFrom], indexFrom, indexTo);
  return result;
}

export function setMatrixMainDiagonal<T>(matrix: T[][], value: T): T[][] {
  for (let i = 0; i < matrix.length; ++i) {
    matrix[i][i] = value;
  }
  return matrix;
}

export function setTensorMainDiagonal<T>(tensor: T[][][], value: T): T[][][] {
  for (let i = 0; i < tensor.length; ++i) {
    tensor[i][i][i] = value;
  }
  return tensor;
}

export function makeMatrixSymmetric<T>(matrix: T[][]): T[][] {
  for (let i = 0; i < matrix.length; ++i) {
    for (let j = 0; j < i; ++j) {
      matrix[i][j] = matrix[j][i];
    }
  }
  return matrix;
}

export function makeTensorSymmetric<T>(tensor: T[][][]): T[][][] {
  for (let i = 0; i < tensor.length; ++i) {
    makeMatrixSymmetric(tensor[i]);
  }
  return tensor;
}

export function sortedNumbers(input: number[]): number[] {
  return [...input].sort((lhs, rhs) => lhs - rhs);
}

export function weighArray(input: number[], weight: number | number[]): number[] {
  if (Array.isArray(weight)) {
    return input.map((x, i) => x * weight[i]);
  }
  return input.map((x) => x * weight);
}

export function weighMatrix(
  input: number[][],
  weight: number | number[],
  rowModifier?: (row: number[]) => number[],
): number[][] {
  return input.map((item) => weighArray((rowModifier ?? ((row) => row))(item), weight));
}

export function averageMatrixColumns(input: number[][]): number[] {
  if (input.length === 0) {
    return [];
  }
  const result = [];
  for (let i = 0; i < input[0].length; ++i) {
    let sum = 0;
    for (let j = 0; j < input.length; ++j) {
      sum += input[j][i];
    }
    result[i] = sum / input.length;
  }
  return result;
}

export function transposeMatrix<T>(input: T[][]): T[][] {
  if (input.length === 0) {
    return [];
  }
  const result: T[][] = [];
  for (let i = 0; i < input[0].length; ++i) {
    result[i] = [];
    for (let j = 0; j < input.length; ++j) {
      result[i][j] = input[j][i];
    }
  }
  return result;
}
