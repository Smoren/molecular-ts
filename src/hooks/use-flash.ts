export const useFlash = () => {
  const storage: Record<symbol, unknown> = {};

  const send = <T>(key: symbol, value: T) => {
    storage[key] = value;
  }

  const receive = <T>(key: symbol): T | undefined => {
    const result = storage[key] as T | undefined;
    delete storage[key];
    return result;
  }

  const turnOn = (key: symbol) => {
    storage[key] = true;
  }

  return {
    send,
    receive,
    turnOn,
  }
};
