<script setup lang="ts">

import { useConfigStore } from "@/store/config";
import { useSimulationStore } from "@/store/simulation";
import ImportButton from "@/components/config-editor/components/inputs/import-button.vue";
import ExportButton from "@/components/config-editor/components/inputs/export-button.vue";
import InputHeader from "@/components/config-editor/components/base/input-header.vue";

const configStore = useConfigStore();
const simulation = useSimulationStore();

const exportConfigGetter = () => {
  return configStore.exportConfig();
}

const onImportConfigStart = () => {
  simulation.clearAtoms();
}

const importConfig = (data: Record<string, unknown>) => {
  configStore.importConfig(data);
  simulation.refillAtoms();
}

const exportStateGetter = () => {
  return simulation.exportState();
}

const onImportError = (e: Error) => {
  console.warn(e);
}

const importState = (data: Record<string, unknown>) => {
  simulation.importState(data);
}

</script>

<template>
  <input-header
    name="Config"
    tooltip="Export and import world and types config using files."
  />
  <div class="btn-group" role="group">
    <import-button title="Import config" @success="importConfig" @start="onImportConfigStart" @error="onImportError" />
    <export-button title="Export config" file-name="molecular-config.json" :data-getter="exportConfigGetter" />
  </div>
  <br /><br />
  <input-header
    name="State"
    tooltip="Export and import atoms and links state using files."
  />
  <div class="btn-group" role="group">
    <import-button title="Import state" @success="importState" @error="onImportError" />
    <export-button title="Export state" file-name="molecular-state.json" :data-getter="exportStateGetter" />
  </div>
</template>

<style scoped lang="scss">

@import "../../assets/config-editor.scss";

.btn-group {
  margin-top: 10px;
  width: 100%;
}

</style>
