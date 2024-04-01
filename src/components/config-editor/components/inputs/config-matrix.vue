<script setup lang="ts">

import { getColorString } from '@/components/config-editor/utils';
import { onMounted, watch } from "vue";
import Tooltip from "@/components/config-editor/components/base/tooltip.vue";

const symmetric = defineModel<boolean | undefined>('symmetric');

const props = withDefaults(defineProps<{
  colors: [number, number, number][];
  values: number[][];
  min?: number;
  max?: number;
  step?: number;
  hideSymmetric?: boolean;
}>(), {
  step: 1,
  hideSymmetric: false,
});

const onChangeValue = (i: number, j: number) => {
  if (symmetric.value && i !== j) {
    props.values[j][i] = props.values[i][j];
  }
};

const applySymmetric = () => {
  if (!symmetric.value) {
    return;
  }

  for (let i = 1; i < props.values.length; ++i) {
    for (let j = 0; j < i; ++j) {
      if (props.values[i][j] !== props.values[j][i]) {
        props.values[i][j] = props.values[j][i];
      }
    }
  }
};

watch(symmetric, () => {
  applySymmetric();
});

</script>

<template>
  <table>
    <tr>
      <td>
        <tooltip text="Make matrix symmetric" :nowrap="true" position="left" v-if="!hideSymmetric">
          <input type="checkbox" v-model="symmetric" title="Symmetric" />
        </tooltip>
      </td>
      <td v-for="color in colors" :style="{ backgroundColor: getColorString(color) }">
        &nbsp;
      </td>
    </tr>
    <tr v-for="(row, rowIndex) in values">
      <td :style="{ backgroundColor: getColorString(colors[rowIndex]), width: '30px' }"></td>
      <td v-for="(_, colIndex) in row">
        <input
          type="number"
          v-model="row[colIndex]"
          :min="min"
          :max="max"
          :step="step"
          @change="onChangeValue(rowIndex, colIndex)"
        />
      </td>
    </tr>
  </table>
</template>

<style scoped lang="scss">

@import "../../assets/config-editor";

</style>
