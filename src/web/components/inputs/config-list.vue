<script setup lang="ts">

import { getColorString } from '@/web/components/config-editor/utils';

withDefaults(defineProps<{
  colors: [number, number, number][];
  values: number[];
  min?: number;
  max?: number;
  step?: number;
  colorTitle?: string;
  colorCursor?: string;
}>(), {
  step: 1,
  colorTitle: '',
  colorCursor: 'default',
});

const emit = defineEmits<{
  colorClick: [index: number];
}>();

</script>

<template>
  <table>
    <tbody>
      <tr>
        <td style="width: 30px"></td>
        <td
          v-for="(color, index) in colors"
          :style="{ backgroundColor: getColorString(color), cursor: colorCursor }"
          :title="colorTitle"
          @click="emit('colorClick', index)"
        >
          &nbsp;
        </td>
      </tr>
      <tr>
        <td style="width: 30px"></td>
        <td v-for="(_, index) in values">
          <input type="number" v-model="values[index]" :step="step" :min="min" :max="max">
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped lang="scss">

@use "../config-editor/assets/config-editor";

</style>
