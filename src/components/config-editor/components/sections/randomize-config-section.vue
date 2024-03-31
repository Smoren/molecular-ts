<script setup lang="ts">

import { computed } from "vue";
import { useConfigStore } from "@/store/config";
import { useSimulationStore } from "@/store/simulation";
import ConfigSection from '@/components/config-editor/components/containers/config-section.vue';
import ConfigBounds from "@/components/config-editor/components/inputs/config-bounds.vue";
import InitialConfigSection from "@/components/config-editor/components/sections/initial-config-section.vue";
import Flag from "@/components/config-editor/components/inputs/flag.vue";
import InputHeader from "@/components/config-editor/components/base/input-header.vue";
import ConfigMatrix from "@/components/config-editor/components/inputs/config-matrix.vue";
import ConfigList from "@/components/config-editor/components/inputs/config-list.vue";

const configStore = useConfigStore();
const { randomTypesConfig, initialConfig } = configStore;

const {
  clearAtoms,
  refillAtoms,
} = useSimulationStore();

const needRefill = computed((): boolean => {
  return randomTypesConfig.TYPES_COUNT !== configStore.typesConfig.COLORS.length;
});

const randomizeTypesConfig = () => {
  if (!confirm('Are you sure?')) {
    return;
  }

  if (needRefill.value) {
    clearAtoms!(true);
    configStore.randomizeTypesConfig();
    refillAtoms!(true);
  } else {
    configStore.randomizeTypesConfig();
  }
};

</script>

<template>
  <config-section>
    <template #title>
      Randomize Config
    </template>
    <template #body>
      <div>
        <input-header
            name="Types Count"
            tooltip="Count of particle types."
            tooltip-position="left"
            :tooltip-width="200"
        />
      </div>
      <div>
        <input type="number" min="0" step="1" v-model="randomTypesConfig.TYPES_COUNT" />
      </div>

      <div>
        <input-header
          name="Gravity"
          tooltip="Gravity coefficient matrix for unlinked particles shows whether a particle of one type will attract or
                   repel a particle of another type in the case when they are not linked to each other, and with what force."
          tooltip-position="left"
          :tooltip-width="400"
        />
        <config-bounds name="Gravity" :step="1" :values="randomTypesConfig.GRAVITY_BOUNDS" />
        <flag title="Symmetric" v-model="randomTypesConfig.GRAVITY_MATRIX_SYMMETRIC" />
      </div>

      <div>
        <input-header
          name="Link Gravity"
          tooltip="Gravity coefficient matrix for linked particles shows whether a particle of one type will attract or
                 repel a particle of another type in the case when they are linked to each other, and with what force."
          tooltip-position="left"
        />
        <config-bounds :step="1" :values="randomTypesConfig.LINK_GRAVITY_BOUNDS" />
        <flag title="Symmetric" v-model="randomTypesConfig.LINK_GRAVITY_MATRIX_SYMMETRIC" />
      </div>

      <div>
        <input-header
          name="Links Count"
          tooltip="Connection limit map shows the maximum number of links for particles of each type."
          tooltip-position="left"
        />
        <config-bounds :step="1" :values="randomTypesConfig.LINK_BOUNDS" />
      </div>

      <div>
        <input-header
            name="Types Links Count"
            tooltip="Connection limit matrix shows the maximum number of connections that particles of each type can have
                     with particles of different types."
            tooltip-position="left"
        />
        <config-bounds :step="1" :values="randomTypesConfig.LINK_TYPE_BOUNDS" />
        <flag title="Symmetric" v-model="randomTypesConfig.LINK_TYPE_MATRIX_SYMMETRIC" />
      </div>

      <div>
        <input-header
            name="Links Distance Factor"
            tooltip="Matrix of influence on neighbors links shows how particles of each type affect the maximum length of
                     links of neighboring particles of different types."
            tooltip-position="left"
        />
        <config-bounds name="Links Distance Factor" :step="1" :values="randomTypesConfig.LINK_FACTOR_DISTANCE_BOUNDS" />
        <flag title="Symmetric" v-model="randomTypesConfig.LINK_FACTOR_DISTANCE_MATRIX_SYMMETRIC" />
      </div>

      <div v-if="needRefill">
        <br />
        <initial-config-section :with-buttons="false" />
      </div>
      <br />
      <button class="btn btn-outline-primary" @click="randomizeTypesConfig" style="width: 100%;">
        {{ needRefill ? 'Randomize and Refill' : 'Randomize' }}
      </button>
    </template>
  </config-section>
</template>

<style scoped lang="scss">

@import "../../assets/config-editor";

</style>
