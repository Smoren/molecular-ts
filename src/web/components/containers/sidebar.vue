<script setup lang="ts">

import { computed } from "vue";

const props = defineProps<{
  visible: boolean;
  closeAction: () => void;
  position: 'left' | 'right';
}>();

const classes = computed(() => {
  return {
    'offcanvas-start': props.position === 'left',
    'offcanvas-end': props.position === 'right',
    'show': props.visible,
  };
});

</script>

<template>
  <div
    :class="classes"
    class="offcanvas"
    tabindex="-1"
    :style="{ visibility: 'visible' }"
  >
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">
        <slot name="title" />
      </h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" @click="closeAction()"></button>
    </div>
    <div class="offcanvas-body">
      <slot name="body" />
    </div>
  </div>
</template>

<style scoped lang="scss">

@use "../config-editor/assets/config-editor";

</style>
