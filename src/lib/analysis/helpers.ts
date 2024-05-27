import type { StatSummary } from '../types/analysis';

export function convertArrayToStatSummary(input: number[]): StatSummary {
  return {
    min: input[0],
    max: input[1],
    mean: input[2],
    p25: input[3],
    median: input[4],
    p75: input[5],
  };
}

export function convertStatSummaryToArray(summary: StatSummary): number[] {
  return [
    summary.min,
    summary.max,
    summary.mean,
    summary.p25,
    summary.median,
    summary.p75,
  ];
}
