import type { RandomTypesConfig } from "@/lib/config/types";
import { defineStore } from "pinia";
import { useLocalStore } from "./local";
import { ref } from "vue";

type StoredRandomTypesConfig = {
  name: string;
  value: RandomTypesConfig;
};

export const useSnippetsStore = defineStore("snippets", () => {
  const localStore = useLocalStore();
  const randomTypesConfigList = ref<StoredRandomTypesConfig[]>(localStore.get('randomTypesConfig') ?? []);

  const updateRandomTypesConfigList = () => {
    randomTypesConfigList.value = localStore.get('randomTypesConfig') ?? [];
  }

  const getRandomTypesConfigItem = (index: number): StoredRandomTypesConfig => {
    return localStore.getFromArray('randomTypesConfig', index) as StoredRandomTypesConfig;
  }

  const addRandomTypesConfig = (config: RandomTypesConfig, name: string) => {
    localStore.addToArray('randomTypesConfig', { name, value: config});
    updateRandomTypesConfigList();
  }

  const removeRandomTypesConfig = (index: number) => {
    localStore.removeFromArray('randomTypesConfig', index);
    updateRandomTypesConfigList();
  }

  return {
    randomTypesConfigList,
    getRandomTypesConfigItem,
    addRandomTypesConfig,
    removeRandomTypesConfig,
  }
});
