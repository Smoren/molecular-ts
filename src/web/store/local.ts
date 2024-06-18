import { defineStore } from "pinia";

type StoredData = Record<string, unknown> | unknown[];

export const useLocalStore = defineStore("local", () => {
  const get = (alias: string) => {
    return JSON.parse(localStorage.getItem(alias) as string);
  }

  const set = (alias: string, value: StoredData) => {
    localStorage.setItem(alias, JSON.stringify(value));
  }

  const remove = (alias: string) => {
    localStorage.removeItem(alias);
  }

  const addToArray = (alias: string, value: StoredData): number => {
    const old = (get(alias) ?? []) as unknown[];
    set(alias, [...old, value]);
    return old.length;
  }

  const getFromArray = (alias: string, index: number): StoredData => {
    const old = get(alias);
    return old[index];
  }

  const removeFromArray = (alias: string, index: number) => {
    const old = get(alias);
    set(alias, [...old.slice(0, index), ...old.slice(index + 1)]);
  }

  return {
    set,
    get,
    remove,
    addToArray,
    getFromArray,
    removeFromArray,
  }
});
