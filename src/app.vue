<script setup lang="ts">

import { onMounted } from "vue";
import { useConfigStore } from "@/web/store/config";
import { useSimulationStore } from "@/web/store/simulation";
import type { ViewMode } from "@/lib/types/config";
import ConfigEditor from "@/web/components/config-editor/config-editor.vue";

const configStore = useConfigStore();

const { restart, isMode } = useSimulationStore();

const getCanvasStyle = (mode: ViewMode) => {
  return { display: isMode(mode) ? 'block' : 'none' };
}

const importDataFromHash = () => {
  const hash = window.location.hash.slice(1);
  if (hash) {
    configStore.importConfigBase64(hash);
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
