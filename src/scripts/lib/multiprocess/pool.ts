import { fork, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import * as path from 'path';

interface TaskMessage {
  taskFunctionString: string;
  data: any;
}

interface ResultMessage {
  result?: any;
  error?: string;
  data: any;
}

export class Pool extends EventEmitter {
  private workers: ChildProcess[] = [];
  private availableWorkers: ChildProcess[] = [];
  private taskQueue: Array<{ data: any; taskFunctionString: string }> = [];
  private tasksInProcess = new Map<ChildProcess, any>();
  private onItemResult?: (itemResult: any, itemInput: any) => void;

  constructor(workerCount: number) {
    super();
    for (let i = 0; i < workerCount; i++) {
      const worker = fork(path.resolve(__dirname, './worker.js'));
      worker.on('message', (message: ResultMessage) => {
        const { result, error, data } = message;
        const itemInput = this.tasksInProcess.get(worker);
        if (this.onItemResult) {
          this.onItemResult(result, itemInput);
        }
        this.emit('result', { result, data: itemInput });
        this.tasksInProcess.delete(worker);
        this.availableWorkers.push(worker);
        this.processQueue();
      });
      this.workers.push(worker);
      this.availableWorkers.push(worker);
    }
  }

  async *map(
    dataArray: any[],
    task: (input: any) => Promise<any>,
    onItemResult?: (itemResult: any, itemInput: any) => void
  ) {
    this.onItemResult = onItemResult;
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
      worker.send({ taskFunctionString: task.taskFunctionString, data: task.data });
    }
  }

  close() {
    for (const worker of this.workers) {
      worker.kill();
    }
  }
}
