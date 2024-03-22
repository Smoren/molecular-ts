<script setup lang="ts">

import 'bootstrap/dist/css/bootstrap.min.css';
import { useSwitch } from "@/hooks/use-switch";
import { ref, type Ref } from 'vue';
import { useConfigStore } from '@/store/config';
import WorldConfigSection from '@/components/config-editor/components/world-config-section.vue';
import TypesConfigSection from '@/components/config-editor/components/types-config-section.vue';
import Navbar from "@/components/config-editor/components/navbar.vue";
import Sidebar from "@/components/config-editor/components/sidebar.vue";

const {
  worldConfig,
  typesConfig,
} = useConfigStore();

const leftBarVisible = useSwitch(false);
const rightBarVisible = useSwitch(false);

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
          <world-config-section />
          <types-config-section />

          <button class="btn" @click="rightBarVisible.on()">
            Open right bar
          </button>
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
