<script setup lang="ts">

import { useConfigStore } from "@/store/config";

const configStore = useConfigStore();

const copyShareLink = () => {
  navigator.clipboard.writeText(`${location.origin}${location.pathname}#${configStore.exportConfigBase64()}`);
}

const exportConfig = () => {
  const filename = 'molecular-config.json';
  exportJsonFile(configStore.exportConfig(), 'molecular-config.json');
  console.log('export config');
}

const importConfig = () => {
  console.log('import config');
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
</template>

<style scoped lang="scss">

@import "../../assets/config-editor.scss";

</style>