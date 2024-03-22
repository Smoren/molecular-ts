<script setup lang="ts">

import { onMounted } from "vue";
import NavComponent from "@/components/nav.vue";
import { Simulation } from "@/lib/simulation";
import { create3dRandomDistribution } from "@/lib/config/atoms";
import { create3dDrawer } from "@/lib/drawer/3d";
import { useConfig } from "@/hooks/use-config";

const config = useConfig();
let simulation: Simulation | null = null;

onMounted(() => {
  simulation = new Simulation({
    worldConfig: config.worldConfig,
    typesConfig: config.typesConfig,
    initialConfig: config.initialConfig,
    atomsFactory: create3dRandomDistribution,
    drawer: create3dDrawer('canvas', config.worldConfig, config.typesConfig),
  });
  simulation.start();
});

</script>

<template>
  <nav-component />
  <canvas id="canvas"></canvas>
</template>

<style scoped lang="scss">

#canvas {
  border: 1px solid black;
  width: 100%;
  height: 100%;
}

</style>
