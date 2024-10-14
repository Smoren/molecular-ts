<script setup lang="ts">

const modelValue = defineModel<unknown | undefined>();

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
      {{ item[titleKey as keyof typeof item] }}
    </option>
  </select>
</template>

<style scoped lang="scss">

</style>
