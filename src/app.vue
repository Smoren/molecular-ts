<script setup lang="ts">

import { onMounted } from "vue";
import ConfigEditor from "@/components/config-editor/config-editor.vue";
import { useConfigStore, type ViewMode } from "@/store/config";
import { useSimulationStore } from "@/store/simulation";

const configStore = useConfigStore();

const {
  simulation,
  restart,
  isMode,
} = useSimulationStore();

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
