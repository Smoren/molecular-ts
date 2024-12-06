<script setup lang="ts">

import 'bootstrap/dist/css/bootstrap.min.css';
const logo = new URL('./assets/logo.png', import.meta.url).href

import { ref } from 'vue';
import { MDBAccordion, MDBAccordionItem } from "mdb-vue-ui-kit";
import Navbar from "@/web/components/containers/navbar.vue";
import Sidebar from "@/web/components/containers/sidebar.vue";
import InitialConfigSection from "@/web/components/config-editor/components/sections/initial-config-section.vue";
import RandomizeConfigSection from "@/web/components/config-editor/components/sections/randomize-config-section.vue";
import TypesConfigSection from '@/web/components/config-editor/components/sections/types-config-section.vue';
import ViewModeSection from "@/web/components/config-editor/components/sections/view-mode-section.vue";
import WorldConfigSection from '@/web/components/config-editor/components/sections/world-config-section.vue';
import SummarySection from "@/web/components/config-editor/components/sections/summary-section.vue";
import ExchangeSection from "@/web/components/config-editor/components/sections/exchange-section.vue";
import LinkSection from "@/web/components/config-editor/components/sections/link-section.vue";
import { useLeftBarStore } from '@/web/store/left-bar';
import { useRightBarStore } from '@/web/store/right-bar';
import EditTypesConfigSection from '@/web/components/config-editor/components/sections/edit-types-config-section.vue';
import GeneticSection from "@/web/components/config-editor/components/sections/genetic-section.vue";
import GeneticSectionOld from "@/web/components/config-editor/components/sections/genetic-section-old.vue";

const leftBarStore = useLeftBarStore();
const rightBarStore = useRightBarStore();

const activeAccordionItem = ref('collapse-world');

</script>

<template>
  <navbar :on-burger-click="leftBarStore.open">
    <template #title>
      MolecuLarva
      <img :src="logo" alt="MolecuLarva" style="height: 30px; margin-left: 10px; margin-right: -10px">
    </template>
    <template #body>
      <sidebar
        :visible="leftBarStore.isOpened"
        :close-action="leftBarStore.close"
        position="left"
        style="overflow: hidden; resize: horizontal;"
      >
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
      <sidebar
        :visible="rightBarStore.isOpened"
        :close-action="rightBarStore.close"
        position="right"
      >
        <template #title>
          {{ rightBarStore.currentMode?.title ?? '' }}
        </template>
        <template #body>
          <div v-if="rightBarStore.isOpened">
            <randomize-config-section v-if="rightBarStore.isMode(rightBarStore.modes.RANDOMIZE)" />
            <summary-section v-if="rightBarStore.isMode(rightBarStore.modes.SUMMARY)" />
            <edit-types-config-section v-if="rightBarStore.isMode(rightBarStore.modes.EDIT_TYPES)" />
            <genetic-section v-if="rightBarStore.isMode(rightBarStore.modes.GENETIC)" />
<!--            <genetic-section-old v-if="rightBarStore.isMode(rightBarStore.modes.GENETIC)" />-->
          </div>
        </template>
      </sidebar>
    </template>
  </navbar>
</template>

<style scoped lang="scss">

@import "./assets/config-editor.scss";

</style>
