import { Pool } from '../lib/multiprocess/pool';
import { infinite, single } from "itertools-ts";

export const actionTestMultiprocess = async () => {
  const ts = Date.now();
  const pool = new Pool(12); // Pool with 4 workers
  // const data = [[1], [2], [3], [4], [5]]; // Input data
  const data = [...single.limit(infinite.count(), 100)].map((x) => [x]); // Входные данные

  // Task to be executed by the worker
  const task = async (input: number[]) => {
    let r = 0;
    for (let i = 0; i < 1000000000; ++i) {
      r += input[0] ** 2;
    }
    return r;
  };

  const onItemResult = (itemResult: any, itemInput: any) => {
    console.log('itemResult', itemResult, itemInput);
  };

  const result = [];
  for await (const itemResult of pool.map(data, task, onItemResult)) {
    result.push(itemResult);
  }
  console.log('Final Result:', result);
  pool.close(); // Clean up worker processes

  console.log(`Time elapsed: ${Date.now() - ts} ms`);
};
