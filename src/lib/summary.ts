import type { StepSummary, StepSummaryManagerInterface } from "./types/summary";

const createEmptyStepSummary = (): StepSummary => ({
  ATOMS_COUNT: 0,
  LINKS_COUNT: 0,
  STEP_DURATION: 0,
  STEP_FREQUENCY: 0,
});

export class StepSummaryManager implements StepSummaryManagerInterface {
  readonly buffer: StepSummary;
  private readonly _summary: StepSummary;
  private readonly _empty: StepSummary;

  constructor() {
    this.buffer = createEmptyStepSummary();
    this._summary = createEmptyStepSummary();
    this._empty = createEmptyStepSummary();
  }

  get summary(): StepSummary {
    return this.copy(this._summary);
  }

  save() {
    this.copy(this.buffer, this._summary);
    this.copy(this._empty, this.buffer);
  }

  private copy(sourceFrom: StepSummary, sourceTo?: StepSummary): StepSummary {
    sourceTo = sourceTo ?? createEmptyStepSummary();
    for (const key in sourceFrom) {
      sourceTo[key as keyof StepSummary] = sourceFrom[key as keyof StepSummary];
    }
    return sourceTo;
  }
}
