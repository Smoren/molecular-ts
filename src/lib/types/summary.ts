export type StepSummary = {
  ATOMS_COUNT: number;
  LINKS_COUNT: number;
  STEP_DURATION: number;
  STEP_FREQUENCY: number,
}

export interface StepSummaryManagerInterface {
  readonly summary: StepSummary;
  readonly buffer: StepSummary;
  save(): void;
}
