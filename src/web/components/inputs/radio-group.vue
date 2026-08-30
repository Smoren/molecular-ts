<script setup lang="ts">

import { useI18nStore } from "@/web/store/i18n";

const modelValue = defineModel<unknown | undefined>();
const i18n = useI18nStore();

defineProps<{
  options: Record<string, unknown>[];
  titleKey?: string;
  valueKey?: string;
}>();

const emit = defineEmits<{
  change: [value: unknown | undefined];
}>();

</script>

<template>
  <label v-for="item in options">
    <input
      type="radio"
      v-model="modelValue"
      :value="item[valueKey as keyof typeof item]"
      @change="emit('change', modelValue)"
    />
    {{ i18n.t(String(item[titleKey as keyof typeof item] ?? '')) }}
  </label>
</template>

<style scoped lang="scss">
  label {
    margin-right: 12px;
  }
</style>
