<script setup lang="ts">

import ConfigSection from '@/components/config-editor/components/config-section.vue';
import { useConfigStore } from "@/store/config";
import ConfigBounds from "@/components/config-editor/components/config-bounds.vue";
import { computed } from "vue";
import InitialConfigSection from "@/components/config-editor/components/initial-config-section.vue";
import { useSimulationStore } from "@/store/simulation";
import Flag from "@/components/config-editor/components/flag.vue";

const configStore = useConfigStore();
const { randomTypesConfig, initialConfig } = configStore;

const {
  clearAtoms,
  refillAtoms,
} = useSimulationStore();

const needRefill = computed((): boolean => {
  return randomTypesConfig.TYPES_COUNT !== configStore.typesConfig.COLORS.length;
});

const randomizeTypesConfig = () => {
  if (!confirm('Are you sure?')) {
    return;
  }

  if (needRefill.value) {
    clearAtoms!(true);
    configStore.randomizeTypesConfig();
    refillAtoms!(true);
  } else {
    configStore.randomizeTypesConfig();
  }
};

</script>

<template>
  <config-section>
    <template #title>
      Randomize Config
    </template>
    <template #body>
      <div>
        <div>Types Count</div>
        <input type="number" min="0" step="1" v-model="randomTypesConfig.TYPES_COUNT" />
      </div>
      <config-bounds name="Gravity" :step="1" :values="randomTypesConfig.GRAVITY_BOUNDS" />
      <flag title="Symmetric" v-model="randomTypesConfig.GRAVITY_MATRIX_SYMMETRIC" />

      <config-bounds name="Link Gravity" :step="1" :values="randomTypesConfig.LINK_GRAVITY_BOUNDS" />
      <flag title="Symmetric" v-model="randomTypesConfig.LINK_GRAVITY_MATRIX_SYMMETRIC" />

      <config-bounds name="Links Count" :step="1" :values="randomTypesConfig.LINK_BOUNDS" />

      <config-bounds name="Types Links Count" :step="1" :values="randomTypesConfig.LINK_TYPE_BOUNDS" />
      <flag title="Symmetric" v-model="randomTypesConfig.LINK_TYPE_MATRIX_SYMMETRIC" />

      <config-bounds name="Links Distance Factor" :step="1" :values="randomTypesConfig.LINK_FACTOR_DISTANCE_BOUNDS" />
      <flag title="Symmetric" v-model="randomTypesConfig.LINK_FACTOR_DISTANCE_MATRIX_SYMMETRIC" />

      <div v-if="needRefill">
        <br />
        <initial-config-section :with-buttons="false" />
      </div>
      <br />
      <button class="btn btn-outline-primary" @click="randomizeTypesConfig" style="width: 100%;">
        {{ needRefill ? 'Randomize and Refill' : 'Randomize' }}
      </button>
    </template>
  </config-section>
</template>

<style scoped lang="scss">

@import "../assets/config-editor.scss";

</style>
