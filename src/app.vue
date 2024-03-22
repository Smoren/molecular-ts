<script setup lang="ts">

import { onMounted } from "vue";
import NavComponent from "@/components/nav.vue";
import { Simulation } from "@/lib/simulation";
import { create3dRandomDistribution } from "@/lib/config/atoms";
import { create3dDrawer } from "@/lib/drawer/3d";
import { useConfigStore } from '@/store/config';

const config = useConfigStore();
const {
  worldConfig,
  typesConfig,
  initialConfig,
} = config.getConfigValues();

let simulation: Simulation | null = null;

onMounted(() => {
  simulation = new Simulation({
    worldConfig: worldConfig,
    typesConfig: typesConfig,
    initialConfig: initialConfig,
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
