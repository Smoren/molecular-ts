import { type Ref, ref, watch } from "vue";
import { defineStore } from "pinia";
import type { InitialConfig, TypesConfig, WorldConfig } from "@/lib/types/config";
import { createBaseWorldConfig } from "@/lib/config/world";
import { createBaseTypesConfig } from "@/lib/config/types";
import { create3dBaseInitialConfig } from "@/lib/config/initial";
import { fullCopyObject } from "@/helpers/utils";

export const useConfigStore = defineStore("config", () => {
  const worldConfigRaw: WorldConfig = createBaseWorldConfig();
  const typesConfigRaw: TypesConfig = createBaseTypesConfig();
  const initialConfigRaw: InitialConfig = create3dBaseInitialConfig();

  const worldConfig: Ref<WorldConfig> = ref(fullCopyObject(worldConfigRaw));
  const typesConfig: Ref<TypesConfig> = ref(fullCopyObject(typesConfigRaw));
  const initialConfig: Ref<InitialConfig> = ref(fullCopyObject(initialConfigRaw));

  const getConfigValues = () => {
    return {
      worldConfig: worldConfigRaw,
      typesConfig: typesConfigRaw,
      initialConfig: initialConfigRaw,
    }
  }

  const setInitialConfig = <T>(newConfig: InitialConfig) => {
    const buf = fullCopyObject(newConfig);
    for (const i in newConfig) {
      (initialConfigRaw[i as keyof InitialConfig] as T) = buf[i as keyof InitialConfig] as T;
    }
  }

  watch(worldConfigRaw, <T>(newConfig: WorldConfig) => {
    const buf = fullCopyObject(newConfig);
    for (const i in newConfig) {
      (worldConfigRaw[i as keyof WorldConfig] as T) = buf[i as keyof WorldConfig] as T;
    }
  }, { deep: true });

  watch(typesConfig, <T>(newConfig: TypesConfig) => {
    console.log('new!!!');
    const buf = fullCopyObject(newConfig);
    for (const i in newConfig) {
      (typesConfigRaw[i as keyof TypesConfig] as T) = buf[i as keyof TypesConfig] as T;
    }
  }, { deep: true });

  watch(initialConfig, <T>(newConfig: InitialConfig) => {
    const buf = fullCopyObject(newConfig);
    for (const i in newConfig) {
      (initialConfigRaw[i as keyof InitialConfig] as T) = buf[i as keyof InitialConfig] as T;
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
