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
