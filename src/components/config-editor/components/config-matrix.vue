<script setup lang="ts">

import { getColorString } from '@/components/config-editor/helpers/utils';

const props = withDefaults(defineProps<{
  colors: [number, number, number][];
  values: number[][];
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
    <div style="text-align: center"> {{ name }} </div>
    <table>
      <tr>
        <td></td>
        <td v-for="color in colors" :style="{ backgroundColor: getColorString(color) }">
          &nbsp;
        </td>
      </tr>
      <tr v-for="(row, rowIndex) in values">
        <td :style="{ backgroundColor: getColorString(colors[rowIndex]), width: '30px' }"></td>
        <td v-for="(_, colIndex) in row">
          <input type="number" v-model="row[colIndex]" :min="min" :max="max" :step="step">
        </td>
      </tr>
    </table>
  </div>
</template>

<style scoped lang="scss">

@import "../assets/config-editor.scss";

</style>
