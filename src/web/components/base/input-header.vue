<script setup lang="ts">

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Tooltip from "@/web/components/base/tooltip.vue";
import { useI18nStore } from "@/web/store/i18n";

type Position = 'center' | 'left' | 'right';

withDefaults(defineProps<{
  name: string;
  position?: Position;
  tooltip?: string;
  tooltipPosition?: Position;
  tooltipWidth?: number;
  styleBold?: boolean;
}>(), {
  position: 'left',
  styleBold: true,
});

const i18n = useI18nStore();

</script>

<template>
  <div :style="{ textAlign: position }">
    <label>
      <slot />
      <span :style="{ fontWeight: styleBold ? 600 : 'normal'}">{{ i18n.t(name) }}</span>
    </label>
    <tooltip :text="i18n.t(tooltip ?? '')" :position="tooltipPosition" :width="tooltipWidth" v-if="tooltip" style="margin-left: 5px;">
      <font-awesome-icon icon="fa-regular fa-circle-question" style="color: #bbb" />
    </tooltip>
  </div>
</template>
