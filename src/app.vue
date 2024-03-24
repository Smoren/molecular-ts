<script setup lang="ts">

import { onMounted, provide } from "vue";
import ConfigEditor from "@/components/config-editor/config-editor.vue";
import { useSimulation } from "@/hooks/use-simulation";
import { useConfigStore, type ViewMode } from "@/store/config";
import { PROVIDED_CLEAR_ATOMS, PROVIDED_REFILL_ATOMS } from "@/components/config-editor/constants";

const configStore = useConfigStore();

const {
  simulation,
  restart,
  clearAtoms,
  refillAtoms,
  isMode,
} = useSimulation();

const getCanvasStyle = (mode: ViewMode) => {
  return { display: isMode(mode) ? 'block' : 'none' };
}

const importDataFromHash = () => {
  const hash = window.location.hash.slice(1);
  if (hash) {
    configStore.importConfig(hash);
  }
}

onMounted(() => {
  importDataFromHash();
  restart();
});

provide<(globally?: boolean) => void>(PROVIDED_CLEAR_ATOMS, clearAtoms);
provide<(globally?: boolean) => void>(PROVIDED_REFILL_ATOMS, refillAtoms);

</script>

<template>
  <config-editor />
  <canvas id="canvas3d" class="canvas" :style="getCanvasStyle('3d')"></canvas>
  <canvas id="canvas2d" class="canvas" :style="getCanvasStyle('2d')"></canvas>
</template>

<style scoped lang="scss">

.canvas {
  border: 1px solid black !important;
  width: 100%;
  height: 100%;
}

</style>
