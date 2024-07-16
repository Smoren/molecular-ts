<script setup lang="ts">

import { getColorString } from "@/web/components/config-editor/utils";
import { computed } from "vue";

const modelValue = defineModel<number>();
const props = defineProps<{
  colors: [number, number, number][];
}>();

const selectedColor = computed(() => {
  const value = modelValue.value === undefined ? 0 : modelValue.value;
  return getColorString(props.colors[value]);
});

</script>

<template>
  <div class="type-select">
    <select v-model="modelValue" :style="{ backgroundColor: selectedColor }">
      <option v-for="(color, index) in colors" :key="index" :value="index" :style="{ color: getColorString(color), backgroundColor: getColorString(color) }">
        &nbsp;
      </option>
    </select>
  </div>
</template>

<style scoped lang="scss">

.type-select select {
  width: 50px;
  height: 30px;
}

</style>
