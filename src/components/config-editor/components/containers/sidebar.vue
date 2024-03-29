<script setup lang="ts">

import type { SwitchInterface } from "@/hooks/use-switch";
import { computed } from "vue";

const props = defineProps<{
  visible: SwitchInterface;
  position: 'left' | 'right';
}>();

const classes = computed(() => {
  return {
    'offcanvas-start': props.position === 'left',
    'offcanvas-end': props.position === 'right',
    'show': props.visible.state.value,
  };
});

</script>

<template>
  <div :class="classes" class="offcanvas" tabindex="-1">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">
        <slot name="title" />
      </h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" @click="visible.off()"></button>
    </div>
    <div class="offcanvas-body">
      <slot name="body" v-if="visible.state.value" />
    </div>
  </div>
</template>

<style scoped lang="scss">

@import "../../assets/config-editor";

</style>
