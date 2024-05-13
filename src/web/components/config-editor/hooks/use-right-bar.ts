import { ref, type Ref } from 'vue';
import { useSwitch } from '@/web/hooks/use-switch';

export const useRightBar = () => {
  const rightBarVisible = useSwitch(false);
  const rightBarModeMap = {
    RANDOMIZE: 1,
    SUMMARY: 2,
  };

  const rightBarMode: Ref<number> = ref(rightBarModeMap.RANDOMIZE);

  const toggleRightBar = (mode: number): boolean => {
    if (mode !== rightBarMode.value || !rightBarVisible.state.value) {
      rightBarMode.value = mode;
      rightBarVisible.on();
      return true;
    } else {
      rightBarVisible.off();
      return false;
    }
  };

  return {
    rightBarVisible,
    rightBarMode,
    rightBarModeMap,
    toggleRightBar,
  };
}
