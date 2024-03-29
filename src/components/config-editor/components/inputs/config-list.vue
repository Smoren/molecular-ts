<script setup lang="ts">

import { getColorString } from '@/components/config-editor/utils';
import InputHeader from "@/components/config-editor/components/base/input-header.vue";

withDefaults(defineProps<{
  colors: [number, number, number][];
  values: number[];
  name: string;
  tooltip?: string;
  min?: number;
  max?: number;
  step?: number;
}>(), {
  step: 1,
});

</script>

<template>
  <div>
    <div style="text-align: center">
      <input-header :name="name" :tooltip="tooltip" />
    </div>
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
          <input type="number" v-model="values[index]" :step="step" :min="min" :max="max">
        </td>
      </tr>
    </table>
  </div>
</template>

<style scoped lang="scss">

@import "../../assets/config-editor";

</style>
