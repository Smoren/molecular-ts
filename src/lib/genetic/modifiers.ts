import type { SummaryMatrixRowObject } from '../types/analysis';
import { convertArrayToStatSummary, convertStatSummaryToArray } from "@/lib/analysis/helpers";

export class SummaryMatrixRowObjectModifier {
  private readonly row: SummaryMatrixRowObject;

  constructor(row: SummaryMatrixRowObject) {
    this.row = row;
  }

  public get(): SummaryMatrixRowObject {
    return this.row;
  }

  public mulSpeed(value: number): SummaryMatrixRowObjectModifier {
    this.row.atomsMeanSpeed *= value;
    this.row.atomTypeMeanSpeed = this.row.atomTypeMeanSpeed.map((x) => x * value);
    this.row.compoundSpeedSummary = convertArrayToStatSummary(
      convertStatSummaryToArray(this.row.compoundSpeedSummary).map((x) => x * value),
    );
    return this;
  }
}
