import type { QueueInterface } from './helpers';

export type Summary = {
  ATOMS_COUNT: number;
  ATOMS_MEAN_SPEED: number;
  LINKS_COUNT: number;
  STEP_DURATION: number;
  STEP_FREQUENCY: number,
}

export type SummaryAttr = keyof Summary;

export interface StepSummaryManagerInterface {
  readonly summary: Summary;
  readonly buffer: Summary;
  save(): void;
}

export type QueueSummary = {
  ATOMS_COUNT: QueueInterface;
  ATOMS_MEAN_SPEED: QueueInterface;
  LINKS_COUNT: QueueInterface;
  STEP_DURATION: QueueInterface;
  STEP_FREQUENCY: QueueInterface,
}

export interface QueueSummaryManagerInterface {
  readonly summary: QueueSummary;
  push(step: Summary): void;
  mean(): Summary;
}
