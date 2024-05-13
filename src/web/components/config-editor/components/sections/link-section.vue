<script setup lang="ts">

import { ref } from "vue";
import { useConfigStore } from "@/web/store/config";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const configStore = useConfigStore();

const getShareLink = () => {
  return `${location.origin}${location.pathname}#${configStore.exportConfigBase64()}`;
}

const copyShareLink = () => {
  navigator.clipboard.writeText(getShareLink());
}

const DEFAULT_TITLE = "Copy configuration share link";
const TEMP_TITLE = "[ COPIED ] Click another time to shorten!";
const title = ref(DEFAULT_TITLE);

const onClick = () => {
  if (title.value === TEMP_TITLE) {
    window.open(`https://linker.smoren.me/#${getShareLink()}`, '_blank')?.focus();
    return;
  }

  copyShareLink();
  title.value = TEMP_TITLE;
  setTimeout(() => {
    title.value = DEFAULT_TITLE;
  }, 2000);
}

</script>

<template>
  <button class="btn btn-primary" @click="onClick" style="width: 100%;">
    <span v-if="title === DEFAULT_TITLE">
      <font-awesome-icon icon="fa-solid fa-link" style="color: #fff" />
      &nbsp;
    </span>
    {{ title }}
  </button>
</template>

<style scoped lang="scss">

@import "../../assets/config-editor.scss";

</style>
