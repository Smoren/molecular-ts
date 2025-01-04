import { fork, ChildProcess } from 'child_process';
import * as path from 'path';
import { EventEmitter } from 'events';

interface Task {
  id: number;
  input: any;
  taskCode: string;
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}

export class Pool {
  private workers: ChildProcess[] = [];
  private idleWorkers: ChildProcess[] = [];
  private taskQueue: Task[] = [];
  private currentTaskId: number = 0;
  private tasksInProgress: Map<number, { worker: ChildProcess, task: Task }> = new Map();

  constructor(numWorkers: number) {
    for (let i = 0; i < numWorkers; i++) {
      this.addWorker();
    }
  }

  private addWorker() {
    const workerPath = path.resolve(__dirname, './worker.js');
    const worker = fork(workerPath);

    worker.on('message', (msg) => {
      this.onWorkerMessage(worker, msg);
    });

    worker.on('exit', (code, signal) => {
      console.log(`Воркер завершил работу: код ${code}, сигнал ${signal}`);
      this.workers = this.workers.filter(w => w !== worker);
      this.idleWorkers = this.idleWorkers.filter(w => w !== worker);
      this.reassignTasks(worker);
      // this.addWorker(); // Создаем нового воркера вместо завершившего
    });

    this.workers.push(worker);
    this.idleWorkers.push(worker);
    this.processQueue(); // Обрабатываем очередь задач, если есть
  }

  private reassignTasks(worker: ChildProcess) {
    // Переназначаем задачи от завершившего воркера обратно в очередь
    for (let [taskId, { worker: w, task }] of this.tasksInProgress.entries()) {
      if (w === worker) {
        this.taskQueue.unshift(task);
        this.tasksInProgress.delete(taskId);
      }
    }
  }

  private onWorkerMessage(worker: ChildProcess, msg: any) {
    const { taskId, result, error } = msg;

    const taskInfo = this.tasksInProgress.get(taskId);

    if (!taskInfo) {
      // Задача не найдена
      return;
    }

    const { task } = taskInfo;

    if (error) {
      task.reject(error);
    } else {
      task.resolve(result);
    }

    this.tasksInProgress.delete(taskId);
    this.idleWorkers.push(worker);
    this.processQueue();
  }

  private processQueue() {
    while (this.idleWorkers.length > 0 && this.taskQueue.length > 0) {
      const worker = this.idleWorkers.shift()!;
      const task = this.taskQueue.shift()!;
      this.currentTaskId += 1;
      const taskId = this.currentTaskId;

      this.tasksInProgress.set(taskId, { worker, task });

      worker.send({
        taskId,
        taskCode: task.taskCode,
        input: task.input
      });
    }
  }

  async *map(
    data: any[],
    task: Function,
    onItemSuccess: (itemResult: any, itemInput: any) => void,
    onItemError: (error: any, itemInput: any) => void,
  ) {
    const taskCode = task.toString();

    let remainingTasks = data.length;
    const resultsQueue: any[] = [];
    const eventEmitter = new EventEmitter();

    data.forEach((input, id) => {
      const taskItem: Task = {
        id,
        input,
        taskCode,
        resolve: (result) => {
          onItemSuccess(result, input);
          resultsQueue.push(result);
          eventEmitter.emit('result');
          remainingTasks--;
        },
        reject: (error) => {
          onItemError(error, input);
          eventEmitter.emit('result');
          remainingTasks--;
        },
      };
      this.taskQueue.push(taskItem);
    });

    this.processQueue();

    while (remainingTasks > 0) {
      if (resultsQueue.length > 0) {
        const result = resultsQueue.shift();
        yield result;
      } else {
        await new Promise((resolve) => {
          eventEmitter.once('result', resolve);
        });
      }
    }
  }

  close() {
    for (let worker of this.workers) {
      worker.kill();
    }
  }
}
