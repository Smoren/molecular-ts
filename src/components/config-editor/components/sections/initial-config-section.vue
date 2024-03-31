<script setup lang="ts">

import { useConfigStore } from "@/store/config";
import { useSimulationStore } from "@/store/simulation";
import ConfigCoordsBounds from "@/components/config-editor/components/inputs/config-coords-bounds.vue";
import ConfigSection from "@/components/config-editor/components/containers/config-section.vue";
import InputHeader from "@/components/config-editor/components/base/input-header.vue";

withDefaults(defineProps<{
  withButtons?: boolean;
}>(), {
  withButtons: true,
});

const configStore = useConfigStore();
const { initialConfig } = configStore;

const {
  refillAtoms,
} = useSimulationStore();

const refill = () => {
  if (confirm('Are you sure?')) {
    refillAtoms!();
  }
};

</script>

<template>
  <config-section>
    <template #title>
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
