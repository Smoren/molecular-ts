<script setup lang="ts">

import { useConfigStore } from "@/store/config";
import ConfigCoordBounds from "@/components/config-editor/components/config-coord-bounds.vue";
import ConfigSection from "@/components/config-editor/components/config-section.vue";
import { inject } from "vue";
import { PROVIDED_REFILL_ATOMS } from "@/components/config-editor/constants";

withDefaults(defineProps<{
  withButtons?: boolean;
}>(), {
  withButtons: true,
});

const configStore = useConfigStore();
const { initialConfig } = configStore;

const refillAtoms = inject<(globally?: boolean) => void>(PROVIDED_REFILL_ATOMS);
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
        <div>Atoms Count</div>
        <input type="number" v-model="initialConfig.ATOMS_COUNT" :min="1" :step="1" />
      </div>
      <config-coord-bounds name="Min Position" :step="1" :values="initialConfig.MIN_POSITION" />
      <config-coord-bounds name="Max Position" :step="1" :values="initialConfig.MAX_POSITION" />
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

@import "../assets/config-editor.scss";

</style>
