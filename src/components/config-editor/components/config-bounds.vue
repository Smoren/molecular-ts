<script setup lang="ts">

const props = withDefaults(defineProps<{
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
    <div>
      {{ name }}
    </div>
    <table>
      <tr>
        <td>min</td>
        <td>max</td>
      </tr>
      <tr>
        <td>
          <input type="number" v-model="values[0]" :step="step" :min="min" :max="max">
        </td>
        <td>
          <input type="number" v-model="values[1]" :step="step" :min="min" :max="max">
        </td>
      </tr>
    </table>
  </div>
</template>

<style scoped lang="scss">

@import "../assets/config-editor.scss";

</style>
