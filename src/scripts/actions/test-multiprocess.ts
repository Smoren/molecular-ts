import { infinite, single } from "itertools-ts";
import { Pool } from "multiprocessor";

export const actionTestMultiprocess = async () => {
  const ts = Date.now();
  const pool = new Pool(16); // Pool with 4 workers
  // const data = [[1], [2], [3], [4], [5]]; // Input data
  const data = [...single.limit(infinite.count(), 100)].map((x) => [x]); // Входные данные

  // Task to be executed by the worker
  const task = async (input: number[]) => {
    let r = 0;
    for (let i = 0; i < 1000000000; ++i) {
      r += input[0] ** 2;
    }
    if (Math.random() > 0.9) {
      throw new Error('Random error');
    }
    return r;
  };

  const onItemResult = (itemResult: number, itemInput: number[], taskIndex: number) => {
    console.log('itemResult', itemResult, itemInput, taskIndex);
  };
  const onItemError = (error: string, itemInput: number[], taskIndex: number) => {
    console.log('itemError', error, itemInput, taskIndex);
  };

  const result = [];
  for (const itemResult of await pool.map(data, task, onItemResult, onItemError)) {
    result.push(itemResult);
  }
  console.log('Final Result:', result);
  console.log('Final Result Length:', result.length);
  pool.close(); // Clean up worker processes

  console.log(`Time elapsed: ${Date.now() - ts} ms`);
};
