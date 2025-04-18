import type {
  QueueSummary,
  QueueSummaryManagerInterface,
  WorldSummary,
  StepSummaryManagerInterface,
  SummaryAttr,
  SummaryManagerInterface,
} from './types';
import { Queue } from '../utils/structs';
import type { AtomInterface, LinkInterface } from '../simulation/types/atomic';
import type { TypesConfig, WorldConfig } from '../config/types';
import { arrayBinaryOperation, arrayUnaryOperation, round } from '../math';

const createEmptyStepSummary = (typesCount: number): WorldSummary<number[]> => ({
  ATOMS_COUNT: [0],
  ATOMS_MEAN_SPEED: [0],
  ATOMS_TYPE_COUNT: Array(typesCount).fill(0),
  ATOMS_TYPE_MEAN_COUNT: Array(typesCount).fill(0),
  ATOMS_TYPE_MEAN_SPEED: Array(typesCount).fill(0),
  ATOMS_TYPE_LINKS_COUNT: Array(typesCount).fill(0),
  ATOMS_TYPE_LINKS_MEAN_COUNT: Array(typesCount).fill(0),
  LINKS_CREATED: [0],
  LINKS_DELETED: [0],
  LINKS_CREATED_MEAN: [0],
  LINKS_DELETED_MEAN: [0],
  LINKS_TYPE_CREATED: Array(typesCount).fill(0),
  LINKS_TYPE_DELETED: Array(typesCount).fill(0),
  LINKS_TYPE_CREATED_MEAN: Array(typesCount).fill(0),
  LINKS_TYPE_DELETED_MEAN: Array(typesCount).fill(0),
  LINKS_COUNT: [0],
  STEP_DURATION: [0],
  STEP_FREQUENCY: [0],
  TRANSFORMATION_COUNT: [0],
  TRANSFORMATION_TYPE_FROM_COUNT: Array(typesCount).fill(0),
  TRANSFORMATION_TYPE_TO_COUNT: Array(typesCount).fill(0),
  TRANSFORMATION_MEAN_COUNT: [0],
  TRANSFORMATION_TYPE_FROM_MEAN_COUNT: Array(typesCount).fill(0),
  TRANSFORMATION_TYPE_TO_MEAN_COUNT: Array(typesCount).fill(0),
});

export class StepSummaryManager implements StepSummaryManagerInterface<number[]> {
  private _buffer: WorldSummary<number[]>;
  private _typesCount: number;
  private _summary: WorldSummary<number[]>;
  private _empty: WorldSummary<number[]>;

  constructor(typesCount: number) {
    this._typesCount = typesCount;
    this._buffer = createEmptyStepSummary(typesCount);
    this._summary = createEmptyStepSummary(typesCount);
    this._empty = createEmptyStepSummary(typesCount);
  }

  get typesCount(): number {
    return this._typesCount;
  }

  get buffer(): WorldSummary<number[]> {
    return this._buffer;
  }

  get summary(): WorldSummary<number[]> {
    return this.copy(this._summary);
  }

  save() {
    this.copy(this.buffer, this._summary);
    this.copy(this._empty, this.buffer);
  }

  init(typesCount: number) {
    if (typesCount === this._typesCount) {
      return;
    }

    this._typesCount = typesCount;
    this._buffer = createEmptyStepSummary(typesCount);
    this._summary = createEmptyStepSummary(typesCount);
    this._empty = createEmptyStepSummary(typesCount);
  }

