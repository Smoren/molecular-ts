import { fork, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import * as path from 'path';

interface ResultMessage {
  result?: any;
  error?: string;
  inputData: any;
}

export class Pool extends EventEmitter {
  private workers: ChildProcess[] = [];
  private availableWorkers: ChildProcess[] = [];
  private taskQueue: Array<{ data: any; taskFunctionString: string }> = [];
  private tasksInProcess = new Map<ChildProcess, any>();
  private onItemResult: (itemResult: any, itemInput: any) => void;
  private onItemError: (error: string, itemInput: any) => void;

  constructor(workerCount: number) {
    super();

    this.onItemResult = () => {};
    this.onItemError = () => {};

    for (let i = 0; i < workerCount; i++) {
      const worker = fork(path.resolve(__dirname, './worker.js'));
      worker.on('message', (message: ResultMessage) => {
        const { result, error, inputData } = message;
        if (error) {
          this.onItemError(error, inputData);
        } else {
          this.onItemResult(result, inputData);
        }
        this.emit('result', { result });
        this.tasksInProcess.delete(worker);
        this.availableWorkers.push(worker);
        this.processQueue();
      });
      this.workers.push(worker);
      this.availableWorkers.push(worker);
    }
  }

  async *mapUnordered<TInput, TResult>(
    dataArray: TInput[],
    task: (input: TInput) => Promise<TResult>,
    onItemResult?: (itemResult: TResult, itemInput: TInput) => void,
    onItemError?: (error: string, itemInput: TInput) => void,
  ): AsyncGenerator<TResult> {
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
      yield result.result;
    }
  }

  private processQueue() {
    while (this.availableWorkers.length > 0 && this.taskQueue.length > 0) {
      const worker = this.availableWorkers.shift()!;
      const task = this.taskQueue.shift()!;

      this.tasksInProcess.set(worker, task.data);
      worker.send({ taskFunctionString: task.taskFunctionString, inputData: task.data });
    }
  }

  close() {
    for (const worker of this.workers) {
      worker.kill();
    }
  }
}
