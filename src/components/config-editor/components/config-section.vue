<script setup lang="ts">

</script>

<template>
  <div class="section">
    <h4>
      <slot name="title" />
    </h4>
    <slot name="body" />
  </div>
</template>

<style scoped lang="scss">

@import "../assets/config-editor.scss";

</style>
