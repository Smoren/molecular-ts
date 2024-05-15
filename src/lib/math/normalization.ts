import { fullCopyObject } from '../utils/functions';
import { isEqual } from './helpers';

export function normalizeArray(input: number[], inplace: boolean = false): number[] {
  const result = inplace ? input : fullCopyObject(input);

  if (result.length === 0) {
    return result;
  }

  const min = Math.min(...result);
  const max = Math.max(...result);

  if (isEqual(min, max)) {
    return result.map(() => 0.5);
  }

  return result.map((x) => (x - min) / (max - min));
}

export function normalizeMatrixColumns(input: number[][], inplace: boolean = false): number[][] {
  const result = inplace ? input : fullCopyObject(input);

  if (result.length === 0) {
    return result;
  }

  for (let i = 0; i < result[0].length; i++) {
    const columnNormalized = normalizeArray(result.map((row) => row[i]));
    for (let j = 0; j < result.length; j++) {
      result[j][i] = columnNormalized[j];
    }
  }

  return result;
}

function getBoundsOfMatrixColumnsUnion(matrix: number[][], columns: number[]): [number, number] {
  if (columns.length === 0 || matrix.length === 0) {
    return [0, 0];
  }

  let min = Infinity;
  let max = -Infinity;

  for (const column of columns) {
    for (let i = 0; i < matrix.length; i++) {
      min = Math.min(min, matrix[i][column]);
      max = Math.max(max, matrix[i][column]);
    }
  }

  return [min, max];
}

export function normalizeMatrixColumnsUnion(matrix: number[][], columns: number[], inplace: boolean = false): number[][] {
  const result = inplace ? matrix : fullCopyObject(matrix);

  const [min, max] = getBoundsOfMatrixColumnsUnion(result, columns);

  for (const column of columns) {
    for (let i = 0; i < result.length; i++) {
      if (isEqual(min, max)) {
        result[i][column] = 0.5;
      } else {
        result[i][column] = (result[i][column] - min) / (max - min);
      }
    }
  }

  return result;
}
