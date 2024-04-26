<script setup lang="ts">

import { useConfigStore } from "@/store/config";
import { useSimulationStore } from "@/store/simulation";
import ImportButton from "@/components/config-editor/components/inputs/import-button.vue";
import ExportButton from "@/components/config-editor/components/inputs/export-button.vue";

const configStore = useConfigStore();
const simulation = useSimulationStore();

const copyShareLink = () => {
  navigator.clipboard.writeText(`${location.origin}${location.pathname}#${configStore.exportConfigBase64()}`);
}

const exportConfigGetter = () => {
  return configStore.exportConfig();
}

const onImportStart = () => {
  simulation.clearAtoms();
}

const importConfig = (data: Record<string, unknown>) => {
  configStore.importConfig(data);
  simulation.refillAtoms();
}

</script>

<template>
  <button class="btn btn-primary" @click="copyShareLink" style="width: 100%;">
    Copy configuration share link
  </button>
  <br /><br />
  <div class="btn-group" role="group" style="width: 100%">
    <import-button title="Import config" @success="importConfig" @start="onImportStart" />
    <export-button title="Export config" file-name="molecular-config.json" :data-getter="exportConfigGetter" />
  </div>
</template>

<style scoped lang="scss">

@import "../../assets/config-editor.scss";

</style>
