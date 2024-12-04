<script setup lang="ts">

import { ref } from "vue";
import { getColorString } from "@/web/components/config-editor/utils";

withDefaults(defineProps<{
  color: [number, number, number];
  actions: [string, string][];
  align?: 'left' | 'right';
}>(), {
  align: 'left',
});

const emit = defineEmits<{
  choose: [action: string];
}>();

const isActive = ref(false);

const toggleClass = () => {
  isActive.value = !isActive.value;
};

const deactivate = () => {
  isActive.value = false;
}

</script>

<template>
  <div class="btn-group" @focusout="deactivate">
    <button
      type="button"
      class="btn dropdown-toggle"
      data-bs-toggle="dropdown"
      :aria-expanded="isActive"
      :class="{ show: isActive }"
      :style="{ backgroundColor: getColorString(color) }"
      @click="toggleClass"
    ></button>
    <ul class="dropdown-menu" :class="{ show: isActive, 'dropdown-menu-end': align === 'right' }">
      <li v-for="([action, title], index) in actions" :key="index" @mousedown="emit('choose', action)">
        <a class="dropdown-item" href="javascript:void(0)">{{ title }}</a>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
  .dropdown-toggle {
    border-radius: 0;
    color: black;
    font-size: 20px;
    padding: 0;
    border: 0
  }

  .dropdown-menu {
    transform: translate(0px, 30px);
    background: #1e1e1e;
    border: 1px solid rgb(115, 115, 115);
    border-radius: 0;
  }

  .dropdown-menu-end {
    right: 0;
  }
</style>
