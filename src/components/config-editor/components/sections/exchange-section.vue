<script setup lang="ts">

import { type Ref, ref } from "vue";
import { useConfigStore } from "@/store/config";
import { useSimulationStore } from "@/store/simulation";

const configStore = useConfigStore();
const simulation = useSimulationStore();

const uploadFile: Ref<HTMLInputElement | null> = ref(null);

const copyShareLink = () => {
  navigator.clipboard.writeText(`${location.origin}${location.pathname}#${configStore.exportConfigBase64()}`);
}

const exportConfig = () => {
  exportJsonFile(configStore.exportConfig(), 'molecular-config.json');
}

const importConfig = () => {
  uploadFile.value?.click();
}

const exportJsonFile = (data: Record<string, unknown>, filename: string) => {
  const jsonStr = JSON.stringify(data, null, 4);

  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

const importJsonFile = () => {
  const file = uploadFile.value?.files![0];

  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = function(e) {
    try {
      simulation.clearAtoms();
      const fileContent = e.target!.result;
      const config = JSON.parse(fileContent as string);
      console.log('import json file', config);
      configStore.importConfig(config);
    } finally {
      simulation.refillAtoms();
      uploadFile.value!.value = '';
    }
  };

  reader.readAsText(file);
}

</script>

<template>
  <button class="btn btn-primary" @click="copyShareLink" style="width: 100%;">
    Copy configuration share link
  </button>
  <br /><br />
  <div class="btn-group" role="group" style="width: 100%">
    <button class="btn btn-outline-secondary" @click="importConfig">
      Import config
    </button>
    <button class="btn btn-outline-secondary" @click="exportConfig">
      Export config
    </button>
  </div>
  <div v-show="false">
    <input
      type="file"
      accept="application/json"
      ref="uploadFile"
      @change="importJsonFile"
    />
  </div>
</template>

<style scoped lang="scss">

@import "../../assets/config-editor.scss";

</style>