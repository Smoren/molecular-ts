<script setup lang="ts">

import { ref } from "vue";
import { useConfigStore } from "@/store/config";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const configStore = useConfigStore();

const copyShareLink = () => {
  navigator.clipboard.writeText(`${location.origin}${location.pathname}#${configStore.exportConfigBase64()}`);
}

const DEFAULT_TITLE = "Copy configuration share link";
const TEMP_TITLE = "Copied!";
const title = ref(DEFAULT_TITLE);

const onClick = () => {
  copyShareLink();
  title.value = TEMP_TITLE;
  setTimeout(() => {
    title.value = DEFAULT_TITLE;
  }, 1000);
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
