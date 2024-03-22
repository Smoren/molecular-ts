<script setup lang="ts">

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

</script>

<template>
  <nav class="navbar bg-body-tertiary fixed-top">
    <div class="container-fluid">
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#left-bar"
        aria-controls="left-bar"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <a class="navbar-brand" href="#">Molecular TS</a>
      <div
        class="offcanvas offcanvas-start"
        tabindex="-1"
        id="left-bar"
        aria-labelledby="left-bar-label"
        data-bs-backdrop="false"
        data-bs-scroll="true"
      >
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="left-bar-label">Molecular TS</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          Test
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">

</style>
