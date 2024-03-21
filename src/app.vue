<script setup lang="ts">

import { MODE } from "@/lib/example/config/initial";
import { startSimulation } from "@/lib/example/choice";
import { onMounted } from "vue";

const DIMENSIONS = 2;
const CURRENT_MODE = MODE.CONST_TYPES;

onMounted(() => {
  startSimulation(DIMENSIONS, CURRENT_MODE);
});

</script>

<template>

  <canvas id="canvas"></canvas>

</template>

<style scoped lang="scss">

#canvas {
  border: 1px solid black;
  width: 100%;
  height: 100%;
}

</style>
