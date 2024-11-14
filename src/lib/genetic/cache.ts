import { AverageMetricsCache, type GenomeMetricsRow } from "genetic-search";
import { arrayBinaryOperation, createFilledArray } from "../math";

export class WeightedAgeAverageMetricsCache extends AverageMetricsCache {
  private weight: number;
  private averageRow: GenomeMetricsRow | undefined = undefined;

  constructor(weight: number) {
    super();
    this.weight = weight;
  }

  set(genomeId: number, metrics: GenomeMetricsRow): void {
    super.set(genomeId, metrics);
    this.resetAverageRow();
  }

  get(genomeId: number, defaultValue?: GenomeMetricsRow): GenomeMetricsRow | undefined {
    const row = super.get(genomeId, defaultValue);
    if (row === undefined) {
      return undefined;
    }

    if (!this.refreshAverageRow()) {
      return row;
    }

    const [, age] = this.cache.get(genomeId)!;
    const averageDiff = arrayBinaryOperation(row, this.averageRow!, (lhs, rhs) => lhs - rhs);
    const weightedAverageDiff = averageDiff.map((x) => x * this.weight/age);

    return arrayBinaryOperation(row, weightedAverageDiff, (lhs, rhs) => lhs - rhs);
  }

  private refreshAverageRow(): boolean {
    if (this.cache.size === 0) {
      this.resetAverageRow();
      return false;
    }

    let weightedTotal = 0;
    const result = createFilledArray(this.getMetricsCount(), 0);
    for (const metrics of this.cache.values()) {
      const [row, weight] = metrics;
      for (let i = 0; i < row.length; ++i) {
        result[i] += row[i] * weight;
      }
      weightedTotal += weight;
    }

    this.averageRow = result.map((x) => x / weightedTotal);

    return true;
  }

  private resetAverageRow(): void {
    this.averageRow = undefined;
  }

  private getMetricsCount(): number {
    return this.cache.values().next()?.value?.[0]?.length ?? 0;
  }
}
