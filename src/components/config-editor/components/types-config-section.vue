<script setup lang="ts">

import ConfigSection from '@/components/config-editor/components/config-section.vue';
import { useConfigStore } from '@/store/config';
import ConfigMatrix from '@/components/config-editor/components/config-matrix.vue';
import ConfigList from '@/components/config-editor/components/config-list.vue';
import { inject } from "vue";

const configStore = useConfigStore();
const typesConfig = configStore.typesConfig;

const randomizeTypesConfig = () => {
  if (!confirm('Are you sure?')) {
    return;
  }
  configStore.randomizeTypesConfig();
};

const setDefaultTypesConfig = () => {
  if (!confirm('Are you sure?')) {
    return;
  }
  configStore.setDefaultTypesConfig();
};

const refillAtoms = inject<(globally?: boolean) => void>('refill');
const refill = () => {
  if (confirm('Are you sure?')) {
    refillAtoms!();
  }
};

const openRandomizeConfig = inject<() => void>('openRandomizeConfig');

</script>

<template>
  <config-section>
    <template #body>
      <div class="btn-group" role="group">
        <button class="btn btn-outline-secondary" @click="randomizeTypesConfig">Randomize</button>
        <button class="btn btn-outline-secondary" @click="openRandomizeConfig">Config Randomize</button>
        <button class="btn btn-outline-secondary" @click="setDefaultTypesConfig">Default</button>
        <button class="btn btn-outline-secondary" @click="refill">Refill</button>
      </div>
      <config-list name="Initial Frequencies" :values="typesConfig.FREQUENCIES" :colors="typesConfig.COLORS" :step="0.1" />
      <config-matrix name="Gravity" :values="typesConfig.GRAVITY" :colors="typesConfig.COLORS" :step="0.1" />
      <config-matrix name="Link Gravity" :values="typesConfig.LINK_GRAVITY" :colors="typesConfig.COLORS" :step="0.1" />
      <config-list name="Links" :values="typesConfig.LINKS" :colors="typesConfig.COLORS" :step="1" :min="0" />
      <config-matrix name="Type Links" :values="typesConfig.TYPE_LINKS" :colors="typesConfig.COLORS" :step="1" :min="0" :symmetric="true" />
      <config-matrix name="Links Distance Factor" :values="typesConfig.LINK_FACTOR_DISTANCE" :colors="typesConfig.COLORS" :step="0.1" :min="0" />
    </template>
  </config-section>
</template>

<style scoped lang="scss">

@import "../assets/config-editor.scss";

</style>
