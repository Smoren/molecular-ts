import type {
  QueueSummary,
  QueueSummaryManagerInterface,
  Summary,
  StepSummaryManagerInterface,
  SummaryAttr,
} from './types/summary';
import { Queue, round } from './helpers';

const createEmptyStepSummary = (): Summary => ({
  ATOMS_COUNT: 0,
  LINKS_COUNT: 0,
  STEP_DURATION: 0,
  STEP_FREQUENCY: 0,
});

export class StepSummaryManager implements StepSummaryManagerInterface {
  readonly buffer: Summary;
  private readonly _summary: Summary;
  private readonly _empty: Summary;

  constructor() {
    this.buffer = createEmptyStepSummary();
    this._summary = createEmptyStepSummary();
    this._empty = createEmptyStepSummary();
  }

  get summary(): Summary {
    return this.copy(this._summary);
  }

  save() {
    this.copy(this.buffer, this._summary);
    this.copy(this._empty, this.buffer);
  }

  private copy(sourceFrom: Summary, sourceTo?: Summary): Summary {
    sourceTo = sourceTo ?? createEmptyStepSummary();
    for (const key in sourceFrom) {
      sourceTo[key as SummaryAttr] = sourceFrom[key as SummaryAttr];
    }
    return sourceTo;
  }
}

export class QueueSummaryManager implements QueueSummaryManagerInterface {
  readonly summary: QueueSummary;
  private readonly roundParams: Summary = {
    ATOMS_COUNT: 0,
    LINKS_COUNT: 0,
    STEP_DURATION: 2,
    STEP_FREQUENCY: 1,
  }

  constructor(maxSize: number) {
    this.summary = {
      ATOMS_COUNT: new Queue(maxSize),
      LINKS_COUNT: new Queue(maxSize),
      STEP_DURATION: new Queue(maxSize),
      STEP_FREQUENCY: new Queue(maxSize),
    }
  }

  push(step: Summary): void {
    for (const key in step) {
      this.summary[key as SummaryAttr].push(step[key as SummaryAttr] as number);
    }
  }

  mean(): Summary {
    const r: Record<string, number> = {};
    for (const key in this.summary) {
      r[key] = round(this.summary[key as SummaryAttr].mean() ?? 0, this.roundParams[key as SummaryAttr]);
    }
    return r as Summary;
  }
}
