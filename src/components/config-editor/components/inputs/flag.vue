<script setup lang="ts">

const modelValue = defineModel<boolean>();
defineProps<{
  title: string;
}>();

</script>

<template>
  <div :style="{ marginBottom: '10px' }">
    <label>
      <input type="checkbox" v-model="modelValue" />
      {{ title }}
    </label>
  </div>
</template>
