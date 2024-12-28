<script setup lang="ts">

import 'bootstrap/dist/css/bootstrap.min.css';

defineProps<{
  onBurgerClick: () => void;
}>();

</script>

<template>
  <nav class="navbar bg-body-tertiary fixed-top">
    <div class="container-fluid">
      <button class="navbar-toggler" type="button" @click="onBurgerClick">
        <span class="navbar-toggler-icon"></span>
      </button>
      <a class="navbar-brand" href="#">
        <slot name="title" />
      </a>
      <slot name="body" />
    </div>
  </nav>
</template>

<style scoped lang="scss">

@use "../config-editor/assets/config-editor";

</style>
