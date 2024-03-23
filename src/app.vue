<script setup lang="ts">

import { onMounted } from "vue";
import ConfigEditor from "@/components/config-editor/config-editor.vue";
import { useSimulation } from "@/hooks/use-simulation";
import type { ViewMode } from "@/store/config";

const {
  restartSimulation,
  isMode,
} = useSimulation();

const getCanvasStyle = (mode: ViewMode) => {
  return { display: isMode(mode) ? 'block' : 'none' };
}

onMounted(() => {
  restartSimulation();
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
