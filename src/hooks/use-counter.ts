import { computed, type ComputedRef, ref, watch } from "vue";

export const useCounter = (defaultValue: number = 0, onChange?: (value: number) => void) => {
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
