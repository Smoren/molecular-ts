<script setup lang="ts">

import ConfigSection from '@/components/config-editor/components/config-section.vue';
import { useConfigStore } from '@/store/config';

const {
  worldConfig,
} = useConfigStore();

</script>

<template>
  <config-section>
    <template #body>
      <div>
        <div>Max Interaction Radius</div>
        <input type="number" v-model="worldConfig.MAX_INTERACTION_RADIUS" min="0" />
      </div>
      <div>
        <div>Max Link Radius</div>
        <input type="number" v-model="worldConfig.MAX_LINK_RADIUS" min="0" />
      </div>
      <div>
        <div>Max Force</div>
        <input type="number" v-model="worldConfig.MAX_FORCE" />
      </div>
      <div>
        <div>Gravity Multiplier</div>
        <input type="number" v-model="worldConfig.GRAVITY_FORCE_MULTIPLIER" />
      </div>
      <div>
        <div>Link Force Multiplier</div>
        <input type="number" v-model="worldConfig.LINK_FORCE_MULTIPLIER" step="0.005" min="0.005" />
      </div>
      <div>
        <div>Bounce Force Multiplier</div>
        <input type="number" v-model="worldConfig.BOUNCE_FORCE_MULTIPLIER" step="0.1" />
      </div>
      <div>
        <div>Inertial Multiplier</div>
        <input type="number" v-model="worldConfig.INERTIAL_MULTIPLIER" step="0.01" />
      </div>
      <div>
        <div>Speed</div>
        <input type="number" v-model="worldConfig.SPEED" min="1" />
      </div>
      <div>
        <div>Temperature Multiplier</div>
        <input type="number" v-model="worldConfig.TEMPERATURE_MULTIPLIER" step="0.1" />
      </div>
    </template>
  </config-section>
</template>

<style scoped lang="scss">

@import "../assets/config-editor.scss";

</style>
