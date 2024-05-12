<script setup lang="ts">

import { useConfigStore } from "@/store/config";
import { useSimulationStore } from "@/store/simulation";
import ConfigCoordsBounds from "@/components/config-editor/components/inputs/config-coords-bounds.vue";
import ConfigSection from "@/components/config-editor/components/containers/config-section.vue";
import InputHeader from "@/components/config-editor/components/base/input-header.vue";
import type { InitialConfig } from "@/lib/types/config";
import { ref, type Ref, watch } from "vue";
import { getViewModeConfig } from "@/lib/utils/functions";

withDefaults(defineProps<{
  withButtons?: boolean;
  withTitle?: boolean;
}>(), {
  withButtons: true,
  withTitle: true,
});

const configStore = useConfigStore();
const { refillAtoms } = useSimulationStore();

const getActualInitialConfig = () => {
  return getViewModeConfig(configStore.worldConfig).INITIAL;
}

const initialConfig: Ref<InitialConfig> = ref(getActualInitialConfig());

watch(() => configStore.worldConfig.VIEW_MODE, () => {
  initialConfig.value = getActualInitialConfig();
});

watch(() => configStore.worldConfig, () => {
  initialConfig.value = getActualInitialConfig();
}, { deep: true });

const refill = () => {
  if (confirm('Are you sure?')) {
    refillAtoms!();
  }
};

</script>

<template>
  <config-section>
    <template #title v-if="withTitle">
      Initial Params
    </template>
    <template #body>
      <div>
        <input-header name="Atoms Count" />
      </div>
      <div>
        <input type="number" v-model="initialConfig.ATOMS_COUNT" :min="1" :step="1" />
      </div>

      <div>
        <input-header name="Min Position" />
        <config-coords-bounds name="Min Position" :step="1" :values="initialConfig.MIN_POSITION" />
      </div>
      <div>
        <input-header name="Max Position" />
        <config-coords-bounds name="Max Position" :step="1" :values="initialConfig.MAX_POSITION" />
      </div>

      <div v-if="withButtons">
        <br />
        <div class="btn-group" role="group">
          <button class="btn btn-outline-secondary" @click="refill">
            Refill
          </button>
        </div>
      </div>
    </template>
  </config-section>
</template>

<style scoped lang="scss">

@import "../../assets/config-editor";

</style>
