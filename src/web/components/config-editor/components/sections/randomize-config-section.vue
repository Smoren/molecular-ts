<script setup lang="ts">

import { computed, type Ref, ref, watch } from "vue";
import { useConfigStore } from "@/web/store/config";
import { useSimulationStore } from "@/web/store/simulation";
import ConfigSection from '@/web/components/config-editor/components/containers/config-section.vue';
import ConfigBounds from "@/web/components/config-editor/components/inputs/config-bounds.vue";
import InitialConfigSection from "@/web/components/config-editor/components/sections/initial-config-section.vue";
import Flag from "@/web/components/config-editor/components/inputs/flag.vue";
import InputHeader from "@/web/components/config-editor/components/base/input-header.vue";
import RandomizeConfigSnippets from "@/web/components/config-editor/components/widgets/randomize-config-snippets.vue";

const configStore = useConfigStore();
const { randomTypesConfig, typesConfig } = configStore;

const {
  clearAtoms,
  refillAtoms,
} = useSimulationStore();

const forceRefill = ref(false);

const needRefill = computed((): boolean => {
  return randomTypesConfig.TYPES_COUNT !== configStore.typesConfig.COLORS.length ||
    randomTypesConfig.USE_FREQUENCY_BOUNDS || forceRefill.value;
});

const useIgnoreSubMatricesBoundaryIndex: Ref<boolean> = ref(false);
const ignoreSubMatricesBoundaryIndex: Ref<number | undefined> = ref(3);

watch(useIgnoreSubMatricesBoundaryIndex, () => {
  if (useIgnoreSubMatricesBoundaryIndex.value) {
    randomTypesConfig.TYPES_COUNT = typesConfig.FREQUENCIES.length;
  }
});

