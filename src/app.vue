<script setup lang="ts">

import { onMounted } from "vue";
import { useConfigStore } from "@/store/config";
import NavComponent from "@/components/nav.vue";
import { Simulation } from "@/lib/simulation";
import { create3dRandomDistribution } from "@/lib/config/atoms";
import { create3dDrawer } from "@/lib/drawer/3d";
import { create3dSimulationWithConstTypes } from "@/lib/example/variants/3d/const-types-distribution";

const configStore = useConfigStore();
let simulation: Simulation | null = null;

onMounted(() => {
  simulation = create3dSimulationWithConstTypes();
  simulation.start();
  // simulation = new Simulation({
  //   worldConfig: configStore.worldConfig,
  //   typesConfig: configStore.typesConfig,
  //   initialConfig: configStore.initialConfig,
  //   atomsFactory: create3dRandomDistribution,
  //   drawer: create3dDrawer('canvas', configStore.worldConfig, configStore.typesConfig),
  // });
  // simulation.start();
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
