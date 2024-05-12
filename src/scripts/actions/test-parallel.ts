import { Pool } from "multiprocess-pool";

function integrateTask([id, funcName, [a, b], columns]: [number, string, [number, number], number]): number {
  console.log(`-> task ${id} started`);
  const ts = Date.now();

  const func = Math[funcName as keyof typeof Math] as (x: number) => number;
  const step = (b - a) / columns;
  let integral = 0;

  for (let i = 0; i < columns; i++) {
    const xLeft = a + i * step;
    const xRight = xLeft + step;
    const height = func((xLeft + xRight) / 2);

    integral += height * step;
  }

  console.log(`<- task ${id} finished in ${Date.now() - ts} ms`);
  return integral;
}

export const actionTestParallel = async (...args: string[]) => {
  console.log('[START] test parallel action', args);
  const ts = Date.now();

  const iterationsCount = 100000000;
  const inputs = [
    [1, 'sin', [0, 1], iterationsCount],
    [2, 'sin', [1, 10], iterationsCount],
    [3, 'sin', [10, 100], iterationsCount],
    [4, 'cos', [0, 1], iterationsCount],
    [5, 'cos', [1, 10], iterationsCount],
    [6, 'cos', [10, 100], iterationsCount],
    [7, 'tan', [0, 1], iterationsCount],
    [8, 'tan', [1, 10], iterationsCount],
    [9, 'tan', [10, 100], iterationsCount],
    [10, 'log', [0.1, 1], iterationsCount],
    [11, 'log', [1, 10], iterationsCount],
    [12, 'log', [10, 100], iterationsCount],
    [13, 'log2', [0.1, 1], iterationsCount],
    [14, 'log2', [1, 10], iterationsCount],
    [15, 'log2', [10, 100], iterationsCount],
    [16, 'log10', [0.1, 1], iterationsCount],
    [17, 'log10', [1, 10], iterationsCount],
    [18, 'log10', [10, 100], iterationsCount],
  ]

  const pool = new Pool(20);
  const result = await pool.map(inputs, integrateTask);
  console.log(result);

  pool.close();

  console.log(`[FINISH] in ${Date.now() - ts} ms`);
}
