import { defineStore } from 'pinia';
import type { BarMode } from '@/web/types/nav';
import type { Ref } from 'vue';
import { computed, ref } from 'vue';

export const useNavHistoryStore = defineStore('navHistory', () => {
  const stack: Ref<BarMode[]> = ref([]);

  const push = (mode: BarMode): void => {
    stack.value.push(mode);
  };

  const pop = (): BarMode | undefined => {
    return stack.value.pop();
  };

  const clear = (): void => {
    stack.value.length = 0;
  };

  const last = computed((): BarMode | undefined => stack.value[stack.value.length - 1] ?? undefined);
  const empty = computed((): boolean => !stack.value.length);

  return {
    stack,
    push,
    pop,
    clear,
    last,
    empty,
  };
});
