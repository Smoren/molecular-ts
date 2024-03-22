<script setup lang="ts">

import 'bootstrap/dist/css/bootstrap.min.css';
import { useSwitch } from "@/hooks/use-switch";
import { ref, type Ref } from 'vue';
import { useConfigStore } from '@/store/config';
import WorldConfigSection from '@/components/config-editor/components/world-config-section.vue';
import TypesConfigSection from '@/components/config-editor/components/types-config-section.vue';

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
  <nav class="navbar bg-body-tertiary fixed-top">
    <div class="container-fluid">
      <button
        class="navbar-toggler"
        type="button"
        @click="leftBarVisible.on()"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <a class="navbar-brand" href="#">Molecular TS</a>

      <div
        :class="{ 'show': leftBarVisible.state.value }"
        class="offcanvas offcanvas-start"
      >
        <div class="offcanvas-header">
          <h5 class="offcanvas-title">Config</h5>
          <button
            type="button"
            class="btn-close"
            @click="leftBarVisible.off()"
          ></button>
        </div>
        <div class="offcanvas-body">
          <world-config-section />
          <types-config-section />
        </div>
      </div>

      <div
        :class="{ 'show': rightBarVisible.state.value }"
        class="offcanvas offcanvas-end"
      >
        <div class="offcanvas-header">
          <button
              type="button"
              class="btn-close"
              @click="rightBarVisible.off()"
          ></button>
        </div>
        <div class="offcanvas-body">
          <div class="section" v-if="rightBarMode === rightBarModeMap.LINK_GRAVITY">
            <h3>Link Gravity</h3>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">

@import "./assets/config-editor.scss";

</style>
