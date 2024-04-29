<script setup lang="ts">

import { ref, type Ref, watch } from "vue";
import type { ViewMode } from "@/lib/types/config";
import { useConfigStore } from "@/store/config";
import { useSimulationStore } from "@/store/simulation";

const configStore = useConfigStore();
const simulation = useSimulationStore();
const viewMode: Ref<ViewMode> = ref(configStore.worldConfig.VIEW_MODE);

watch(() => configStore.worldConfig.VIEW_MODE, () => {
  viewMode.value = configStore.worldConfig.VIEW_MODE;
});

watch(viewMode, async () => {
  if (configStore.worldConfig.VIEW_MODE === viewMode.value) {
    return;
  }
  await simulation.stop();
  configStore.setViewMode(viewMode.value);
  await simulation.restart();
});

</script>

<template>
  <div class="section" style="font-size: 20px">
    <label>
      <input type="radio" name="view-mode" v-model="viewMode" value="3d">
      3D
    </label>
    &nbsp;
    <label>
      <input type="radio" name="view-mode" v-model="viewMode" value="2d">
      2D
    </label>
  </div>
</template>
