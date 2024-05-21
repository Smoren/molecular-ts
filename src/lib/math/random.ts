import { roundWithStep } from './helpers';

type NumberFactory = ((bounds: [number, number, number?, number?], precision?: number) => number) |
  ((bounds: [number, number, number?], precision?: number) => number);

function applyMedian(from: number, until: number, median?: number): [number, number] {
  if (median === undefined) {
    return [from, until];
  }

  if (Math.random() > 0.5) {
    return [median, until];
  }

  return [from, median];
}

export function createRandomInteger([from, until, median]: [number, number, number?]): number {
  [from, until] = applyMedian(from, until, median);
  return Math.round(Math.random() * (until - from) + from);
}

export function createRandomFloat(
  [from, until, median, step]: [number, number, number?, number?],
  precision?: number,
): number {
  [from, until] = applyMedian(from, until, median);

  let result = Math.random() * (until - from) + from;
  if (step !== undefined && step !== 0) {
    result = roundWithStep(result, step, precision);
  }
  return result;
}

export function randomizeMatrix(
  count: number,
  bounds: [number, number, number?, number?] | [number, number, number?],
  numberFactory: NumberFactory,
  symmetric: boolean = false,
  precision?: number,
): number[][] {
  const result: number[][] = [];
  for (let i=0; i<count; ++i) {
    result.push([]);
    for (let j=0; j<count; ++j) {
      if (symmetric && i > j) {
        result[i].push(result[j][i]);
      } else {
        result[i].push(numberFactory(bounds as [number, number], precision));
      }
    }
  }
  return result;
}

export function normalizeFrequencies(weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b);
  return weights.map((x) => x / sum);
}

export function getIndexByFrequencies(frequencies: number[]): number {
  const normFrequencies = normalizeFrequencies(frequencies);
  const rand = Math.random();
  let sum = 0;
  for (let i=0; i<normFrequencies.length; ++i) {
    sum += normFrequencies[i];
    if (rand <= sum) {
      return i;
    }
  }
  return 0;
}

export function getRandomArrayItem<T>(input: T[]): T {
  return input[Math.floor(Math.random() * input.length)];
}
