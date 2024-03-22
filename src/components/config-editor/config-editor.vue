<script setup lang="ts">

import 'bootstrap/dist/css/bootstrap.min.css';

import { MDBAccordion, MDBAccordionItem } from "mdb-vue-ui-kit";
import { ref, type Ref, watch } from 'vue';
import { useSwitch } from "@/hooks/use-switch";
import { useConfigStore } from '@/store/config';
import WorldConfigSection from '@/components/config-editor/components/world-config-section.vue';
import TypesConfigSection from '@/components/config-editor/components/types-config-section.vue';
import Navbar from "@/components/config-editor/components/navbar.vue";
import Sidebar from "@/components/config-editor/components/sidebar.vue";
import ViewModeSection from "@/components/config-editor/components/view-mode-section.vue";

const emit = defineEmits<{
  (e: 'change-view-mode', value: '3d' | '2d'): void
}>();

const {
  worldConfig,
  typesConfig,
} = useConfigStore();

const leftBarVisible = useSwitch(false);
const rightBarVisible = useSwitch(false);
const activeAccordionItem = ref('collapse-world');
const viewMode: Ref<'3d' | '2d'> = ref('3d');

watch(viewMode, (value) => {
  emit('change-view-mode', value);
});

const rightBarModeMap = {
  GRAVITY: 1,
  LINK_GRAVITY: 2,
};

const rightBarMode: Ref<number> = ref(rightBarModeMap.GRAVITY);

const openRightBar = (mode: number) => {
  rightBarMode.value = mode;
  rightBarVisible.on();
};

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
          <view-mode-section v-model="viewMode" />
          <MDBAccordion v-model="activeAccordionItem">
            <MDBAccordionItem headerTitle="World" collapseId="collapse-world">
              <world-config-section/>
            </MDBAccordionItem>
            <MDBAccordionItem headerTitle="Types" collapseId="collapse-types">
              <types-config-section/>
            </MDBAccordionItem>
          </MDBAccordion>
        </template>
      </sidebar>
      <sidebar :visible="rightBarVisible" position="right">
        <template #body>
          Under construction...
        </template>
      </sidebar>
    </template>
  </navbar>
</template>

<style scoped lang="scss">

@import "./assets/config-editor.scss";

</style>
