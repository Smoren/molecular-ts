<script setup lang="ts">

import type { TransformationConfig } from "@/lib/types/config";
import { ref, watch } from "vue";
import TypeSelect from "@/web/components/inputs/type-select.vue";

const modelValue = defineModel<TransformationConfig>();
defineProps<{
  colors: [number, number, number][];
}>();

const transformations = ref<[number, number, number][]>([]);
const syncForward = () => {
  transformations.value = [];
  for (const i in modelValue.value) {
    for (const j in modelValue.value[Number(i)]) {
      transformations.value.push([Number(i), Number(j), modelValue.value[Number(i)][Number(j)]]);
    }
  }
}

const syncBackward = () => {
  for (const i in modelValue.value) {
    delete modelValue.value[Number(i)];
  }
  for (const [lhs, rhs, type] of transformations.value) {
    if (!(lhs in modelValue.value!)) {
      modelValue.value![lhs] = {};
    }
    modelValue.value![lhs][rhs] = type;
  }
}

watch(modelValue, syncForward);
watch(transformations, syncBackward, { deep: true });

const addTransformation = () => {
  transformations.value.push([0, 0, 0]);
}

const removeTransformation = (index: number) => {
  transformations.value.splice(index, 1);
}

</script>

<template>
  <div class="input-group mb-3">
    <div class="input-group-append">
      <button class="btn btn-outline-secondary" @click="addTransformation">Add rule</button>
    </div>
  </div>
  <div class="list-group">
    <div class="list-group-item d-flex justify-content-between align-items-center" v-for="(transform, index) in transformations" :key="`${transform[0]}-${transform[1]}`">
      <div class="list-item__name">
        <div>
          <type-select :colors="colors" v-model="transform[0]" />
        </div>
        <div>
          +
        </div>
        <div>
          <type-select :colors="colors" v-model="transform[1]" />
        </div>
        <div>
          ➔
        </div>
        <div>
          <type-select :colors="colors" v-model="transform[2]" />
        </div>
      </div>
      <div class="btn-group">
        <button class="btn btn-outline-secondary" @click="removeTransformation(index)">Remove</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

.list-item__name > div {
  display: inline-block;
  padding-right: 15px;
}

</style>
