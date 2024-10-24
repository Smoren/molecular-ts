import type { LineCoefficients, NumericVector } from "./types";

export function distanceToLine(point: NumericVector, k: number, b: number): number {
  const [x0, y0] = point;
  const numerator = Math.abs(k * x0 - y0 + b);
  const denominator = Math.sqrt(k * k + 1);
  return numerator / denominator;
}

export function getLineByPoints(lhs: NumericVector, ths: NumericVector): LineCoefficients {
  const [x1, y1] = lhs;
  const [x2, y2] = ths;

  if (x1 === x2) {
    throw new Error('Cannot get line coefficients because x1 === x2');
  }

  const k = (y2 - y1) / (x2 - x1);
  const b = y1 - k * x1;

  return [k, b];
}
