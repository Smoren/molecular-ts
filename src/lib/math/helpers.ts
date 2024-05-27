let EPSILON = 0.0000001;

export function changeEpsilon(value: number): void {
  EPSILON = value;
}

export function getEpsilon(): number {
  return EPSILON;
}

export function isEqual(lhs: number, rhs: number) {
  return Math.abs(lhs - rhs) < EPSILON * 10;
}

export function round(value: number, precision: number): number {
  return Number(value.toFixed(precision));
}

export function roundWithStep(value: number, step: number, precision?: number): number {
  const result = Math.round(value / step) * step;
  if (precision !== undefined) {
    return round(result, precision);
  }
  return result;
}

export function groupArray<T>(input: T[], groupSizes: number[]): T[][] {
  const result: T[][] = [];
  let index = 0;
  for (const groupSize of groupSizes) {
    result.push(input.slice(index, index + groupSize));
    index += groupSize;
  }
  return result;
}
