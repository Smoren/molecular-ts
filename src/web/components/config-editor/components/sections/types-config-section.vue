<script setup lang="ts">

import { computed } from "vue";
import { useConfigStore } from '@/web/store/config';
import { useSimulationStore } from "@/web/store/simulation";
import { clearInactiveParams, creatDefaultTypesConfig } from "@/lib/config/atom-types";
import ConfigSection from '@/web/components/config-editor/components/containers/config-section.vue';
import ConfigMatrix from '@/web/components/inputs/config-matrix.vue';
import ConfigList from '@/web/components/inputs/config-list.vue';
import InputHeader from "@/web/components/base/input-header.vue";
import ConfigTensor from "@/web/components/inputs/config-tensor.vue";
import TransformationConfig from "@/web/components/config-editor/components/widgets/transformation-config.vue";
import { useRightBarStore } from '@/web/store/right-bar';

const configStore = useConfigStore();
const rightBarStore = useRightBarStore();
const typesConfig = configStore.typesConfig;
const typesSymmetricConfig = configStore.typesSymmetricConfig;

const {
  clearAtoms,
  refillAtoms,
} = useSimulationStore();

const clean = () => {
  clearInactiveParams(typesConfig);
}

const clone = () => {
  configStore.cloneType(0);
}

const setDefaultTypesConfig = () => {
  if (!confirm('Are you sure?')) {
    return;
  }

  const defaultConfig = creatDefaultTypesConfig();

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

const refill = () => {
  if (confirm('Are you sure?')) {
    refillAtoms!();
  }
};

const removeType = (index: number) => {
  if (confirm('Are you sure to remove type?')) {
    configStore.removeTypeFromConfig(index);
    refillAtoms!(true);
  }
}

const linkDistanceFactorConfigDescription = computed(() => {
  return "Tensor of influence on neighbors links shows how particles of each type affect " +
      "the maximum length of links of neighboring particles of different types with particles of specific types."
});

const linkElasticFactorConfigDescription = computed(() => {
  return "Tensor of influence on neighbors links shows how particles of each type affect " +
      "the elastic force of links of neighboring particles of different types with particles of specific types."
});

</script>

<template>
  <config-section>
    <template #body>
      <div class="btn-group" role="group">
        <button class="btn btn-outline-secondary" @click="rightBarStore.toggle(rightBarStore.modes.RANDOMIZE)">Randomize</button>
        <button class="btn btn-outline-secondary" @click="rightBarStore.toggle(rightBarStore.modes.EDIT_TYPES)">Edit</button>
         <button class="btn btn-outline-secondary" @click="clone">Clone</button>
        <!-- <button class="btn btn-outline-secondary" @click="clean">Clean</button> -->
        <!-- <button class="btn btn-outline-secondary" @click="setDefaultTypesConfig">Default</button> -->
        <button class="btn btn-outline-secondary" @click="refill">Refill</button>
        <button class="btn btn-outline-secondary" @click="configStore.appendType">Add type</button>
      </div>
      <div>
        <input-header
          name="Initial Frequencies"
          tooltip="Ratio of the number of particles that will be generated on refill."
          position="center"
        />
        <config-list
          :values="typesConfig.FREQUENCIES"
          :colors="typesConfig.COLORS"
          :step="0.1"
          color-title="Remove type"
          color-cursor="pointer"
          @colorClick="removeType"
        />
      </div>
      <div>
        <input-header
          name="Radius"
          tooltip="Radius of each type of particles."
          position="center"
        />
        <config-list :values="typesConfig.RADIUS" :colors="typesConfig.COLORS" :step="0.1" />
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
          name="Type Link Weights"
          tooltip="The connection weight matrix shows the connection weights between each pair of types
                   in the left type link limit."
          position="center"
        />
        <config-matrix
          :values="typesConfig.TYPE_LINK_WEIGHTS"
          :colors="typesConfig.COLORS"
          :step="0.1"
          v-model:symmetric="typesSymmetricConfig.LINK_TYPE_WEIGHT_MATRIX_SYMMETRIC"
        />
      </div>
      <div>
        <input-header
          name="Links Distance Factor"
          :tooltip="linkDistanceFactorConfigDescription"
          position="center"
        />
        <config-tensor
          :values="typesConfig.LINK_FACTOR_DISTANCE"
          :colors="typesConfig.COLORS"
          :step="0.1"
          :min="0"
          v-model:symmetric="typesSymmetricConfig.LINK_FACTOR_DISTANCE_MATRIX_SYMMETRIC"
        />
      </div>
      <div>
        <input-header
          name="Links Elastic Factor"
          :tooltip="linkElasticFactorConfigDescription"
          position="center"
        />
        <config-tensor
          :values="typesConfig.LINK_FACTOR_ELASTIC"
          :colors="typesConfig.COLORS"
          :step="0.1"
          :min="0"
          v-model:symmetric="typesSymmetricConfig.LINK_FACTOR_ELASTIC_MATRIX_SYMMETRIC"
        />
      </div>
      <div style="margin-top: 30px;">
        <input-header
          name="Transformations on link creation"
          tooltip="Experimental feature. A + B ➔ C means that when the particle of type A connects to a particle of type B,
                   then the particle of type A changes its type to C."
        />
        <div style="margin-top: 10px;"></div>
        <transformation-config :colors="typesConfig.COLORS" v-model="typesConfig.TRANSFORMATION" />
      </div>
    </template>
  </config-section>
</template>

<style scoped lang="scss">

@import "../../assets/config-editor";

</style>
