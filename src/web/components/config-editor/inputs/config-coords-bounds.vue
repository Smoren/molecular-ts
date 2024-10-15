<script setup lang="ts">

import { computed } from "vue";

const props = withDefaults(defineProps<{
  values: number[];
  titles?: string[];
  min?: number;
  max?: number;
  step?: number;
}>(), {
  step: 1,
  titles: () => ['x', 'y', 'z'],
});

const emit = defineEmits<{
  change: [values: number[]];
}>();

const emitOnChange = () => {
  emit('change', props.values);
}

const slicedTitles = computed(() => props.titles.slice(0, props.values.length));

</script>

<template>
  <div>
    <table>
      <tr>
        <td v-for="title in slicedTitles">
          {{ title }}
        </td>
      </tr>
      <tr>
        <td v-for="(_, index) in values">
          <input
            type="number"
            v-model="values[index]"
            :step="step"
            :min="min"
            :max="max"
            @input="emitOnChange"
          >
        </td>
      </tr>
    </table>
  </div>
</template>

<style scoped lang="scss">

@import "../assets/config-editor";

</style>
