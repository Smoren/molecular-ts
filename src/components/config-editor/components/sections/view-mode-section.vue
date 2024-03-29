<script setup lang="ts">

import type { ViewMode } from "@/store/config";

const modelValue = defineModel<ViewMode>();

</script>

<template>
  <div class="section" style="font-size: 20px">
    <label>
      <input type="radio" name="view-mode" v-model="modelValue" value="3d">
      3D
    </label>
    &nbsp;
    <label>
      <input type="radio" name="view-mode" v-model="modelValue" value="2d">
      2D
    </label>
  </div>
</template>
