<script setup lang="ts">

import { type Ref, ref, toRefs } from "vue";
import { useConfigStore } from '@/store/config';
import { useSimulationStore } from "@/store/simulation";
import { usePhysicsStore } from '@/store/physics';
import ConfigSection from '@/components/config-editor/components/containers/config-section.vue';
import InputHeader from "@/components/config-editor/components/base/input-header.vue";

const physicsStore = usePhysicsStore();
const { physicModelName } = toRefs(physicsStore);

const configStore = useConfigStore();
const worldConfig = configStore.worldConfig;
const speedBuffer: Ref<number | null> = ref(null);

const {
  clearAtoms,
  refillAtoms,
} = useSimulationStore();

const togglePause = () => {
  if (speedBuffer.value === null) {
    speedBuffer.value = configStore.worldConfig.SPEED;
    configStore.worldConfig.SPEED = 0;
  } else {
    configStore.worldConfig.SPEED = speedBuffer.value;
    speedBuffer.value = null;
  }
};

const clear = () => {
  if (confirm('Are you sure?')) {
    clearAtoms!();
  }
};

const refill = () => {
  if (confirm('Are you sure?')) {
    refillAtoms!();
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
        <button class="btn btn-outline-secondary" @click="clear">
          Clear
        </button>
        <button class="btn btn-outline-secondary" @click="refill">
          Refill
        </button>
      </div>
      <div>
        <input-header
          name="Physic Model"
          tooltip="Defines the rules for calculating forces."
        />
        <label v-for="(title, value) in physicsStore.physicModelNameMap">
          <input type="radio" name="physic-model" v-model="physicModelName" :value="value">
          {{ title }} &nbsp;
        </label>
      </div>
      <div>
        <input-header
          name="Max Interaction Radius"
          tooltip="Maximum radius at which unlinked particles can interact."
        />
        <input type="number" v-model="worldConfig.MAX_INTERACTION_RADIUS" min="0" />
      </div>
      <div>
        <input-header
          name="Max Link Radius"
          tooltip="Maximum link length (can be increased by Links Distance Factor parameters)."
        />
        <input type="number" v-model="worldConfig.MAX_LINK_RADIUS" min="0" />
      </div>
      <div>
        <input-header
          name="Max Force Value"
          tooltip="Maximum force value of each individual interaction."
        />
        <input type="number" v-model="worldConfig.MAX_FORCE" step="0.1" />
      </div>
      <div>
        <input-header
          name="Gravity Multiplier"
          tooltip="Parameter by which the force of gravity is multiplied."
        />
        <input type="number" v-model="worldConfig.GRAVITY_FORCE_MULTIPLIER" />
      </div>
      <div>
        <input-header
          name="Link Force Multiplier"
          tooltip="Parameter by which the link elastic force is multiplied."
        />
        <input type="number" v-model="worldConfig.LINK_FORCE_MULTIPLIER" step="0.005" min="0.005" />
      </div>
      <div>
        <input-header
          name="Bounce Force Multiplier"
          tooltip="Parameter by which the collision rebound force is multiplied."
        />
        <input type="number" v-model="worldConfig.BOUNCE_FORCE_MULTIPLIER" step="0.1" />
      </div>
      <div>
        <input-header
          name="Bounds Force Multiplier"
          tooltip="Parameter by which the force of repulsion from the boundaries of space is multiplied."
        />
        <input type="number" v-model="worldConfig.BOUNDS_FORCE_MULTIPLIER" step="0.01" />
      </div>
      <div>
        <input-header
          name="Inertial Multiplier"
          tooltip="Parameter by which the particle speed is multiplied after each iteration."
        />
        <input type="number" v-model="worldConfig.INERTIAL_MULTIPLIER" step="0.01" />
      </div>
      <div>
        <input-header
          name="Speed Parameter"
          tooltip="The speed parameter by which all simulation forces are multiplied."
        />
        <input type="number" v-model="worldConfig.SPEED" min="1" />
      </div>
      <div>
        <input-header
          name="Playback Speed"
          tooltip="Number of simulation iterations per rendering step."
        />
        <input type="number" v-model="worldConfig.PLAYBACK_SPEED" min="1" />
      </div>
      <div>
        <input-header
          name="Temperature Multiplier"
          tooltip="Parameter responsible for the temperature of the environment."
        />
        <input type="number" v-model="worldConfig.TEMPERATURE_MULTIPLIER" step="0.1" />
      </div>
      <div>
        <div style="text-align: center;">
          <input-header
            name="Bounds"
            tooltip="Boundaries of the maximum position of particles in space."
          />
        </div>
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

@import "../../assets/config-editor";

.bounds-table {
  width: 100%;

  input {
    width: 100% !important;
  }
}

</style>
