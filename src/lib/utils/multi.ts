import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

type TaskFunction<TInput, TResult> = (input: TInput) => Promise<TResult>;
type CallbackFunction<TInput, TResult> = (resultOrError: TResult | Error, input: TInput) => void;

interface PoolOptions {
  maxWorkers?: number;
}

class Pool<TInput, TResult> {
  private maxWorkers: number;
  private workers: Worker[] = [];
  private taskQueue: {
    input: TInput;
    resolve: (value: TResult | PromiseLike<TResult>) => void;
    reject: (reason?: any) => void;
  }[] = [];
  private workerTaskMap = new Map<Worker, TInput>();

  constructor(options: PoolOptions = {}) {
    this.maxWorkers = options.maxWorkers || require('os').cpus().length;
  }

  public async *map(
    data: TInput[],
    task: TaskFunction<TInput, TResult>,
    onItemSuccess: (result: TResult, input: TInput) => void,
    onItemError: (error: Error, input: TInput) => void
  ): AsyncIterable<TResult> {
    if (isMainThread) {
      for (const input of data) {
        const result = new Promise<TResult>((resolve, reject) => {
          this.taskQueue.push({ input, resolve, reject });
          this.executeNextTask(task);
        });

        try {
          const itemResult = await result;
          onItemSuccess(itemResult, input);
          yield itemResult;
        } catch (error) {
          onItemError(error, input);
        }
      }

      await this.terminate();
    } else {
      throw new Error('Map function must be called from the main thread.');
    }
  }

  private executeNextTask(task: TaskFunction<TInput, TResult>) {
    if (this.workers.length < this.maxWorkers && this.taskQueue.length > 0) {
      const { input, resolve, reject } = this.taskQueue.shift()!;

      const worker = new Worker(__filename, {
        workerData: { task: task.toString(), input }
      });

      this.workers.push(worker);
      this.workerTaskMap.set(worker, input);

      worker.on('message', (result: TResult) => {
        this.removeWorker(worker);
        resolve(result);
        this.executeNextTask(task);
      });

      worker.on('error', (error) => {
        this.removeWorker(worker);
        reject(error);
        this.executeNextTask(task);
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
        this.removeWorker(worker);
        this.executeNextTask(task);
      });
    }
  }

  private removeWorker(worker: Worker) {
    this.workers = this.workers.filter((w) => w !== worker);
    this.workerTaskMap.delete(worker);
  }

  private async terminate() {
    for (const worker of this.workers) {
      await worker.terminate();
    }
  }
}

if (!isMainThread) {
  const { task, input } = workerData;

  (async () => {
    try {
      const taskFunction = new Function(`return ${task}`)() as TaskFunction<any, any>;
      const result = await taskFunction(input);
      parentPort?.postMessage(result);
    } catch (error) {
      parentPort?.postMessage({ error: error.message });
    }
  })();
}
