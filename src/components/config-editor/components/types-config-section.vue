<script setup lang="ts">

import ConfigSection from '@/components/config-editor/components/config-section.vue';
import { useConfigStore } from '@/store/config';
import ConfigMatrix from '@/components/config-editor/components/config-matrix.vue';
import ConfigList from '@/components/config-editor/components/config-list.vue';

const {
  typesConfig,
} = useConfigStore();

const getColorString = (color: [number, number, number]) => {
  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
};

</script>

<template>
  <config-section>
    <template #title>
      Types
    </template>
    <template #body>
      <config-matrix name="Gravity" :values="typesConfig.GRAVITY" :colors="typesConfig.COLORS" step="0.1" />
      <config-matrix name="Link Gravity" :values="typesConfig.LINK_GRAVITY" :colors="typesConfig.COLORS" step="0.1" />
      <config-matrix name="Type Links" :values="typesConfig.TYPE_LINKS" :colors="typesConfig.COLORS" step="1" min="0" />
      <config-list name="Links" :values="typesConfig.LINKS" :colors="typesConfig.COLORS" step="1" min="0" />
      <config-matrix name="Type Links" :values="typesConfig.TYPE_LINKS" :colors="typesConfig.COLORS" step="1" min="0" />
      <config-matrix name="Links Distance Factor" :values="typesConfig.LINK_FACTOR_DISTANCE" :colors="typesConfig.COLORS" step="0.1" min="0" />
    </template>
  </config-section>
</template>

<style scoped lang="scss">

@import "../assets/config-editor.scss";

</style>
