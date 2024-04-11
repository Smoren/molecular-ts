import type {
  QueueSummary,
  QueueSummaryManagerInterface,
  Summary,
  StepSummaryManagerInterface,
  SummaryAttr,
} from './types/summary';
import { arrayUnaryOperation, Queue, round } from './helpers';

const createEmptyStepSummary = (): Summary<number[]> => ({
  ATOMS_COUNT: [0],
  ATOMS_MEAN_SPEED: [0],
  LINKS_COUNT: [0],
  STEP_DURATION: [0],
  STEP_FREQUENCY: [0],
});

export class StepSummaryManager implements StepSummaryManagerInterface<number[]> {
  readonly buffer: Summary<number[]>;
  private readonly _summary: Summary<number[]>;
  private readonly _empty: Summary<number[]>;

  constructor() {
    this.buffer = createEmptyStepSummary();
    this._summary = createEmptyStepSummary();
    this._empty = createEmptyStepSummary();
  }

  get summary(): Summary<number[]> {
    return this.copy(this._summary);
  }

  save() {
    this.copy(this.buffer, this._summary);
    this.copy(this._empty, this.buffer);
  }

  private copy(sourceFrom: Summary<number[]>, sourceTo?: Summary<number[]>): Summary<number[]> {
    sourceTo = sourceTo ?? createEmptyStepSummary();
    for (const key in sourceFrom) {
      for (let i=0; i<sourceTo[key as SummaryAttr].length; ++i) {
        sourceTo[key as SummaryAttr][i] = sourceFrom[key as SummaryAttr][i];
      }
    }
    return sourceTo;
  }
}

export class QueueSummaryManager implements QueueSummaryManagerInterface<number[]> {
  readonly summary: QueueSummary<number[]>;
  private readonly roundParams: Summary<number> = {
    ATOMS_COUNT: 0,
    ATOMS_MEAN_SPEED: 2,
    LINKS_COUNT: 0,
    STEP_DURATION: 2,
    STEP_FREQUENCY: 1,
  }

  constructor(maxSize: number) {
    this.summary = {
      ATOMS_COUNT: new Queue(maxSize),
      ATOMS_MEAN_SPEED: new Queue(maxSize),
      LINKS_COUNT: new Queue(maxSize),
      STEP_DURATION: new Queue(maxSize),
      STEP_FREQUENCY: new Queue(maxSize),
    }
  }

  push(step: Summary<number[]>): void {
    for (const key in step) {
      this.summary[key as SummaryAttr].push(step[key as SummaryAttr]);
    }
  }

  mean(): Summary<number[]> {
    const r: Record<string, number[]> = {};
    for (const key in this.summary) {
      const item = this.summary[key as SummaryAttr];
      const mean = item.mean() ?? [0];
      r[key] = arrayUnaryOperation(mean, (x) => round(x, this.roundParams[key as SummaryAttr]))
    }
    return r as Summary<number[]>;
  }
}
