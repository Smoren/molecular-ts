import { type Ref, ref, watch } from "vue";
import { defineStore } from "pinia";
import type { InitialConfig, TypesConfig, WorldConfig } from "@/lib/types/config";
import { createBaseWorldConfig } from "@/lib/config/world";
import { createBaseTypesConfig, createRandomTypesConfig } from "@/lib/config/types";
import { create3dBaseInitialConfig } from "@/lib/config/initial";
import { fullCopyObject } from "@/helpers/utils";

export type ViewMode = '2d' | '3d';

export const useConfigStore = defineStore("config", () => {
  const worldConfigRaw: WorldConfig = createBaseWorldConfig();
  const typesConfigRaw: TypesConfig = createBaseTypesConfig();
  const initialConfigRaw: InitialConfig = create3dBaseInitialConfig();

  const worldConfig: Ref<WorldConfig> = ref(fullCopyObject(worldConfigRaw));
  const typesConfig: Ref<TypesConfig> = ref(fullCopyObject(typesConfigRaw));
  const initialConfig: Ref<InitialConfig> = ref(fullCopyObject(initialConfigRaw));

  const viewMode: Ref<ViewMode> = ref('3d');

  const getConfigValues = () => {
    return {
      worldConfig: worldConfigRaw,
      typesConfig: typesConfigRaw,
      initialConfig: initialConfigRaw,
    }
  }

  const setInitialConfigRaw = <T>(newConfig: InitialConfig) => {
    const buf = fullCopyObject(newConfig);
    for (const i in newConfig) {
      (initialConfigRaw[i as keyof InitialConfig] as T) = buf[i as keyof InitialConfig] as T;
    }
  }

  const setInitialConfig = <T>(newConfig: InitialConfig) => {
    const buf = fullCopyObject(newConfig);
    for (const i in newConfig) {
      (initialConfig.value[i as keyof InitialConfig] as T) = buf[i as keyof InitialConfig] as T;
    }
    setInitialConfigRaw(newConfig);
  }

  const setTypesConfigRaw = <T>(newConfig: TypesConfig) => {
    const buf = fullCopyObject(newConfig);
    for (const i in newConfig) {
      (typesConfigRaw[i as keyof TypesConfig] as T) = buf[i as keyof TypesConfig] as T;
    }
  }

  const setTypesConfig = <T>(newConfig: TypesConfig) => {
    const buf = fullCopyObject(newConfig);
    for (const i in newConfig) {
      (typesConfig.value[i as keyof TypesConfig] as T) = buf[i as keyof TypesConfig] as T;
    }
    setTypesConfigRaw(newConfig);
  }

  const setWorldConfigRaw = <T>(newConfig: WorldConfig) => {
    const buf = fullCopyObject(newConfig);
    for (const i in newConfig) {
      (worldConfigRaw[i as keyof WorldConfig] as T) = buf[i as keyof WorldConfig] as T;
    }
  }

  const setWorldConfig = <T>(newConfig: WorldConfig) => {
    const buf = fullCopyObject(newConfig);
    for (const i in newConfig) {
      (worldConfig.value[i as keyof WorldConfig] as T) = buf[i as keyof WorldConfig] as T;
    }
    setWorldConfigRaw(newConfig);
  }

  const exportConfig = () => {
    return btoa(JSON.stringify({
      worldConfig: worldConfigRaw,
      typesConfig: typesConfigRaw,
      initialConfig: initialConfigRaw,
    }));
  }

  const importConfig = (config: string) => {
    try {
      const newConfig = JSON.parse(atob(config)) as {
        worldConfig?: WorldConfig,
        typesConfig?: TypesConfig,
        initialConfig?: InitialConfig,
      };
      console.log('to import', newConfig);

      if (newConfig.worldConfig !== undefined) {
        setWorldConfig(newConfig.worldConfig);
        console.log('worldConfig upd');
      }
      if (newConfig.typesConfig !== undefined) {
        setTypesConfig(newConfig.typesConfig);
        console.log('typesConfig upd');
      }
      if (newConfig.initialConfig !== undefined) {
        setInitialConfig(newConfig.initialConfig);
        console.log('initialConfig upd');
      }
    } catch (e) {
      console.warn(e);
    }
  }

  const randomizeTypesConfig = <T>() => {
    const newConfig = createRandomTypesConfig({
      TYPES_COUNT: typesConfigRaw.COLORS.length,
      GRAVITY_BOUNDS: [-1, 0.5],
      LINK_GRAVITY_BOUNDS: [-1, 0.5],
      LINK_BOUNDS: [1, 3],
      LINK_TYPE_BOUNDS: [0, 3],
      LINK_FACTOR_DISTANCE_BOUNDS: [0.5, 1.5],
    });

    setTypesConfig(newConfig);
    setTypesConfigRaw(newConfig);
  }

  const setDefaultTypesConfig = <T>() => {
    const newConfig = createBaseTypesConfig();

    for (const i in newConfig) {
      (typesConfig.value[i as keyof TypesConfig] as T) = newConfig[i as keyof TypesConfig] as T;
    }
    setTypesConfigRaw(newConfig);
  }

  watch(worldConfig, <T>(newConfig: WorldConfig) => {
    setWorldConfigRaw(newConfig);
  }, { deep: true });

  watch(typesConfig, <T>(newConfig: TypesConfig) => {
    setTypesConfigRaw(newConfig);
  }, { deep: true });

  watch(initialConfig, <T>(newConfig: InitialConfig) => {
    setInitialConfigRaw(newConfig);
  }, { deep: true });

  return {
    viewMode,
    worldConfig,
    typesConfig,
    initialConfig,
    getConfigValues,
    setInitialConfig,
    setTypesConfig,
    setWorldConfig,
    randomizeTypesConfig,
    setDefaultTypesConfig,
    exportConfig,
    importConfig,
  }
});
