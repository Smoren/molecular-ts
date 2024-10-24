import type { NumericVector } from "./types";

export function distanceToLine(point: NumericVector, k: number, b: number): number {
  const [x0, y0] = point;
  const numerator = Math.abs(k * x0 - y0 + b);
  const denominator = Math.sqrt(k * k + 1);
  return numerator / denominator;
}
