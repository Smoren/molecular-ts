import type { NumericVector, VectorInterface } from './types';
import { Vector } from './vector';

/**
 * Creates new vector
 * @public
 * @param coords - coordinates of new vector
 */
export function createVector(coords: NumericVector): VectorInterface {
  return new Vector(coords);
}

/**
 * Converts instance to vector if it's an array
 * @public
 * @param coords - coords as vector or an array
 */
export function toVector(coords: NumericVector): VectorInterface {
  return (coords instanceof Vector) ? coords : createVector(coords);
}

export function createEmptyMatrix(n: number, m: number, defaultValue: number = 0): number[][] {
  const result: number[][] = [];
  result.length = n;
  for (let i=0; i<n; ++i) {
    result[i] = [];
    result[i].length = m;
    result[i].fill(defaultValue);
  }
  return result;
}

export function createEmptyTensor(n: number, m: number, k: number, defaultValue: number = 0): number[][][] {
  const result: number[][][] = [];
  result.length = n;
  for (let i=0; i<n; ++i) {
    result[i] = [];
    result[i].length = m;
    for (let j=0; j<m; ++j) {
      result[i][j] = [];
      result[i][j].length = k;
      result[i][j].fill(defaultValue);
    }
  }
  return result;
}
