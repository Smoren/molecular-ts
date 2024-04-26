<script setup lang="ts">

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Tooltip from "@/components/config-editor/components/base/tooltip.vue";

type Position = 'center' | 'left' | 'right';

withDefaults(defineProps<{
  name: string;
  position?: Position;
  tooltip?: string;
  tooltipPosition?: Position;
  tooltipWidth?: number;
}>(), {
  position: 'left',
});

</script>

<template>
  <div :style="{ textAlign: position }">
    <label>
      <slot />
      <span style="font-weight: 600;">{{ name }}</span>
    </label>
    <tooltip :text="tooltip" :position="tooltipPosition" :width="tooltipWidth" v-if="tooltip" style="margin-left: 5px;">
      <font-awesome-icon icon="fa-regular fa-circle-question" style="color: #bbb" />
    </tooltip>
  </div>
</template>
