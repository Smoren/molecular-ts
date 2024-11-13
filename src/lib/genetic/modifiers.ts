import type { SummaryMatrixRowObject } from '../analysis/types';
import { arraySum } from '../math';
import { convertArrayToStatSummary, convertStatSummaryToArray } from '../analysis/helpers';

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

  public mulTypeSpeed(type: number, value: number): SummaryMatrixRowObjectModifier {
    const oldMeanSpeed = arraySum(this.row.atomTypeMeanSpeed) / this.row.atomTypeMeanSpeed.length;
    this.row.atomTypeMeanSpeed[type] *= value;
    const newMeanSpeed = arraySum(this.row.atomTypeMeanSpeed) / this.row.atomTypeMeanSpeed.length;

    this.row.atomsMeanSpeed *= newMeanSpeed / oldMeanSpeed;
    this.row.compoundSpeedSummary = convertArrayToStatSummary(
      convertStatSummaryToArray(this.row.compoundSpeedSummary).map((x) => x * newMeanSpeed / oldMeanSpeed),
    );

    return this;
  }
}
