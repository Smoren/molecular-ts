<script setup lang="ts">

import { type Ref, ref } from "vue";
import { useConfigStore } from "@/store/config";
import { useSimulationStore } from "@/store/simulation";
import ImportButton from "@/components/config-editor/components/inputs/import-button.vue";

const configStore = useConfigStore();
const simulation = useSimulationStore();

const copyShareLink = () => {
  navigator.clipboard.writeText(`${location.origin}${location.pathname}#${configStore.exportConfigBase64()}`);
}

const exportConfig = () => {
  exportJsonFile(configStore.exportConfig(), 'molecular-config.json');
}

const onImportStart = () => {
  simulation.clearAtoms();
}
const importConfig = (data: Record<string, unknown>) => {
  configStore.importConfig(data);
  simulation.refillAtoms();
}

const formatJsonString = (jsonStr: string) => {
  const regex = /(\[)([\d\s.,-]+)(])/g;
  jsonStr = jsonStr.replace(regex, function(_, p1, p2, p3) {
    let numbersOnly = p2.replace(/\s+/g, ' ');
    return p1 + numbersOnly + p3;
  });
  jsonStr = jsonStr.replace(/\[ /g, '[');
  jsonStr = jsonStr.replace(/([0-9]) ]/g, '$1]');

  return jsonStr;
}

const exportJsonFile = (data: Record<string, unknown>, filename: string) => {
  let jsonStr = formatJsonString(JSON.stringify(data, null, 4));

  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

</script>

<template>
  <button class="btn btn-primary" @click="copyShareLink" style="width: 100%;">
    Copy configuration share link
  </button>
  <br /><br />
  <div class="btn-group" role="group" style="width: 100%">
    <import-button title="Import config" @success="importConfig" @start="onImportStart" />
    <button class="btn btn-outline-secondary" @click="exportConfig">
      Export config
    </button>
  </div>
</template>

<style scoped lang="scss">

@import "../../assets/config-editor.scss";

</style>
