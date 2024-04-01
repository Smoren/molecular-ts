<script setup lang="ts">

import { ref, watch } from "vue";
import {
  MDBTabs,
  MDBTabNav,
  MDBTabContent,
  MDBTabItem,
  MDBTabPane,
} from 'mdb-vue-ui-kit';
import { getColorString } from '@/components/config-editor/utils';
import Tooltip from "@/components/config-editor/components/base/tooltip.vue";

const symmetric = defineModel<boolean>('symmetric');

const props = withDefaults(defineProps<{
  colors: [number, number, number][];
  values: number[][];
  min?: number;
  max?: number;
  step?: number;
}>(), {
  step: 1,
});

const activeTabId1 = ref('ex1-1');

</script>

<template>
  <MDBTabs v-model="activeTabId1">
    <MDBTabNav tabsClasses="mb-3" fill>
      <MDBTabItem
        :tabId="`tab-${index}`"
        href="javascript:void(0);"
        v-for="(color, index) in colors"
        :style="{ backgroundColor: getColorString(color), height: '30px' }"
      ></MDBTabItem>
    </MDBTabNav>
    <MDBTabContent>
      <MDBTabPane :tabId="`tab-${index}`" v-for="(color, index) in colors">Content #{{ index }}</MDBTabPane>
    </MDBTabContent>
  </MDBTabs>
</template>

<style scoped lang="scss">

@import "../../assets/config-editor";

</style>
