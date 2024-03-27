<script setup lang="ts">

import ConfigSection from '@/components/config-editor/components/config-section.vue';
import { useConfigStore } from '@/store/config';
import ConfigMatrix from '@/components/config-editor/components/config-matrix.vue';
import ConfigList from '@/components/config-editor/components/config-list.vue';
import { inject } from "vue";
import { createBaseTypesConfig } from "@/lib/config/types";
import { PROVIDED_TOGGLE_RANDOMIZE_CONFIG } from "@/components/config-editor/constants";
import { useSimulationStore } from "@/store/simulation";

const configStore = useConfigStore();
const typesConfig = configStore.typesConfig;
const typesSymmetricConfig = configStore.typesSymmetricConfig;

const {
  clearAtoms,
  refillAtoms,
} = useSimulationStore();

const setDefaultTypesConfig = () => {
  if (!confirm('Are you sure?')) {
    return;
  }

  const defaultConfig = createBaseTypesConfig();

  if (defaultConfig.COLORS.length !== typesConfig.COLORS.length) {
    defaultConfig.COLORS = typesConfig.COLORS;
  }

  if (defaultConfig.FREQUENCIES.length !== typesConfig.FREQUENCIES.length) {
    clearAtoms!(true);
    configStore.setDefaultTypesConfig();
    refillAtoms!(true);
  } else {
    configStore.setDefaultTypesConfig();
  }
};

const toggleRandomizeConfig = inject<() => boolean>(PROVIDED_TOGGLE_RANDOMIZE_CONFIG);
const refill = () => {
  if (confirm('Are you sure?')) {
    refillAtoms!();
  }
};

</script>

<template>
  <config-section>
    <template #body>
      <div class="btn-group" role="group">
        <button class="btn btn-outline-secondary" @click="toggleRandomizeConfig">Randomize</button>
        <button class="btn btn-outline-secondary" @click="setDefaultTypesConfig">Default</button>
        <button class="btn btn-outline-secondary" @click="refill">Refill</button>
        <button class="btn btn-outline-secondary" @click="configStore.appendType">Add type</button>
      </div>
      <config-list
        name="Initial Frequencies"
        :values="typesConfig.FREQUENCIES"
        :colors="typesConfig.COLORS"
        :step="0.1"
      />
      <config-matrix
        name="Gravity"
        :values="typesConfig.GRAVITY"
        :colors="typesConfig.COLORS"
        :step="0.1"
        v-model:symmetric="typesSymmetricConfig.GRAVITY_MATRIX_SYMMETRIC"
      />
      <config-matrix
        name="Link Gravity"
        :values="typesConfig.LINK_GRAVITY"
        :colors="typesConfig.COLORS"
        :step="0.1"
        v-model:symmetric="typesSymmetricConfig.LINK_GRAVITY_MATRIX_SYMMETRIC"
      />
      <config-list
        name="Links"
        :values="typesConfig.LINKS"
        :colors="typesConfig.COLORS"
        :step="1"
        :min="0"
      />
      <config-matrix
        name="Type Links"
        :values="typesConfig.TYPE_LINKS"
        :colors="typesConfig.COLORS"
        :step="1"
        :min="0"
        v-model:symmetric="typesSymmetricConfig.LINK_TYPE_MATRIX_SYMMETRIC"
      />
      <config-matrix
        name="Links Distance Factor"
        :values="typesConfig.LINK_FACTOR_DISTANCE"
        :colors="typesConfig.COLORS"
        :step="0.1"
        :min="0"
        v-model:symmetric="typesSymmetricConfig.LINK_FACTOR_DISTANCE_MATRIX_SYMMETRIC"
      />
    </template>
  </config-section>
</template>

<style scoped lang="scss">

@import "../assets/config-editor.scss";

</style>
