import { arraySum } from "@/lib/math";

export function calcShannonEntropy(probabilities: number[]): number {
    const totalCount = arraySum(probabilities);
    const normalizedProbabilities = probabilities.map((x) => x / totalCount);
    return arraySum(normalizedProbabilities.map((x) => x * Math.log2(x)));
}

export function calcFrequencies<T>(input: T[], hasher?: (x: T) => string): Map<T, number> {
  if (hasher === undefined) {
    const result = new Map<T, number>();
    for (const x of input) {
      result.set(x, (result.get(x) ?? 0) + 1);
    }
    return result;
  }

  const frequencies = new Map<string, number>();
  const reverseMap = new Map<string, T>();
  for (const x of input) {
    const key = hasher(x);
    reverseMap.set(key, x);
    frequencies.set(key, (frequencies.get(key) ?? 0) + 1);
  }
  const result = new Map<T, number>();
  for (const key of frequencies.keys()) {
    result.set(reverseMap.get(key)!, frequencies.get(key)!);
  }
  return result;
}

export function calcFrequenciesForMatrixRows(input: number[][]): Map<number[], number> {
  return calcFrequencies(input, (x) => JSON.stringify(x));
}
