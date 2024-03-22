import { type Ref, ref, watch } from "vue";
import { defineStore } from "pinia";
import type { InitialConfig, TypesConfig, WorldConfig } from "@/lib/types/config";
import { createBaseWorldConfig } from "@/lib/config/world";
import { createBaseTypesConfig } from "@/lib/config/types";
import { create3dBaseInitialConfig } from "@/lib/config/initial";

export const useConfigStore = defineStore("config", () => {
  const worldConfigRaw: WorldConfig = createBaseWorldConfig();
  const typesConfigRaw: TypesConfig = createBaseTypesConfig();
  let initialConfigRaw: InitialConfig = create3dBaseInitialConfig();

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

  const setInitialConfig = <T>(newConfig: InitialConfig) => {
    for (const i in newConfig) {
      (initialConfigRaw[i as keyof InitialConfig] as T) = newConfig[i as keyof InitialConfig] as T;
    }
  }

  watch(worldConfigRaw, <T>(newConfig: WorldConfig) => {
    for (const i in newConfig) {
      (worldConfigRaw[i as keyof WorldConfig] as T) = newConfig[i as keyof WorldConfig] as T;
    }
  }, { deep: true });

  watch(typesConfig, <T>(newConfig: TypesConfig) => {
    for (const i in newConfig) {
      (typesConfigRaw[i as keyof TypesConfig] as T) = newConfig[i as keyof TypesConfig] as T;
    }
  }, { deep: true });

  watch(initialConfig, <T>(newConfig: InitialConfig) => {
    for (const i in newConfig) {
      (initialConfigRaw[i as keyof InitialConfig] as T) = newConfig[i as keyof InitialConfig] as T;
    }
  }, { deep: true });

  return {
    worldConfig,
    typesConfig,
    initialConfig,
    getConfigValues,
    setInitialConfig,
  }
});
