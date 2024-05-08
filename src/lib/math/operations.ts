import { createEmptyMatrix, createEmptyTensor } from './factories';

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

    for (let i=0; i<len; ++i) {
        result.push(operator(lhs[i], rhs[i]));
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

    for (let i=0; i<lhs.length; ++i) {
        const row = lhs[i];
        for (let j=0; j<row.length; ++j) {
            result[i][j] = row[j];
        }
    }

    for (let i=0; i<rhs.length; ++i) {
        const row = rhs[i];
        for (let j=0; j<row.length; ++j) {
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

    for (let i=0; i<lhs.length; ++i) {
        for (let j=0; j<lhs[i].length; ++j) {
            for (let k=0; k<lhs[i][j].length; ++k) {
                result[i][j][k] = lhs[i][j][k];
            }
        }
    }

    for (let i=0; i<rhs.length; ++i) {
        for (let j=0; j<rhs[i].length; ++j) {
            for (let k=0; k<rhs[i][j].length; ++k) {
                result[lhs.length + i][lhs[0].length + j][lhs[0][0].length + k] = rhs[i][j][k];
            }
        }
    }

    return result;
}

export function setMatrixMainDiagonal<T>(matrix: T[][], value: T): T[][] {
    for (let i=0; i<matrix.length; ++i) {
        matrix[i][i] = value;
    }
    return matrix;
}

export function setTensorMainDiagonal<T>(tensor: T[][][], value: T): T[][][] {
    for (let i=0; i<tensor.length; ++i) {
        tensor[i][i][i] = value;
    }
    return tensor;
}
