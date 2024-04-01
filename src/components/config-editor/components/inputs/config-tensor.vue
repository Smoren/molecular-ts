<script setup lang="ts">

import { ref } from "vue";
import {
  MDBTabs,
  MDBTabNav,
  MDBTabContent,
  MDBTabItem,
  MDBTabPane,
} from 'mdb-vue-ui-kit';
import { getColorString } from '@/components/config-editor/utils';
import ConfigMatrix from '@/components/config-editor/components/inputs/config-matrix.vue';

const props = withDefaults(defineProps<{
  colors: [number, number, number][];
  values: number[][];
  min?: number;
  max?: number;
  step?: number;
}>(), {
  step: 1,
});

const activeTabId = ref('tab-0');

</script>

<template>
  <div class="config-tensor-widget">
    <MDBTabs v-model="activeTabId">
      <MDBTabNav fill>
        <MDBTabItem
          :tabId="`tab-${index}`"
          href="javascript:void(0);"
          v-for="(color, index) in colors"
          :style="{ backgroundColor: getColorString(color), height: '30px' }"
        ></MDBTabItem>
      </MDBTabNav>
      <MDBTabContent>
        <MDBTabPane :tabId="`tab-${index}`" v-for="(matrix, index) in values">
          <div class="my-tab-pane">
            <config-matrix
              :values="matrix"
              :colors="colors"
              :step="0.1"
              :min="0"
              :hide-symmetric="true"
            />
          </div>
        </MDBTabPane>
      </MDBTabContent>
    </MDBTabs>
  </div>
</template>

<style scoped lang="scss">

@import "../../assets/config-editor";
@import "bootstrap/scss/bootstrap-utilities";

.my-tab-pane {
  padding: 15px;
  border: 1px solid var(--bs-border-color);
  border-top: transparent;
}

</style>

<style lang="scss">

.config-tensor-widget {
  .fade {
    transition: none !important;
    opacity: 1 !important;
  }

  .nav-link {
    opacity: 0.4 !important;
  }

  .nav-link.active {
    opacity: 1 !important;
  }
}


</style>
