<script setup lang="ts">

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
    <tr>
      <td>min</td>
      <td>max</td>
      <td>median</td>
      <td v-if="values[3] !== undefined" width="25%">step</td>
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
  </table>
</template>

<style scoped lang="scss">

@import "../../assets/config-editor";

</style>
