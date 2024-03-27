<script setup lang="ts">

import Tooltip from "@/components/config-editor/components/tooltip.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

library.add(fas, far);

defineProps<{
  name: string;
  tooltip?: string
}>()

</script>

<template>
  <div>
    {{ name }}
    <tooltip :text="tooltip" :center="true" v-if="tooltip" style="margin-left: 2px;">
      <font-awesome-icon icon="fa-regular fa-circle-question" style="color: #bbb" />
    </tooltip>
  </div>
</template>
