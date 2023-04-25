type NonUndefined<T> = T extends undefined ? never : T;

export class Swarm<T extends NonUndefined<unknown>> implements Iterable<T> {
  private readonly storage: T[];
  private readonly stack: number[] = [];
  private count: number = 0;

  constructor(items: T[] = []) {
    this.storage = items;
  }

  get length(): number {
    return this.count;
  }

  get nextKey(): number {
    if (this.stack.length) {
      return this.stack[this.stack.length-1];
    }
    return this.storage.length;
  }

  push(item: T): number {
    const index = this.stack.length ? this.stack.pop() : this.storage.length;
    this.storage[index] = item;
    this.count++;
    return index;
  }

  pop(index: number): T|undefined {
    const result = this.storage[index];
    if (result !== undefined) {
      delete this.storage[index];
      this.count--;
    }
    return result;
  }

  has(index: number): boolean {
    return this.storage[index] !== undefined;
  }

  get(index: number): T|undefined {
    return this.storage[index];
  }

  * [Symbol.iterator](): Iterator<T> {
    for (const item of this.storage) {
      if (item !== undefined) {
        yield item;
      }
    }
  }
}
