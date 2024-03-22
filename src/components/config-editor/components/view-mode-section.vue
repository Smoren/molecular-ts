<script setup lang="ts">

const modelValue = defineModel<'2d' | '3d'>();

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
