<script setup lang="ts">

import { useI18nStore } from "@/web/store/i18n";

const modelValue = defineModel<boolean>();
defineProps<{
  title: string;
}>();

const i18n = useI18nStore();

</script>

<template>
  <div :style="{ marginBottom: '10px' }">
    <label>
      <input type="checkbox" v-model="modelValue" />
      {{ i18n.t(title) }}
    </label>
  </div>
</template>
