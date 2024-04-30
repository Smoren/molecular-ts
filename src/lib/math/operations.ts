export function arrayUnaryOperation<T>(
  input: Array<T>,
  operator: (item: T) => T,
): Array<T> {
    const result: Array<T> = [];

    for (const item of input) {
        result.push(operator(item));
    }

    return result;
}

export function arrayBinaryOperation<T>(
  lhs: Array<T>,
  rhs: Array<T>,
  operator: (lhs: T, rhs: T) => T,
): Array<T> {
    const result: Array<T> = [];
    const len = Math.min(lhs.length, rhs.length);

    for (let i=0; i<len; ++i) {
        result.push(operator(lhs[i], rhs[i]));
    }

    return result;
}
