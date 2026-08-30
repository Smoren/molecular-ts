<script setup lang="ts">

import { useI18nStore } from "@/web/store/i18n";

const modelValue = defineModel<unknown | undefined>();
const i18n = useI18nStore();

withDefaults(defineProps<{
  options: Record<string, unknown>[];
  titleKey?: string;
  valueKey?: string;
  width?: string;
  height?: string;
}>(), {
  width: '100%',
  height: '30px',
});

const emit = defineEmits<{
  change: [value: unknown | undefined];
}>();

</script>

<template>
  <select v-model="modelValue" :style="{ width: width, height: height }">
    <option
      v-for="(item, index) in options"
      :key="index"
      :value="item[valueKey as keyof typeof item]"
      @change="emit('change', modelValue)"
    >
      {{ i18n.t(String(item[titleKey as keyof typeof item] ?? '')) }}
    </option>
  </select>
</template>

<style scoped lang="scss">

</style>
