<script setup lang="ts">

import { useConfigStore } from "@/web/store/config";
import ConfigSection from "@/web/components/config-editor/components/containers/config-section.vue";

const configStore = useConfigStore();

</script>

<template>
  <config-section>
    <template #title>
      Edit types config
    </template>
    <template #body>
      <div>
        Under construction...
      </div>
    </template>
  </config-section>
</template>

<style scoped lang="scss">

@import "../../assets/config-editor";

</style>
