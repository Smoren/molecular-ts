<script setup lang="ts">

import 'bootstrap/dist/css/bootstrap.min.css';

import { MDBAccordion, MDBAccordionItem } from "mdb-vue-ui-kit";
import { provide, ref, type Ref, watch } from 'vue';
import { useSwitch } from "@/hooks/use-switch";
import { useConfigStore } from '@/store/config';
import WorldConfigSection from '@/components/config-editor/components/world-config-section.vue';
import TypesConfigSection from '@/components/config-editor/components/types-config-section.vue';
import Navbar from "@/components/config-editor/components/navbar.vue";
import Sidebar from "@/components/config-editor/components/sidebar.vue";
import ViewModeSection from "@/components/config-editor/components/view-mode-section.vue";
import RandomizeConfigSection from "@/components/config-editor/components/randomize-config-section.vue";
import { PROVIDED_OPEN_RANDOMIZE_CONFIG } from "@/components/config-editor/constants";
import InitialConfigSection from "@/components/config-editor/components/initial-config-section.vue";

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
};

const rightBarMode: Ref<number> = ref(rightBarModeMap.RANDOMIZE);

const openRightBar = (mode: number) => {
  rightBarMode.value = mode;
  rightBarVisible.on();
};

provide<() => void>(PROVIDED_OPEN_RANDOMIZE_CONFIG, () => openRightBar(rightBarModeMap.RANDOMIZE));

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
        </template>
      </sidebar>
    </template>
  </navbar>
</template>

<style scoped lang="scss">

@import "./assets/config-editor.scss";

</style>
