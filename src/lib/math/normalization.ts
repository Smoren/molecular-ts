import { fullCopyObject } from '../utils/functions';
import { arrayify } from './helpers';
import { transposeMatrix } from "@/lib/math/operations";
import type { Arrayify } from "@/lib/math/types";
import { reduce } from "itertools-ts";

export function normalizeMatrixColumns<T extends Array<unknown>, U extends Array<unknown>>(
  input: number[][],
  arrayNormalizer: (arr: number[], ...extraArgs: U) => [number[], ...T],
  ...extraArgs: U
): [number[][], ...Arrayify<T>] {
  const result = fullCopyObject(input);
  const extraData: T[] = [];

  if (result.length === 0) {
    const [columnNormalized, ...columnExtraData] = arrayNormalizer([], ...extraArgs);
    return [[columnNormalized], ...arrayify(columnExtraData)];
  }

  for (let i = 0; i < result[0].length; i++) {
    const [columnNormalized, ...columnExtraData] = arrayNormalizer(result.map((row) => row[i]), ...extraArgs);
    extraData.push(columnExtraData);

    for (let j = 0; j < result.length; j++) {
      result[j][i] = columnNormalized[j];
    }
  }

  return [result, ...transposeMatrix(extraData) as Arrayify<T>];
}

export function normalizeArrayMinMax(input: number[], defaultValue = 0.5): [number[], number, number, number] {
  const min = reduce.toMin(input) ?? 0;
  const max = reduce.toMax(input) ?? 0;
  const mean = reduce.toAverage(input) ?? 0;

  if (max === min) {
    return [input.map(() => defaultValue), mean, min, max];
  }

  return [input.map((x) => (x - min) / (max - min)), mean, min, max];
}

export function normalizeMatrixColumnsMinMax(input: number[][], defaultValue = 0.5): [number[][], number[], number[], number[]] {
  return normalizeMatrixColumns(input, normalizeArrayMinMax, defaultValue);
}
