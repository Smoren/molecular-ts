<script setup lang="ts">

import 'bootstrap/dist/css/bootstrap.min.css';
const logo = new URL('./assets/logo.png', import.meta.url).href

import { provide, ref } from 'vue';
import { useSwitch } from "@/web/hooks/use-switch";
import { useRightBar } from "@/web/components/config-editor/hooks/use-right-bar";
import { MDBAccordion, MDBAccordionItem } from "mdb-vue-ui-kit";
import { PROVIDED_TOGGLE_RANDOMIZE_CONFIG, PROVIDED_TOGGLE_SUMMARY } from '@/web/components/config-editor/constants';
import Navbar from "@/web/components/config-editor/components/containers/navbar.vue";
import Sidebar from "@/web/components/config-editor/components/containers/sidebar.vue";
import InitialConfigSection from "@/web/components/config-editor/components/sections/initial-config-section.vue";
import RandomizeConfigSection from "@/web/components/config-editor/components/sections/randomize-config-section.vue";
import TypesConfigSection from '@/web/components/config-editor/components/sections/types-config-section.vue';
import ViewModeSection from "@/web/components/config-editor/components/sections/view-mode-section.vue";
import WorldConfigSection from '@/web/components/config-editor/components/sections/world-config-section.vue';
import SummarySection from "@/web/components/config-editor/components/sections/summary-section.vue";
import ExchangeSection from "@/web/components/config-editor/components/sections/exchange-section.vue";
import LinkSection from "@/web/components/config-editor/components/sections/link-section.vue";
import { useConfigStore } from "@/web/store/config";

const leftBarVisible = useSwitch(false);
const activeAccordionItem = ref('collapse-world');
const configStore = useConfigStore();

const {
  rightBarVisible,
  rightBarMode,
  rightBarModeMap,
  toggleRightBar,
} = useRightBar();

provide<() => boolean>(
    PROVIDED_TOGGLE_RANDOMIZE_CONFIG,
    () => toggleRightBar(rightBarModeMap.RANDOMIZE, () => configStore.syncRandomTypesCount()),
);
provide<() => boolean>(PROVIDED_TOGGLE_SUMMARY, () => toggleRightBar(rightBarModeMap.SUMMARY));

</script>

<template>
  <navbar :on-burger-click="leftBarVisible.on">
    <template #title>
      MolecuLarva
      <img :src="logo" alt="MolecuLarva" style="height: 30px; margin-left: 10px; margin-right: -10px">
    </template>
    <template #body>
      <sidebar :visible="leftBarVisible" position="left" style="overflow: hidden; resize: horizontal;">
        <template #title>
          Config
        </template>
        <template #body>
          <view-mode-section />
          <MDBAccordion v-model="activeAccordionItem">
            <MDBAccordionItem headerTitle="World" collapseId="collapse-world">
              <world-config-section />
            </MDBAccordionItem>
            <MDBAccordionItem headerTitle="Types" collapseId="collapse-types">
              <types-config-section />
            </MDBAccordionItem>
            <MDBAccordionItem headerTitle="Initial" collapseId="collapse-initial">
              <initial-config-section :with-title="false" />
            </MDBAccordionItem>
            <MDBAccordionItem headerTitle="Exchange" collapseId="collapse-exchange">
              <exchange-section />
            </MDBAccordionItem>
          </MDBAccordion>
          <br />
          <link-section />
        </template>
      </sidebar>
      <sidebar :visible="rightBarVisible" position="right">
        <template #body>
          <div v-if="rightBarVisible.state.value">
            <randomize-config-section v-if="rightBarMode === rightBarModeMap.RANDOMIZE" />
            <summary-section v-if="rightBarMode === rightBarModeMap.SUMMARY" />
          </div>
        </template>
      </sidebar>
    </template>
  </navbar>
</template>

<style scoped lang="scss">

@import "./assets/config-editor.scss";

</style>
