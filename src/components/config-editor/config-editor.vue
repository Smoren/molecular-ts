<script setup lang="ts">

import 'bootstrap/dist/css/bootstrap.min.css';

import { provide, ref, type Ref } from 'vue';
import { useSwitch } from "@/hooks/use-switch";
import { useConfigStore } from '@/store/config';
import { PROVIDED_TOGGLE_RANDOMIZE_CONFIG, PROVIDED_TOGGLE_SUMMARY } from "@/components/config-editor/constants";
import { MDBAccordion, MDBAccordionItem } from "mdb-vue-ui-kit";
import Navbar from "@/components/config-editor/components/containers/navbar.vue";
import Sidebar from "@/components/config-editor/components/containers/sidebar.vue";
import InitialConfigSection from "@/components/config-editor/components/sections/initial-config-section.vue";
import RandomizeConfigSection from "@/components/config-editor/components/sections/randomize-config-section.vue";
import TypesConfigSection from '@/components/config-editor/components/sections/types-config-section.vue';
import ViewModeSection from "@/components/config-editor/components/sections/view-mode-section.vue";
import WorldConfigSection from '@/components/config-editor/components/sections/world-config-section.vue';
import SummarySection from "@/components/config-editor/components/sections/summary-section.vue";

const configStore = useConfigStore();
const { worldConfig, typesConfig } = configStore;

const leftBarVisible = useSwitch(false);
const rightBarVisible = useSwitch(false);
const activeAccordionItem = ref('collapse-world');

const copyShareLink = () => {
  navigator.clipboard.writeText(`${location.origin}${location.pathname}#${configStore.exportConfig()}`);
}

const rightBarModeMap = {
  RANDOMIZE: 1,
  SUMMARY: 2,
};

const rightBarMode: Ref<number> = ref(rightBarModeMap.RANDOMIZE);

const toggleRightBar = (mode: number): boolean => {
  if (mode !== rightBarMode.value || !rightBarVisible.state.value) {
    rightBarMode.value = mode;
    rightBarVisible.on();
    return true;
  } else {
    rightBarVisible.off();
    return false;
  }
};

provide<() => boolean>(PROVIDED_TOGGLE_RANDOMIZE_CONFIG, () => toggleRightBar(rightBarModeMap.RANDOMIZE));
provide<() => boolean>(PROVIDED_TOGGLE_SUMMARY, () => toggleRightBar(rightBarModeMap.SUMMARY));

</script>

<template>
  <navbar :on-burger-click="leftBarVisible.on">
    <template #title>
      Molecular TS
    </template>
    <template #body>
      <sidebar :visible="leftBarVisible" position="left">
        <template #title>
          Config
        </template>
        <template #body>
          <view-mode-section v-model="configStore.viewMode" />
          <MDBAccordion v-model="activeAccordionItem">
            <MDBAccordionItem headerTitle="World" collapseId="collapse-world">
              <world-config-section />
            </MDBAccordionItem>
            <MDBAccordionItem headerTitle="Types" collapseId="collapse-types">
              <types-config-section />
            </MDBAccordionItem>
            <MDBAccordionItem headerTitle="Initial" collapseId="collapse-initial">
              <initial-config-section />
            </MDBAccordionItem>
          </MDBAccordion>
          <br />
          <button class="btn btn-primary" @click="copyShareLink" style="width: 100%;">
            Copy configuration share link
          </button>
        </template>
      </sidebar>
      <sidebar :visible="rightBarVisible" position="right">
        <template #body>
          <randomize-config-section v-if="rightBarMode === rightBarModeMap.RANDOMIZE" />
          <summary-section v-if="rightBarMode === rightBarModeMap.SUMMARY" />
        </template>
      </sidebar>
    </template>
  </navbar>
</template>

<style scoped lang="scss">

@import "./assets/config-editor.scss";

</style>
