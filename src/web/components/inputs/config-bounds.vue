<script setup lang="ts">

import { useI18nStore } from "@/web/store/i18n";

const i18n = useI18nStore();

withDefaults(defineProps<{
  values: [number, number, number?, number?];
  min?: number;
  max?: number;
  step?: number;
}>(), {
  step: 1,
});

</script>

<template>
  <table>
    <tbody>
      <tr>
        <td>{{ i18n.t('min') }}</td>
        <td>{{ i18n.t('max') }}</td>
        <td>{{ i18n.t('median') }}</td>
        <td v-if="values[3] !== undefined" width="25%">{{ i18n.t('step') }}</td>
      </tr>
      <tr>
        <td>
          <input type="number" v-model="values[0]" :step="step" :min="min" :max="max">
        </td>
        <td>
          <input type="number" v-model="values[1]" :step="step" :min="min" :max="max">
        </td>
        <td>
          <input type="number" v-model="values[2]" :step="0.1" :min="min" :max="max">
        </td>
        <td v-if="values[3] !== undefined">
          <input type="number" v-model="values[3]" :step="0.1" :min="0" :max="values[1] - values[0]">
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped lang="scss">

@use "../config-editor/assets/config-editor";

</style>
