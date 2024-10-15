<script setup lang="ts">

const modelValue = defineModel<unknown | undefined>();

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
    {{ item[titleKey as keyof typeof item] }}
  </label>
</template>

<style scoped lang="scss">
  label {
    margin-right: 12px;
  }
</style>
