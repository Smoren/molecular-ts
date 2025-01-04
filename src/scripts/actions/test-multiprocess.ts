import { Pool } from '../lib/multiprocess/pool';
import { infinite, single } from "itertools-ts";

export const actionTestMultiprocess = async () => {
  const pool = new Pool(3); // Пул из 4 воркеров
  const data = [[1], [2], [3], [4], [5]]; // Входные данные
  // const data = [...single.limit(infinite.count(), 1000)].map((x) => [x]); // Входные данные

  // Задача для выполнения воркером
  const task = async (input: number[]) => {
    let r = 0;
    for (let i = 0; i < 1000000000; ++i) {
      r += input[0] ** 2;
    }
    return r;
  };

  // Обработчики успеха и ошибки выполнения задачи воркером
  const onItemSuccess = (itemResult: any, itemInput: any) =>
    console.log('itemResult', itemResult, itemInput);

  const onItemError = (error: any, itemInput: any) =>
    console.warn('itemError', error, itemInput);

  // Выполнение задач с помощью пула воркеров
  const result: any[] = [];

  for await (const itemResult of pool.map(data, task, onItemSuccess, onItemError)) {
    result.push(itemResult);
  }
  console.log('Результат:', result);

  pool.close(); // Закрываем пул воркеров после завершения
};
