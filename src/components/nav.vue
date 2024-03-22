<script setup lang="ts">

import 'bootstrap/dist/css/bootstrap.min.css';
import {useSwitch} from "@/hooks/use-switch";

const leftBarVisible = useSwitch(false);
const rightBarVisible = useSwitch(false);

</script>

<template>
  <nav class="navbar bg-body-tertiary fixed-top">
    <div class="container-fluid">
      <button
        class="navbar-toggler"
        type="button"
        @click="leftBarVisible.on()"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <a class="navbar-brand" href="#">Molecular TS</a>

      <div
        :class="{ 'show': leftBarVisible.state.value }"
        class="offcanvas offcanvas-start"
      >
        <div class="offcanvas-header">
          <h5 class="offcanvas-title">Molecular TS</h5>
          <button
            type="button"
            class="btn-close"
            @click="leftBarVisible.off()"
          ></button>
        </div>
        <div class="offcanvas-body">
          Left bar

          <button class="btn btn-primary" @click="rightBarVisible.on()">
            Open right
          </button>
        </div>
      </div>

      <div
        :class="{ 'show': rightBarVisible.state.value }"
        class="offcanvas offcanvas-end"
      >
        <div class="offcanvas-header">
          <button
              type="button"
              class="btn-close"
              @click="rightBarVisible.off()"
          ></button>
        </div>
        <div class="offcanvas-body">
          Right bar
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">

</style>
