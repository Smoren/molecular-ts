<script setup lang="ts">

import { getColorString } from '@/components/config-editor/helpers/utils';
import { ref, watch } from "vue";

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

const symmetric = ref(false);

const onChangeValue = (i: number, j: number) => {
  if (symmetric.value && i !== j) {
    props.values[j][i] = props.values[i][j];
  }
};

watch(symmetric, (value: boolean) => {
  if (!value) {
    return;
  }

  for (let i = 1; i < props.values.length; ++i) {
    for (let j = 0; j < i; ++j) {
      props.values[i][j] = props.values[j][i];
    }
  }
});

</script>

<template>
  <div>
    <div style="text-align: center"> {{ name }} </div>
    <table>
      <tr>
        <td>
          <input type="checkbox" v-model="symmetric" title="Symmetric" />
        </td>
        <td v-for="color in colors" :style="{ backgroundColor: getColorString(color) }">
          &nbsp;
        </td>
      </tr>
      <tr v-for="(row, rowIndex) in values">
        <td :style="{ backgroundColor: getColorString(colors[rowIndex]), width: '30px' }"></td>
        <td v-for="(_, colIndex) in row">
          <input type="number" v-model="row[colIndex]" :min="min" :max="max" :step="step" @change="onChangeValue(rowIndex, colIndex)">
        </td>
      </tr>
    </table>
  </div>
</template>

<style scoped lang="scss">

@import "../assets/config-editor.scss";

</style>
