import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useLeftBarStore = defineStore('leftBar', () => {
  const isOpened = ref(false);

  const open = (): boolean => {
    const result = isOpened.value;
    isOpened.value = true;
    return result;
  };

  const close = (): void => {
    isOpened.value = false;
  };

  const toggle = (): void => {
    if (!open()) {
      close();
    }
  };

  return {
    isOpened,
    open,
    close,
    toggle,
  };
});
