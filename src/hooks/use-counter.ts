import { computed, type ComputedRef, type Ref, ref, watch } from "vue";

export type CounterInterface = {
    state: Ref<number>;
    increment: () => void;
    decrement: () => void;
    affecting: (action: () => void | Promise<void>, throwIfError?: boolean) => Promise<void>;
    getState: () => ComputedRef<number>;
}

export const useCounter = (defaultValue: number = 0, onChange?: (value: number) => void): CounterInterface => {
  const state = ref(defaultValue);

  const increment = (): void => {
    state.value++;
  };

  const decrement = (): void => {
    state.value--;
  };

  const affecting = async (action: () => void | Promise<void>, throwIfError = true): Promise<void> => {
    try {
      increment();
      await action();
    } catch (e) {
      if (throwIfError) throw e;
    } finally {
      decrement();
    }
  };

  const getState = (): ComputedRef<number> => {
    return computed(() => state.value);
  }

  watch(state, (value) => {
    if (typeof onChange === "function") {
      onChange(value);
    }
  });

  return {
    state,
    increment,
    decrement,
    affecting,
    getState,
  };
};
