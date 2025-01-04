import { fork, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import * as path from 'path';

type ItemResultHandler<TInput, TResult> = (itemResult: TResult, itemInput: TInput, taskIndex: number) => void;
type ItemErrorHandler<TInput> = (error: string, itemInput: TInput, taskIndex: number) => void;

interface ResultMessage<TInput, TResult> {
  taskIndex: number;
  inputData: TInput;
  result?: TResult;
  error?: string;
}

export class Pool extends EventEmitter {
  private workers: ChildProcess[] = [];
  private availableWorkers: ChildProcess[] = [];
  private taskQueue: Array<{ inputData: any; taskFunctionString: string }> = [];
  private tasksInProcess = new Map<ChildProcess, any>();
  private currentTaskIndex = 0;
  private onItemResult: ItemResultHandler<any, any> = () => {};
  private onItemError: ItemErrorHandler<any> = () => {};

  constructor(poolSize: number) {
    super();
    this.initWorkers(poolSize);
  }

  public async *mapUnordered<TInput, TResult>(
    dataArray: TInput[],
    task: (input: TInput) => Promise<TResult>,
    onItemResult?: ItemResultHandler<TInput, TResult>,
    onItemError?: ItemErrorHandler<TInput>,
  ): AsyncGenerator<TResult | undefined> {
    for await (const [_, result] of this.mapTasks(dataArray, task, onItemResult, onItemError)) {
      yield result;
    }
  }

  public async map<TInput, TResult>(
    dataArray: TInput[],
    task: (input: TInput) => Promise<TResult>,
    onItemResult?: ItemResultHandler<TInput, TResult>,
    onItemError?: ItemErrorHandler<TInput>,
  ): Promise<Array<TResult | undefined>> {
    const result: [number, TResult | undefined][] = [];
    for await (const item of this.mapTasks(dataArray, task, onItemResult, onItemError)) {
      result.push(item);
    }
    result.sort((lhs, rhs) => lhs[0] - rhs[0]);
    return result.map((item) => item[1]);
  }

  public close() {
    for (const worker of this.workers) {
      worker.kill();
    }
  }

  private async *mapTasks<TInput, TResult>(
    dataArray: TInput[],
    task: (input: TInput) => Promise<TResult>,
    onItemResult?: ItemResultHandler<TInput, TResult>,
    onItemError?: ItemErrorHandler<TInput>,
  ): AsyncGenerator<[number, TResult | undefined]> {
    this.currentTaskIndex = 0;

    this.onItemResult = onItemResult ?? (() => {});
    this.onItemError = onItemError ?? (() => {});

    const taskFunctionString = task.toString();

    // Enqueue all tasks
    for (const inputData of dataArray) {
      this.taskQueue.push({ inputData, taskFunctionString });
    }

    // Start processing
    this.processQueue();

    const totalTasks = dataArray.length;
    let received = 0;

    while (received < totalTasks) {
      const result = await new Promise<any>((resolve) => {
        this.once('result', resolve);
      });
      received++;
      yield [result.taskIndex, result.result];
    }
  }

  private processQueue() {
    while (this.availableWorkers.length > 0 && this.taskQueue.length > 0) {
      const worker = this.availableWorkers.shift()!;
      const task = this.taskQueue.shift()!;

      this.tasksInProcess.set(worker, task.inputData);
      worker.send({
        taskFunctionString: task.taskFunctionString,
        inputData: task.inputData,
        taskIndex: this.currentTaskIndex++,
      });
    }
  }

  private initWorkers(poolSize: number) {
    for (let i = 0; i < poolSize; i++) {
      const worker = fork(path.resolve(__dirname, './worker.js'));
      worker.on('message', (message: ResultMessage<any, any>) => {
        const { result, error, inputData, taskIndex } = message;
        if (error) {
          this.onItemError(error, inputData, taskIndex);
        } else {
          this.onItemResult(result, inputData, taskIndex);
        }
        this.emit('result', { result, taskIndex });
        this.tasksInProcess.delete(worker);
        this.availableWorkers.push(worker);
        this.processQueue();
      });
      this.workers.push(worker);
      this.availableWorkers.push(worker);
    }
  }
}
