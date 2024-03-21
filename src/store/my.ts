import { type Ref, ref } from "vue";
import { defineStore } from "pinia";

export const useMyStore = defineStore("my", () => {
  const test: Ref<string | null> = ref(null);

  const setTest = (value: string) => {
    test.value = value;
  };

  return {
    test,
    setTest,
  };
});
