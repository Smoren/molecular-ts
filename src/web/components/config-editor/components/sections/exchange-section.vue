<script setup lang="ts">

import { useConfigStore } from "@/web/store/config";
import { useSimulationStore } from "@/web/store/simulation";
import type { TypesConfig } from "@/lib/types/config";
import ImportButton from "@/web/components/config-editor/inputs/import-button.vue";
import ExportButton from "@/web/components/config-editor/inputs/export-button.vue";
import InputHeader from "@/web/components/base/input-header.vue";

const configStore = useConfigStore();
const simulation = useSimulationStore();

const exportConfigGetter = () => {
  return configStore.exportConfig();
}

const onImportConfigStart = () => {
  simulation.clearAtoms(true);
}

const importConfig = (data: Record<string, unknown>) => {
  configStore.importConfig(data);
  simulation.refillAtoms(true);
}

const addTypesConfig = (data: Record<string, unknown>) => {
  configStore.addTypesFromConfig(data.typesConfig! as TypesConfig);
  simulation.refillAtoms(true);
}

const exportStateGetter = () => {
  return simulation.exportState();
}

const onImportError = (e: Error) => {
  alert('Import error: ' + e.message);
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
      name="Config modification"
      tooltip="Modify types config by adding types from another config."
  />
  <div class="btn-group" role="group">
    <import-button title="Add types from config" @success="addTypesConfig" @start="onImportConfigStart" @error="onImportError" />
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
