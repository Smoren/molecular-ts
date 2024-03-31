<script setup lang="ts">

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import Tooltip from "@/components/config-editor/components/base/tooltip.vue";

library.add(fas, far);

type Position = 'center' | 'left' | 'right';

defineProps<{
  name: string;
  tooltip?: string;
  tooltipPosition?: Position;
  tooltipWidth?: number;
}>();

</script>

<template>
  <div>
    <span style="font-weight: 600;">{{ name }}</span>
    <tooltip :text="tooltip" :position="tooltipPosition" :width="tooltipWidth" v-if="tooltip" style="margin-left: 5px;">
      <font-awesome-icon icon="fa-regular fa-circle-question" style="color: #bbb" />
    </tooltip>
  </div>
</template>