  private copy(sourceFrom: WorldSummary<number[]>, sourceTo?: WorldSummary<number[]>): WorldSummary<number[]> {
    sourceTo = sourceTo ?? createEmptyStepSummary(this._typesCount);
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
  private readonly roundParams: WorldSummary<number> = {
    ATOMS_COUNT: 0,
    ATOMS_MEAN_SPEED: 2,
    ATOMS_TYPE_COUNT: 0,
    ATOMS_TYPE_MEAN_COUNT: 2,
    ATOMS_TYPE_MEAN_SPEED: 2,
    ATOMS_TYPE_LINKS_COUNT: 1,
    ATOMS_TYPE_LINKS_MEAN_COUNT: 1,
    LINKS_COUNT: 0,
    LINKS_CREATED: 4,
    LINKS_DELETED: 4,
    LINKS_CREATED_MEAN: 4,
    LINKS_DELETED_MEAN: 4,
    LINKS_TYPE_CREATED: 4,
    LINKS_TYPE_DELETED: 4,
    LINKS_TYPE_CREATED_MEAN: 4,
    LINKS_TYPE_DELETED_MEAN: 4,
    STEP_DURATION: 2,
    STEP_FREQUENCY: 1,
    TRANSFORMATION_COUNT: 0,
    TRANSFORMATION_TYPE_FROM_COUNT: 0,
    TRANSFORMATION_TYPE_TO_COUNT: 0,
    TRANSFORMATION_MEAN_COUNT: 4,
    TRANSFORMATION_TYPE_FROM_MEAN_COUNT: 4,
    TRANSFORMATION_TYPE_TO_MEAN_COUNT: 4,
  }

  constructor(maxSize: number) {
    this.summary = {
      ATOMS_COUNT: new Queue(maxSize),
      ATOMS_MEAN_SPEED: new Queue(maxSize),
      ATOMS_TYPE_COUNT: new Queue(maxSize),
      ATOMS_TYPE_MEAN_COUNT: new Queue(maxSize),
      ATOMS_TYPE_MEAN_SPEED: new Queue(maxSize),
      ATOMS_TYPE_LINKS_COUNT: new Queue(maxSize),
      ATOMS_TYPE_LINKS_MEAN_COUNT: new Queue(maxSize),
      LINKS_COUNT: new Queue(maxSize),
      LINKS_CREATED: new Queue(maxSize),
      LINKS_DELETED: new Queue(maxSize),
      LINKS_CREATED_MEAN: new Queue(maxSize),
      LINKS_DELETED_MEAN: new Queue(maxSize),
      LINKS_TYPE_CREATED: new Queue(maxSize),
      LINKS_TYPE_DELETED: new Queue(maxSize),
      LINKS_TYPE_CREATED_MEAN: new Queue(maxSize),
      LINKS_TYPE_DELETED_MEAN: new Queue(maxSize),
      STEP_DURATION: new Queue(maxSize),
      STEP_FREQUENCY: new Queue(maxSize),
      TRANSFORMATION_COUNT: new Queue(maxSize),
      TRANSFORMATION_TYPE_FROM_COUNT: new Queue(maxSize),
      TRANSFORMATION_TYPE_TO_COUNT: new Queue(maxSize),
      TRANSFORMATION_MEAN_COUNT: new Queue(maxSize),
      TRANSFORMATION_TYPE_FROM_MEAN_COUNT: new Queue(maxSize),
      TRANSFORMATION_TYPE_TO_MEAN_COUNT: new Queue(maxSize),
    }
  }

  push(step: WorldSummary<number[]>): void {
    for (const key in step) {
      this.summary[key as SummaryAttr].push(step[key as SummaryAttr]);
    }
  }

  mean(): WorldSummary<number[]> {
    const r: Record<string, number[]> = {};
    for (const key in this.summary) {
      const item = this.summary[key as SummaryAttr];
      const mean = item.mean() ?? [0];
      r[key] = arrayUnaryOperation(mean, (x) => round(x, this.roundParams[key as SummaryAttr]))
    }
    return r as WorldSummary<number[]>;
  }
}

export class SummaryManager implements SummaryManagerInterface {
  private stepManager: StepSummaryManager;
  private queueManager: QueueSummaryManager;
  private stepStartedAt: number;
  private _step: number;

  constructor(typesCount: number, queueMaxSize: number = 30) {
    this.stepManager = new StepSummaryManager(typesCount);
    this.queueManager = new QueueSummaryManager(queueMaxSize);
    this.stepStartedAt = Date.now();
    this._step = 0;
  }

  get summary(): WorldSummary<number[]> {
    return this.queueManager.mean();
  }

  get step(): number {
    return this._step;
  }

  noticeAtom(atom: AtomInterface, worldConfig: WorldConfig) {
    const speed = atom.speed.abs;

    this.stepManager.buffer.ATOMS_COUNT[0]++;
    this.stepManager.buffer.ATOMS_MEAN_SPEED[0] += speed;

    this.stepManager.buffer.ATOMS_TYPE_COUNT[atom.type]++;
    this.stepManager.buffer.ATOMS_TYPE_MEAN_COUNT[atom.type]++;

    this.stepManager.buffer.ATOMS_TYPE_MEAN_SPEED[atom.type] += speed;
  }

  noticeLink(link: LinkInterface): void {
    this.stepManager.buffer.LINKS_COUNT[0]++;

    this.stepManager.buffer.ATOMS_TYPE_LINKS_COUNT[link.lhs.type]++;
    this.stepManager.buffer.ATOMS_TYPE_LINKS_COUNT[link.rhs.type]++;
  }

  noticeLinkCreated(link: LinkInterface): void {
    this.stepManager.buffer.LINKS_CREATED[0]++;

    this.stepManager.buffer.LINKS_TYPE_CREATED[link.lhs.type]++;
    this.stepManager.buffer.LINKS_TYPE_CREATED[link.rhs.type]++;
  }

