import { type Ref, ref, watch } from "vue";
import { defineStore } from "pinia";
import type { InitialConfig, TypesConfig, WorldConfig } from "@/lib/types/config";
import { createBaseWorldConfig } from "@/lib/config/world";
import { createBaseTypesConfig } from "@/lib/config/types";
import { create3dBaseInitialConfig } from "@/lib/config/initial";

export const useConfigStore = defineStore("config", () => {
  const worldConfigRaw: WorldConfig = createBaseWorldConfig();
  const typesConfigRaw: TypesConfig = createBaseTypesConfig();
  const initialConfigRaw: InitialConfig = create3dBaseInitialConfig();

  const worldConfig: Ref<WorldConfig> = ref(worldConfigRaw);
  const typesConfig: Ref<TypesConfig> = ref(typesConfigRaw);
  const initialConfig: Ref<InitialConfig> = ref(initialConfigRaw);

  const getConfigValues = () => {
    return {
      worldConfig: worldConfigRaw,
      typesConfig: typesConfigRaw,
      initialConfig: initialConfigRaw,
    }
  }

  watch(worldConfigRaw, (newConfig) => {
    for (const i in newConfig) {
      // @ts-ignore
      worldConfigRaw[i] = newConfig[i];
    }
  }, { deep: true });

  watch(typesConfig, (newConfig) => {
    for (const i in newConfig) {
      // @ts-ignore
      typesConfigRaw[i] = newConfig[i];
    }
  }, { deep: true });

  watch(initialConfig, (newConfig) => {
    for (const i in newConfig) {
      // @ts-ignore
      initialConfigRaw[i] = newConfig[i];
    }
  }, { deep: true });

  return {
    worldConfig,
    typesConfig,
    initialConfig,
    getConfigValues,
  }
});