const randomizeTypesConfig = () => {
  if (!confirm('Are you sure?')) {
    return;
  }

  const crossValue = useIgnoreSubMatricesBoundaryIndex.value
    ? ignoreSubMatricesBoundaryIndex.value
    : undefined;

  if (needRefill.value) {
    clearAtoms!(true);
    configStore.randomizeTypesConfig(crossValue);
    refillAtoms!(true);
  } else {
    configStore.randomizeTypesConfig(crossValue);
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

      <div v-show="!useIgnoreSubMatricesBoundaryIndex">
        <input-header
          name="Radius"
          tooltip="Radius of each type of particles."
          tooltip-position="left"
          :tooltip-width="400"
        >
          <input type="checkbox" class="title-flag" v-model="randomTypesConfig.USE_RADIUS_BOUNDS" />
        </input-header>
        <div v-show="randomTypesConfig.USE_RADIUS_BOUNDS">
          <config-bounds
            :step="1"
            :values="randomTypesConfig.RADIUS_BOUNDS"
          />
        </div>
      </div>

      <div v-show="!useIgnoreSubMatricesBoundaryIndex">
        <input-header
          name="Frequencies"
          tooltip="Ratio of the number of particles that will be generated on refill."
          tooltip-position="left"
          :tooltip-width="400"
        >
          <input type="checkbox" class="title-flag" v-model="randomTypesConfig.USE_FREQUENCY_BOUNDS" />
        </input-header>
        <div v-show="randomTypesConfig.USE_FREQUENCY_BOUNDS">
          <config-bounds
            :step="1"
            :values="randomTypesConfig.FREQUENCY_BOUNDS"
          />
        </div>
      </div>

      <div>
        <input-header
          name="Gravity"
          tooltip="Gravity coefficient matrix for unlinked particles shows whether a particle of one type will attract or
                 repel a particle of another type in the case when they are not linked to each other, and with what force."
          tooltip-position="left"
        >
          <input type="checkbox" class="title-flag" v-model="randomTypesConfig.USE_GRAVITY_BOUNDS" />
        </input-header>
        <div v-show="randomTypesConfig.USE_GRAVITY_BOUNDS">
          <config-bounds
            :step="1"
            :values="randomTypesConfig.GRAVITY_BOUNDS"
          />
          <flag title="Symmetric" v-model="randomTypesConfig.GRAVITY_MATRIX_SYMMETRIC" />
        </div>
      </div>

      <div>
        <input-header
          name="Link Gravity"
          tooltip="Gravity coefficient matrix for linked particles shows whether a particle of one type will attract or
                 repel a particle of another type in the case when they are linked to each other, and with what force."
          tooltip-position="left"
        >
          <input type="checkbox" class="title-flag" v-model="randomTypesConfig.USE_LINK_GRAVITY_BOUNDS" />
        </input-header>
        <div v-show="randomTypesConfig.USE_LINK_GRAVITY_BOUNDS">
          <config-bounds
            :step="1"
            :values="randomTypesConfig.LINK_GRAVITY_BOUNDS"
          />
        <flag title="Symmetric" v-model="randomTypesConfig.LINK_GRAVITY_MATRIX_SYMMETRIC" />
        </div>
      </div>

      <div v-show="!useIgnoreSubMatricesBoundaryIndex">
        <input-header
          name="Links Count"
          tooltip="Connection limit map shows the maximum number of links for particles of each type."
          tooltip-position="left"
        >
          <input type="checkbox" class="title-flag" v-model="randomTypesConfig.USE_LINK_BOUNDS" />
        </input-header>
        <div v-show="randomTypesConfig.USE_LINK_BOUNDS">
          <config-bounds :step="1" :values="randomTypesConfig.LINK_BOUNDS" />
        </div>
      </div>

      <div>
        <input-header
          name="Types Links Count"
          tooltip="Connection limit matrix shows the maximum number of connections that particles of each type can have
                   with particles of different types."
          tooltip-position="left"
        >
          <input type="checkbox" class="title-flag" v-model="randomTypesConfig.USE_LINK_TYPE_BOUNDS" />
        </input-header>
        <div v-show="randomTypesConfig.USE_LINK_TYPE_BOUNDS">
          <config-bounds :step="1" :values="randomTypesConfig.LINK_TYPE_BOUNDS" />
          <flag title="Symmetric" v-model="randomTypesConfig.LINK_TYPE_MATRIX_SYMMETRIC" />
        </div>
      </div>

      <div>
        <input-header
          name="Types Link Weights"
          tooltip="Connection weight matrix shows the connection weights that particles of each type have
                   with particles of different types."
          tooltip-position="left"
        >
          <input type="checkbox" class="title-flag" v-model="randomTypesConfig.USE_LINK_TYPE_WEIGHT_BOUNDS" />
        </input-header>
        <div v-show="randomTypesConfig.USE_LINK_TYPE_WEIGHT_BOUNDS">
          <config-bounds :step="1" :values="randomTypesConfig.LINK_TYPE_WEIGHT_BOUNDS" />
          <flag title="Symmetric" v-model="randomTypesConfig.LINK_TYPE_WEIGHT_MATRIX_SYMMETRIC" />
        </div>
      </div>

      <div>
        <input-header
          name="Links Distance Factor"
          tooltip="Matrix of influence on neighbors links shows how particles of each type affect the maximum length of
                   links of neighboring particles of different types."
          tooltip-position="left"
        >
          <input type="checkbox" class="title-flag" v-model="randomTypesConfig.USE_LINK_FACTOR_DISTANCE_BOUNDS" />
        </input-header>
        <div v-show="randomTypesConfig.USE_LINK_FACTOR_DISTANCE_BOUNDS">
          <config-bounds
            name="Links Distance Factor"
            :step="0.1"
            :values="randomTypesConfig.LINK_FACTOR_DISTANCE_BOUNDS"
          />
          <div class="grid-wrapper">
            <div>
              <flag
                title="Symmetric"
                v-model="randomTypesConfig.LINK_FACTOR_DISTANCE_MATRIX_SYMMETRIC"
              />
            </div>
            <div>
              <flag
                title="Ignore self type"
                v-model="randomTypesConfig.LINK_FACTOR_DISTANCE_IGNORE_SELF_TYPE"
                style="text-align: center;"
              />
            </div>
            <div>
              <flag
                title="Extended"
                v-model="randomTypesConfig.LINK_FACTOR_DISTANCE_EXTENDED"
                style="text-align: right;"
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <flag
          title="Leave submatrices unchanged on boundary index"
          v-model="useIgnoreSubMatricesBoundaryIndex"
        />
        <input
          v-show="useIgnoreSubMatricesBoundaryIndex"
          type="number"
          v-model="ignoreSubMatricesBoundaryIndex"
          placeholder="Cross position"
        />
      </div>
      <div>
        <flag
          title="Force refill"
          v-model="forceRefill"
        />
      </div>
      <div v-if="needRefill">
        <br />
        <initial-config-section :with-buttons="false" />
      </div>
      <br />
      <button class="btn btn-outline-primary" @click="randomizeTypesConfig" style="width: 100%;">
        {{ needRefill ? 'Randomize and Refill' : 'Randomize' }}
      </button>
      <br />
      <br />
      <br />
      <h4>Snippets</h4>
      <randomize-config-snippets />
    </template>
  </config-section>
</template>

<style scoped lang="scss">

@import "../../assets/config-editor";

.title-flag {
  margin-right: 5px;
}

.grid-wrapper {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.grid-wrapper > div {
  flex: 1 1;
}
</style>
