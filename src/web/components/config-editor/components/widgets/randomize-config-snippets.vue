<script setup lang="ts">

import { ref } from "vue";
import { useSnippetsStore } from "@/web/store/snippets";
import { useConfigStore } from "@/web/store/config";
import type { RandomTypesConfig } from "@/lib/config/types";
import { useI18nStore } from "@/web/store/i18n";

const snippetsStore = useSnippetsStore();
const configStore = useConfigStore();
const i18n = useI18nStore();

const newSnippetName = ref('');
const saveSnippet = () => {
  snippetsStore.addRandomTypesConfig(configStore.randomTypesConfig, newSnippetName.value);
  newSnippetName.value = '';
}
const removeSnippet = (index: number) => {
  if (!confirm(i18n.t('Are you sure?'))) {
    return;
  }

  snippetsStore.removeRandomTypesConfig(index);
}
const applySnippet = (config: RandomTypesConfig) => {
  console.log('APPLY', config);
  configStore.setRandomTypesConfig(config, ['TYPES_COUNT']);
}

</script>

<template>
  <div class="input-group mb-3">
    <input type="text" class="form-control" :placeholder="i18n.t('Input snippet name')" v-model="newSnippetName" />
    <div class="input-group-append">
      <button class="btn btn-outline-secondary" @click="saveSnippet" :disabled="!newSnippetName">{{ i18n.t('Save') }}</button>
    </div>
  </div>
  <div class="list-group">
    <div class="list-group-item d-flex justify-content-between align-items-center" v-for="(snippet, index) in snippetsStore.randomTypesConfigList" :key="index">
      <div class="list-item__name">
        {{ snippet.name }}
      </div>
      <div class="btn-group">
        <button class="btn btn-outline-secondary" @click="removeSnippet(index)">{{ i18n.t('Remove') }}</button>
        <button class="btn btn-outline-secondary" @click="applySnippet(snippet.value)">{{ i18n.t('Apply') }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
