import { computed, type ComputedRef, type Ref, ref, watch } from "vue";

export type SwitchInterface = {
    state: Ref<boolean>;
    on: () => void;
    off: () => void;
    toggle: () => void;
    affecting: (action: () => void | Promise<void>, throwIfError?: boolean) => Promise<void>;
    getState: () => ComputedRef<boolean>;
}

export const useSwitch = (defaultValue: boolean, onChange?: (value: boolean) => void): SwitchInterface => {
  const state = ref(defaultValue);

  const on = (): void => {
    state.value = true;
  };

  const off = (): void => {
    state.value = false;
  };

  const affecting = async (action: () => void | Promise<void>, throwIfError = true): Promise<void> => {
    try {
      on();
      await action();
    } catch (e) {
      if (throwIfError) throw e;
    } finally {
      off();
    }
  };

  const toggle = (): void => {
    state.value = !state.value;
  };

  const getState = (): ComputedRef<boolean> => {
    return computed(() => state.value);
  }

  watch(state, (value) => {
    if (typeof onChange === "function") {
      onChange(value);
    }
  });

  return {
    state,
    on,
    off,
    toggle,
    affecting,
    getState,
  };
};
