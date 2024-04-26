<script setup lang="ts">

import { ref, type Ref } from "vue";

defineProps<{
  title: string;
}>();

const emit = defineEmits<{
  start: [];
  success: [data: Record<string, unknown>];
  error: [e: Error];
}>()

const uploadFile: Ref<HTMLInputElement | null> = ref(null);

const onClick = () => {
  uploadFile.value?.click();
}

const importFile = () => {
  const file = uploadFile.value?.files![0];

  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = function(e) {
    try {
      emit('start');
      const fileContent = e.target!.result;
      const data = JSON.parse(fileContent as string);
      emit('success', data);
    } catch (e) {
      emit('error', e as Error);
    } finally {
      uploadFile.value!.value = '';
    }
  };

  reader.readAsText(file);
}

</script>

<template>
  <button class="btn btn-outline-secondary" @click="onClick">
    {{ title }}
  </button>
  <div v-show="false">
    <input
        type="file"
        accept="application/json"
        ref="uploadFile"
        @change="importFile"
    />
  </div>
</template>
