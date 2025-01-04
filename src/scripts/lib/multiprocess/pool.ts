import { fork, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import * as path from 'path';

interface ResultMessage<TInput, TResult> {
  taskIndex: number;
  inputData: TInput;
  result?: TResult;
  error?: string;
}

export class Pool extends EventEmitter {
  private workers: ChildProcess[] = [];
  private availableWorkers: ChildProcess[] = [];
  private taskQueue: Array<{ data: any; taskFunctionString: string }> = [];
  private tasksInProcess = new Map<ChildProcess, any>();
  private currentTaskIndex = 0;
  private onItemResult: (itemResult: any, itemInput: any, taskIndex: number) => void;
  private onItemError: (error: string, itemInput: any, taskIndex: number) => void;

  constructor(poolSize: number) {
    super();

    this.onItemResult = () => {};
    this.onItemError = () => {};

    this.initWorkers(poolSize);
  }

  public async *mapUnordered<TInput, TResult>(
    dataArray: TInput[],
    task: (input: TInput) => Promise<TResult>,
    onItemResult?: (itemResult: TResult, itemInput: TInput, taskIndex: number) => void,
    onItemError?: (error: string, itemInput: TInput, taskIndex: number) => void,
  ): AsyncGenerator<TResult> {
    for await (const [_, result] of this.mapTasks(dataArray, task, onItemResult, onItemError)) {
      yield result;
    }
  }

  public async *map<TInput, TResult>(
    dataArray: TInput[],
    task: (input: TInput) => Promise<TResult>,
    onItemResult?: (itemResult: TResult, itemInput: TInput, taskIndex: number) => void,
    onItemError?: (error: string, itemInput: TInput, taskIndex: number) => void,
  ): AsyncGenerator<TResult> {
    const result: [number, TResult][] = [];
    for await (const item of this.mapTasks(dataArray, task, onItemResult, onItemError)) {
      result.push(item);
    }
    result.sort((lhs, rhs) => lhs[0] - rhs[0]);
    for (const item of result) {
      yield item[1];
    }
  }

  close() {
    for (const worker of this.workers) {
      worker.kill();
    }
  }

  private async *mapTasks<TInput, TResult>(
    dataArray: TInput[],
    task: (input: TInput) => Promise<TResult>,
    onItemResult?: (itemResult: TResult, itemInput: TInput, taskIndex: number) => void,
    onItemError?: (error: string, itemInput: TInput, taskIndex: number) => void,
  ): AsyncGenerator<[number, TResult]> {
    this.currentTaskIndex = 0;

    this.onItemResult = onItemResult ?? (() => {});
    this.onItemError = onItemError ?? (() => {});

    const taskFunctionString = task.toString();

    // Enqueue all tasks
    for (const data of dataArray) {
      this.taskQueue.push({ data, taskFunctionString });
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

      this.tasksInProcess.set(worker, task.data);
      worker.send({
        taskFunctionString: task.taskFunctionString,
        inputData: task.data,
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
