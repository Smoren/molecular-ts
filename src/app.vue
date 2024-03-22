<script setup lang="ts">

import { onMounted, type Ref, ref } from "vue";
import ConfigEditor from "@/components/config-editor/config-editor.vue";
import { Simulation } from "@/lib/simulation";
import { create2dRandomDistribution, create3dRandomDistribution } from "@/lib/config/atoms";
import { create3dDrawer } from "@/lib/drawer/3d";
import { useConfigStore } from '@/store/config';
import { create2dDrawer } from "@/lib/drawer/2d";
import { create2dBaseInitialConfig, create3dBaseInitialConfig } from "@/lib/config/initial";

const config = useConfigStore();
const {
  worldConfig,
  typesConfig,
  initialConfig,
} = config.getConfigValues();
const viewMode: Ref<'2d' | '3d'> = ref('3d');

let simulation2d: Simulation | null = null;
let simulation3d: Simulation | null = null;

const start3dSimulation = () => {
  if (simulation2d) {
    simulation2d.stop();
  }

  config.setInitialConfig(create3dBaseInitialConfig());

  if (!simulation3d) {
    simulation3d = new Simulation({
      worldConfig: worldConfig,
      typesConfig: typesConfig,
      initialConfig: initialConfig,
      atomsFactory: create3dRandomDistribution,
      drawer: create3dDrawer('canvas3d', config.worldConfig, config.typesConfig),
    });
  }

  console.log('initialConfig', initialConfig);
  simulation3d.start();
};

const start2dSimulation = () => {
  if (simulation3d) {
    simulation3d.stop();
  }

  config.setInitialConfig(create2dBaseInitialConfig());

  if (!simulation2d) {
    simulation2d = new Simulation({
      worldConfig: worldConfig,
      typesConfig: typesConfig,
      initialConfig: initialConfig,
      atomsFactory: create2dRandomDistribution,
      drawer: create2dDrawer('canvas2d', config.worldConfig, config.typesConfig),
    });
  }

  console.log('initialConfig', initialConfig);
  simulation2d.start();
};

const restartSimulation = (mode: '2d' | '3d' = viewMode.value) => {
  viewMode.value = mode;
  if (mode === '3d') {
    start3dSimulation();
  } else {
    start2dSimulation();
  }
};

onMounted(() => {
  restartSimulation();
});

</script>

<template>
  <config-editor @change-view-mode="restartSimulation" />
  <canvas id="canvas3d" class="canvas" :style="{ display: viewMode === '3d' ? 'block' : 'none' }"></canvas>
  <canvas id="canvas2d" class="canvas" :style="{ display: viewMode === '2d' ? 'block' : 'none' }"></canvas>
</template>

<style scoped lang="scss">

.canvas {
  border: 1px solid black !important;
  width: 100%;
  height: 100%;
}

</style>