  noticeLinkDeleted(link: LinkInterface): void {
    this.stepManager.buffer.LINKS_DELETED[0]++;

    this.stepManager.buffer.LINKS_TYPE_DELETED[link.lhs.type]++;
    this.stepManager.buffer.LINKS_TYPE_DELETED[link.rhs.type]++;
  }

  noticeTransformation(typeFrom: number, typeTo: number): void {
    this.stepManager.buffer.TRANSFORMATION_COUNT[0]++;

    this.stepManager.buffer.TRANSFORMATION_TYPE_FROM_COUNT[typeFrom]++;
    this.stepManager.buffer.TRANSFORMATION_TYPE_TO_COUNT[typeTo]++;
  }

  startStep(typesConfig: TypesConfig): void {
    this.stepManager.init(typesConfig.FREQUENCIES.length);
  }

  finishStep(): void {
    const totalCountFilled = Array(this.stepManager.buffer.ATOMS_TYPE_COUNT.length).fill(this.stepManager.buffer.ATOMS_COUNT[0]);
    this.finishArrayMean('ATOMS_TYPE_MEAN_COUNT', totalCountFilled);

    this.finishMean('ATOMS_MEAN_SPEED', this.stepManager.buffer.ATOMS_COUNT);
    this.finishArrayMean('ATOMS_TYPE_MEAN_SPEED', this.stepManager.buffer.ATOMS_TYPE_COUNT);

    this.stepManager.buffer.ATOMS_TYPE_LINKS_MEAN_COUNT = [...this.stepManager.buffer.ATOMS_TYPE_LINKS_COUNT];
    this.finishArrayMean('ATOMS_TYPE_LINKS_MEAN_COUNT', this.stepManager.buffer.ATOMS_TYPE_COUNT);

    this.stepManager.buffer.LINKS_CREATED_MEAN = [...this.stepManager.buffer.LINKS_CREATED];
    this.stepManager.buffer.LINKS_DELETED_MEAN = [...this.stepManager.buffer.LINKS_DELETED];
    this.finishMean('LINKS_CREATED_MEAN', this.stepManager.buffer.LINKS_COUNT);
    this.finishMean('LINKS_DELETED_MEAN', this.stepManager.buffer.LINKS_COUNT);

    this.stepManager.buffer.LINKS_TYPE_CREATED_MEAN = [...this.stepManager.buffer.LINKS_TYPE_CREATED];
    this.stepManager.buffer.LINKS_TYPE_DELETED_MEAN = [...this.stepManager.buffer.LINKS_TYPE_DELETED];
    this.finishArrayMean('LINKS_TYPE_CREATED_MEAN', this.stepManager.buffer.ATOMS_TYPE_COUNT);
    this.finishArrayMean('LINKS_TYPE_DELETED_MEAN', this.stepManager.buffer.ATOMS_TYPE_COUNT);

    this.stepManager.buffer.TRANSFORMATION_MEAN_COUNT = [...this.stepManager.buffer.TRANSFORMATION_COUNT];
    this.finishMean('TRANSFORMATION_MEAN_COUNT', this.stepManager.buffer.ATOMS_COUNT);

    this.stepManager.buffer.TRANSFORMATION_TYPE_FROM_MEAN_COUNT = [...this.stepManager.buffer.TRANSFORMATION_TYPE_FROM_COUNT];
    this.stepManager.buffer.TRANSFORMATION_TYPE_TO_MEAN_COUNT = [...this.stepManager.buffer.TRANSFORMATION_TYPE_TO_COUNT];
    this.finishArrayMean('TRANSFORMATION_TYPE_FROM_MEAN_COUNT', this.stepManager.buffer.ATOMS_TYPE_COUNT);
    this.finishArrayMean('TRANSFORMATION_TYPE_TO_MEAN_COUNT', this.stepManager.buffer.ATOMS_TYPE_COUNT);

    this.updateFpsMetrics();
    this.stepManager.save();
    this.queueManager.push(this.stepManager.summary);
    this._step++;
  }

  private updateFpsMetrics(): void {
    this.stepManager.buffer.STEP_DURATION[0] = Date.now() - this.stepStartedAt;
    this.stepManager.buffer.STEP_FREQUENCY[0] = 1000 / this.stepManager.buffer.STEP_DURATION[0];
    this.stepStartedAt = Date.now();
  }

  private finishMean(valueKey: SummaryAttr, counts: number[]): void {
    this.stepManager.buffer[valueKey][0] = this.stepManager.buffer[valueKey][0] as number / counts[0];
  }

  private finishArrayMean(valueKey: SummaryAttr, counts: number[]): void {
    this.stepManager.buffer[valueKey] = arrayBinaryOperation(
      this.stepManager.buffer[valueKey] as number[],
      counts,
      (a, b) => b > 0 ? a / b : 0,
    );
  }
}
