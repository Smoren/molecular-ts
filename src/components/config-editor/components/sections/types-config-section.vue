<script setup lang="ts">

import { inject } from "vue";
import { useConfigStore } from '@/store/config';
import { useSimulationStore } from "@/store/simulation";
import { createBaseTypesConfig } from "@/lib/config/types";
import { PROVIDED_TOGGLE_RANDOMIZE_CONFIG } from "@/components/config-editor/constants";
import ConfigSection from '@/components/config-editor/components/containers/config-section.vue';
import ConfigMatrix from '@/components/config-editor/components/inputs/config-matrix.vue';
import ConfigList from '@/components/config-editor/components/inputs/config-list.vue';
import InputHeader from "@/components/config-editor/components/base/input-header.vue";

const configStore = useConfigStore();
const typesConfig = configStore.typesConfig;
const typesSymmetricConfig = configStore.typesSymmetricConfig;

const {
  clearAtoms,
  refillAtoms,
} = useSimulationStore();

const setDefaultTypesConfig = () => {
  if (!confirm('Are you sure?')) {
    return;
  }

  const defaultConfig = createBaseTypesConfig();

  if (defaultConfig.COLORS.length !== typesConfig.COLORS.length) {
    defaultConfig.COLORS = typesConfig.COLORS;
  }

  if (defaultConfig.FREQUENCIES.length !== typesConfig.FREQUENCIES.length) {
    clearAtoms!(true);
    configStore.setDefaultTypesConfig();
    refillAtoms!(true);
  } else {
    configStore.setDefaultTypesConfig();
  }
};

const toggleRandomizeConfig = inject<() => boolean>(PROVIDED_TOGGLE_RANDOMIZE_CONFIG);
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
        <button class="btn btn-outline-secondary" @click="toggleRandomizeConfig">Randomize</button>
        <button class="btn btn-outline-secondary" @click="setDefaultTypesConfig">Default</button>
        <button class="btn btn-outline-secondary" @click="refill">Refill</button>
        <button class="btn btn-outline-secondary" @click="configStore.appendType">Add type</button>
      </div>
      <div>
        <input-header
          name="Initial Frequencies"
          tooltip="Ratio of the number of particles that will be generated on refill."
          position="center"
        />
        <config-list :values="typesConfig.FREQUENCIES" :colors="typesConfig.COLORS" :step="0.1" />
      </div>
      <div>
        <input-header
          name="Gravity"
          tooltip="Gravity coefficient matrix for unlinked particles shows whether a particle of one type will attract or
                   repel a particle of another type in the case when they are not linked to each other, and with what force."
          position="center"
        />
        <config-matrix
          :values="typesConfig.GRAVITY"
          :colors="typesConfig.COLORS"
          :step="0.1"
          v-model:symmetric="typesSymmetricConfig.GRAVITY_MATRIX_SYMMETRIC"
        />
      </div>
      <div>
        <input-header
          name="Link Gravity"
          tooltip="Gravity coefficient matrix for linked particles shows whether a particle of one type will attract or
                   repel a particle of another type in the case when they are linked to each other, and with what force."
          position="center"
        />
        <config-matrix
          :values="typesConfig.LINK_GRAVITY"
          :colors="typesConfig.COLORS"
          :step="0.1"
          v-model:symmetric="typesSymmetricConfig.LINK_GRAVITY_MATRIX_SYMMETRIC"
        />
      </div>
      <div>
        <input-header
          name="Links"
          tooltip="Connection limit map shows the maximum number of links for particles of each type."
          position="center"
        />
        <config-list
          :values="typesConfig.LINKS"
          :colors="typesConfig.COLORS"
          :step="1"
          :min="0"
        />
      </div>
      <div>
        <input-header
          name="Type Links"
          tooltip="Connection limit matrix shows the maximum number of connections that particles of each type can have
                   with particles of different types."
          position="center"
        />
        <config-matrix
          :values="typesConfig.TYPE_LINKS"
          :colors="typesConfig.COLORS"
          :step="1"
          :min="0"
          v-model:symmetric="typesSymmetricConfig.LINK_TYPE_MATRIX_SYMMETRIC"
        />
      </div>
      <div>
        <input-header
          name="Links Distance Factor"
          tooltip="Matrix of influence on neighbors links shows how particles of each type affect the maximum length of
                   links of neighboring particles of different types."
          position="center"
        />
        <config-matrix
          :values="typesConfig.LINK_FACTOR_DISTANCE"
          :colors="typesConfig.COLORS"
          :step="0.1"
          :min="0"
          v-model:symmetric="typesSymmetricConfig.LINK_FACTOR_DISTANCE_MATRIX_SYMMETRIC"
        />
      </div>
    </template>
  </config-section>
</template>

<style scoped lang="scss">

@import "../../assets/config-editor";

</style>
