<script setup lang="ts">

import { getColorString } from '@/components/config-editor/helpers/utils';

const props = withDefaults(defineProps<{
  colors: [number, number, number][];
  values: number[];
  name: string;
  min?: number;
  max?: number;
  step?: number;
}>(), {
  step: 1,
});

</script>

<template>
  <div>
    <div style="text-align: center">Links</div>
    <table>
      <tr>
        <td style="width: 30px"></td>
        <td v-for="color in colors" :style="{ backgroundColor: getColorString(color) }">
          &nbsp;
        </td>
      </tr>
      <tr>
        <td style="width: 30px"></td>
        <td v-for="(_, index) in values">
          <input type="number" v-model="values[index]" step="1" min="0">
        </td>
      </tr>
    </table>
  </div>
</template>

<style scoped lang="scss">

@import "../assets/config-editor.scss";

</style>
