import type { QueueInterface } from './helpers';

export type Summary<T> = {
  ATOMS_COUNT: T;
  ATOMS_MEAN_SPEED: T;
  LINKS_COUNT: T;
  STEP_DURATION: T;
  STEP_FREQUENCY: T,
}

export type SummaryAttr = keyof Summary<unknown>;

export interface StepSummaryManagerInterface<T> {
  readonly summary: Summary<T>;
  readonly buffer: Summary<T>;
  save(): void;
}

export type QueueSummary<T> = {
  ATOMS_COUNT: QueueInterface<T>;
  ATOMS_MEAN_SPEED: QueueInterface<T>;
  LINKS_COUNT: QueueInterface<T>;
  STEP_DURATION: QueueInterface<T>;
  STEP_FREQUENCY: QueueInterface<T>,
}

export interface QueueSummaryManagerInterface<T> {
  readonly summary: QueueSummary<T>;
  push(step: Summary<T>): void;
  mean(): Summary<T>;
}
