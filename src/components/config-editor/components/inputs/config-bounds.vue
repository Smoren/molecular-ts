<script setup lang="ts">

withDefaults(defineProps<{
  values: [number, number, number?];
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
    <div>
      {{ name }}
    </div>
    <table>
      <tr>
        <td>min</td>
        <td>max</td>
        <td v-if="values[2] !== undefined" width="33%">step</td>
      </tr>
      <tr>
        <td>
          <input type="number" v-model="values[0]" :step="step" :min="min" :max="max">
        </td>
        <td>
          <input type="number" v-model="values[1]" :step="step" :min="min" :max="max">
        </td>
        <td v-if="values[2] !== undefined">
          <input type="number" v-model="values[2]" :min="0" :max="values[1] - values[0]">
        </td>
      </tr>
    </table>
  </div>
</template>

<style scoped lang="scss">

@import "../../assets/config-editor";

</style>
