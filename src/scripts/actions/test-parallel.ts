import { Pool } from "multiprocess-pool";

function task(x: number) {
  console.log('start task', x);
  let result = 0;
  for (let i = 1; i < 1000000000 + 100*x; ++i) {
    result += i;
    result /= 2;
  }
  console.log('finish task', x);
  return result;
}

export const actionTestParallel = async (...args: string[]) => {
  console.log('[START] test parallel action', args);

  const pool = new Pool(20);  // spawns 4 child processes to complete your jobs
  const result = await pool.map([1, 2, 3, 4, 5, 6, 7, 8, 9], task);
  console.log(result);

  pool.close();

  console.log('[FINISH]');
}
