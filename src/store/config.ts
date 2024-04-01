import { type Ref, ref, watch } from "vue";
import { defineStore } from "pinia";
import type {
  InitialConfig,
  RandomTypesConfig,
  TypesSymmetricConfig,
  TypesConfig,
  WorldConfig,
} from "@/lib/types/config";
import { createBaseWorldConfig } from "@/lib/config/world";
import { createBaseTypesConfig, createDefaultRandomTypesConfig, createRandomTypesConfig } from "@/lib/config/types";
import { create3dBaseInitialConfig } from "@/lib/config/initial";
import { fullCopyObject } from "@/helpers/utils";
import { createDistributedLinkFactorDistance, distributeLinkFactorDistance, getRandomColor } from "@/lib/helpers";
import { useFlash } from '@/hooks/use-flash';

export type ViewMode = '2d' | '3d';

export const useConfigStore = defineStore("config", () => {
  const worldConfigRaw: WorldConfig = createBaseWorldConfig();
  const typesConfigRaw: TypesConfig = createBaseTypesConfig();
  const initialConfigRaw: InitialConfig = create3dBaseInitialConfig();

  const worldConfig: Ref<WorldConfig> = ref(fullCopyObject(worldConfigRaw));
  const typesConfig: Ref<TypesConfig> = ref(fullCopyObject(typesConfigRaw));
  const initialConfig: Ref<InitialConfig> = ref(fullCopyObject(initialConfigRaw));
  const randomTypesConfig: Ref<RandomTypesConfig> = ref(createDefaultRandomTypesConfig(typesConfigRaw.COLORS.length));

  const flash = useFlash();
  const FLASH_IMPORT_STARTED = Symbol();

  const typesSymmetricConfig: Ref<TypesSymmetricConfig> = ref({
    GRAVITY_MATRIX_SYMMETRIC: false,
    LINK_GRAVITY_MATRIX_SYMMETRIC: false,
    LINK_TYPE_MATRIX_SYMMETRIC: false,
    LINK_FACTOR_DISTANCE_MATRIX_SYMMETRIC: false,
  });

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

  const setTypesSymmetricConfig = <T>(newConfig: TypesSymmetricConfig) => {
    const buf = fullCopyObject(newConfig);
    for (const i in newConfig) {
      (typesSymmetricConfig.value[i as keyof TypesSymmetricConfig] as T) = buf[i as keyof TypesSymmetricConfig] as T;
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
    const config = {
      worldConfig: worldConfigRaw,
      typesConfig: typesConfigRaw,
      typesSymmetricConfig,
    };
    console.log('export', config);
    return btoa(JSON.stringify(config));
  }

  const importConfig = (config: string) => {
    flash.turnOn(FLASH_IMPORT_STARTED);
    try {
      const newConfig = JSON.parse(atob(config)) as {
        worldConfig?: WorldConfig,
        typesConfig?: TypesConfig,
        typeSymmetricConfig?: TypesSymmetricConfig,
      };

      if (newConfig.worldConfig !== undefined) {
        setWorldConfig(newConfig.worldConfig);
        console.log('worldConfig upd');
      }
      if (newConfig.typesConfig !== undefined) {

        if (newConfig.typesConfig.LINK_FACTOR_DISTANCE_USE_EXTENDED === undefined) {
          newConfig.typesConfig.LINK_FACTOR_DISTANCE_USE_EXTENDED = false;
        }

        if (
          newConfig.typesConfig.LINK_FACTOR_DISTANCE_EXTENDED === undefined ||
          !newConfig.typesConfig.LINK_FACTOR_DISTANCE_USE_EXTENDED
        ) {
          newConfig.typesConfig.LINK_FACTOR_DISTANCE_EXTENDED = createDistributedLinkFactorDistance(
            newConfig.typesConfig.LINK_FACTOR_DISTANCE,
          );
        }

        console.log('typesConfig upd');
        setTypesConfig(newConfig.typesConfig);
      }
      if (newConfig.typeSymmetricConfig !== undefined) {
        setTypesSymmetricConfig(newConfig.typeSymmetricConfig);
        console.log('typesConfig upd');
      }

      console.log('imported', newConfig);
    } catch (e) {
      console.warn(e);
    }
  }

  const randomizeTypesConfig = () => {
    const oldFrequencies = typesConfigRaw.FREQUENCIES;
    const newConfig = createRandomTypesConfig(randomTypesConfig.value);

    for (const i in newConfig.FREQUENCIES) {
      newConfig.FREQUENCIES[i] = oldFrequencies[i] ?? 1;
    }

    flash.turnOn(FLASH_IMPORT_STARTED);
    setTypesConfig(newConfig);
    setTypesConfigRaw(newConfig);
    setSymmetricTypesConfig(randomTypesConfig.value);
  }

  const setDefaultTypesConfig = <T>() => {
    const newConfig = createBaseTypesConfig();

    for (const i in newConfig) {
      (typesConfig.value[i as keyof TypesConfig] as T) = newConfig[i as keyof TypesConfig] as T;
    }
    setTypesConfigRaw(newConfig);
  }

  const setSymmetricTypesConfig = (config: RandomTypesConfig) => {
      for (const key in typesSymmetricConfig.value) {
        typesSymmetricConfig.value[key as keyof TypesSymmetricConfig] = config[key as keyof TypesSymmetricConfig];
      }
  }

  const appendType = () => {
    typesConfig.value.COLORS.push(getRandomColor());
    typesConfig.value.FREQUENCIES.push(1);
    typesConfig.value.LINKS.push(0);

    typesConfig.value.GRAVITY.forEach((item) => item.push(0));
    typesConfig.value.GRAVITY.push(Array(typesConfig.value.COLORS.length).fill(0));

    typesConfig.value.LINK_GRAVITY.forEach((item) => item.push(0));
    typesConfig.value.LINK_GRAVITY.push(Array(typesConfig.value.COLORS.length).fill(0));

    typesConfig.value.TYPE_LINKS.forEach((item) => item.push(0));
    typesConfig.value.TYPE_LINKS.push(Array(typesConfig.value.COLORS.length).fill(0));

    typesConfig.value.LINK_FACTOR_DISTANCE.forEach((item) => item.push(1));
    typesConfig.value.LINK_FACTOR_DISTANCE.push(Array(typesConfig.value.COLORS.length).fill(1));
  }

  watch(() => typesConfig.value.LINK_FACTOR_DISTANCE_USE_EXTENDED, (value: boolean) => {
    if (!value || flash.receive(FLASH_IMPORT_STARTED)) {
      return;
    }
    console.log('link flag on'); // TODO remove

    distributeLinkFactorDistance(typesConfig.value.LINK_FACTOR_DISTANCE_EXTENDED, typesConfig.value.LINK_FACTOR_DISTANCE);
  });

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
    randomTypesConfig,
    typesSymmetricConfig,
    getConfigValues,
    setInitialConfig,
    setTypesConfig,
    setWorldConfig,
    randomizeTypesConfig,
    setDefaultTypesConfig,
    appendType,
    exportConfig,
    importConfig,
  }
});
