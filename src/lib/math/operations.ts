import { createEmptyMatrix, createEmptyTensor } from './factories';
import type { Tensor } from './types';

export function arrayUnaryOperation<T>(
  input: Array<T>,
  operator: (item: T) => T,
): Array<T> {
  const result: Array<T> = [];

  for (const item of input) {
    result.push(operator(item));
  }

  return result;
}

export function arrayBinaryOperation<T>(
  lhs: Array<T>,
  rhs: Array<T>,
  operator: (lhs: T, rhs: T) => T,
): Array<T> {
  const result: Array<T> = [];
  const len = Math.min(lhs.length, rhs.length);

  for (let i = 0; i < len; ++i) {
    result.push(operator(lhs[i], rhs[i]));
  }

  return result;
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

export function concatMatrices(lhs: number[][], rhs: number[][], defaultValue: number = 0): number[][] {
  const n = lhs.length + rhs.length;
  const m = lhs[0].length + rhs[0].length;
  const result = createEmptyMatrix(n, m, defaultValue);

  for (let i = 0; i < lhs.length; ++i) {
    const row = lhs[i];
    for (let j = 0; j < row.length; ++j) {
      result[i][j] = row[j];
    }
  }

  for (let i = 0; i < rhs.length; ++i) {
    const row = rhs[i];
    for (let j = 0; j < row.length; ++j) {
      result[lhs.length + i][lhs[0].length + j] = row[j];
    }
  }

  return result;
}

export function concatTensors(lhs: number[][][], rhs: number[][][], defaultValue: number = 0): number[][][] {
  const n = lhs.length + rhs.length;
  const m = lhs[0].length + rhs[0].length;
  const k = lhs[0][0].length + rhs[0][0].length;
  const result = createEmptyTensor(n, m, k, defaultValue);

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
        result[lhs.length + i][lhs[0].length + j][lhs[0][0].length + k] = rhs[i][j][k];
      }
    }
  }

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
