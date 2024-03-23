<script setup lang="ts">

import ConfigSection from '@/components/config-editor/components/config-section.vue';
import { useConfigStore } from '@/store/config';
import { inject, type Ref, ref } from "vue";

const configStore = useConfigStore();
const worldConfig = configStore.worldConfig;
const speedBuffer: Ref<number | null> = ref(null);

const togglePause = () => {
  if (speedBuffer.value === null) {
    speedBuffer.value = configStore.worldConfig.SPEED;
    configStore.worldConfig.SPEED = 0;
  } else {
    configStore.worldConfig.SPEED = speedBuffer.value;
    speedBuffer.value = null;
  }
};

const clearAtoms = inject<() => void>('clear');

const clear = () => {
  if (confirm('Are you sure?')) {
    clearAtoms!();
  }
};

</script>

<template>
  <config-section>
    <template #body>
      <div class="btn-group" role="group">
        <button class="btn btn-outline-secondary" @click="togglePause">
          {{  speedBuffer === null ? 'Pause' : 'Resume' }}
        </button>
        <button class="btn btn-outline-secondary" @click="clear" v-if="false">
          Clear
        </button>
      </div>g
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
        <div>Playback Speed</div>
        <input type="number" v-model="worldConfig.PLAYBACK_SPEED" min="1" />
      </div>
      <div>
        <div>Temperature Multiplier</div>
        <input type="number" v-model="worldConfig.TEMPERATURE_MULTIPLIER" step="0.1" />
      </div>
      <div>
        <div style="text-align: center;">Bounds</div>
        <table class="bounds-table">
          <tr>
            <td></td>
            <td>x</td>
            <td>y</td>
            <td>z</td>
          </tr>
          <tr>
            <td>min</td>
            <td v-for="(_, index) in worldConfig.MIN_POSITION">
              <input
                :key="index"
                type="number"
                v-model="worldConfig.MIN_POSITION[index]"
                step="50"
              />
            </td>
          </tr>
          <tr>
            <td>max</td>
            <td v-for="(_, index) in worldConfig.MAX_POSITION">
              <input
                :key="index"
                type="number"
                v-model="worldConfig.MAX_POSITION[index]"
                step="50"
              />
            </td>
          </tr>
        </table>
      </div>
    </template>
  </config-section>
</template>

<style scoped lang="scss">

@import "../assets/config-editor.scss";

.bounds-table {
  width: 100%;

  input {
    width: 100% !important;
  }
}

</style>
