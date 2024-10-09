import { type Ref, ref, watch } from "vue";
import { defineStore } from "pinia";
import type {
  RandomTypesConfig,
  TypesSymmetricConfig,
  TypesConfig,
  WorldConfig,
  ViewMode,
} from "@/lib/types/config";
import { createBaseWorldConfig } from "@/lib/config/world";
import {
  creatDefaultTypesConfig,
  createDefaultRandomTypesConfig,
  createSingleTypeConfig,
  createTransparentTypesConfig,
  removeIndexFromTypesConfig,
} from "@/lib/config/types";
import { fullCopyObject } from "@/lib/utils/functions";
import { useFlash } from '@/web/hooks/use-flash';
import { concatTypesConfigs, randomizeTypesConfig as partlyRandomizeTypesConfig } from '@/lib/config/types';
import { makeMatrixSymmetric, makeTensorSymmetric } from '@/lib/math/operations';

export const useConfigStore = defineStore("config", () => {
  const worldConfigRaw: WorldConfig = createBaseWorldConfig();
  const typesConfigRaw: TypesConfig = creatDefaultTypesConfig();

  const worldConfig: Ref<WorldConfig> = ref(fullCopyObject(worldConfigRaw));
  const typesConfig: Ref<TypesConfig> = ref(fullCopyObject(typesConfigRaw));
  const randomTypesConfig: Ref<RandomTypesConfig> = ref(createDefaultRandomTypesConfig(typesConfigRaw.COLORS.length));

  const flash = useFlash();
  const FLASH_IMPORT_STARTED = Symbol();

  const typesSymmetricConfig: Ref<TypesSymmetricConfig> = ref({
    GRAVITY_MATRIX_SYMMETRIC: false,
    LINK_GRAVITY_MATRIX_SYMMETRIC: false,
    LINK_TYPE_MATRIX_SYMMETRIC: false,
    LINK_TYPE_WEIGHT_MATRIX_SYMMETRIC: false,
    LINK_FACTOR_DISTANCE_MATRIX_SYMMETRIC: true,
  });

  const getConfigValues = () => {
    return {
      worldConfig: worldConfigRaw,
      typesConfig: typesConfigRaw,
    }
  }

  const setViewMode = (viewMode: ViewMode) => {
    worldConfig.value.VIEW_MODE = viewMode;
    worldConfigRaw.VIEW_MODE = viewMode;
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

  const setRandomTypesConfig = (newConfig: RandomTypesConfig, excludeKeys: string[] = []) => {
    const buf = fullCopyObject(newConfig);
    for (const i in newConfig) {
      if (excludeKeys.includes(i)) {
        continue;
      }
      (randomTypesConfig.value[i as keyof RandomTypesConfig] as number) = buf[i as keyof RandomTypesConfig] as number;
    }
  }

  const syncRandomTypesCount = () => {
    randomTypesConfig.value.TYPES_COUNT = typesConfig.value.FREQUENCIES.length;
  }

  const exportConfig = () => {
    return {
      worldConfig: worldConfigRaw,
      typesConfig: typesConfigRaw,
      typesSymmetricConfig: typesSymmetricConfig.value,
    };
  }

  const exportConfigBase64 = () => {
    return btoa(JSON.stringify(exportConfig()));
  }

  const importConfig = (config: {
    worldConfig?: WorldConfig,
    typesConfig?: TypesConfig,
    typesSymmetricConfig?: TypesSymmetricConfig,
  }) => {
    flash.turnOn(FLASH_IMPORT_STARTED);
    try {
      if (config.worldConfig !== undefined) {
        setWorldConfig(config.worldConfig);
        console.log('worldConfig upd');
      }
      if (config.typesConfig !== undefined) {
        setTypesConfig(createTransparentTypesConfig(config.typesConfig.FREQUENCIES.length));
        console.log('typesConfig upd');
        setTypesConfig(config.typesConfig);
      }
      if (config.typesSymmetricConfig !== undefined && config.typesSymmetricConfig.GRAVITY_MATRIX_SYMMETRIC !== undefined) {
        setTypesSymmetricConfig(config.typesSymmetricConfig);
        console.log('typesSymmetricConfig upd');
      }

      console.log('imported', config);
    } catch (e) {
      console.warn(e);
    }
  }

  const importConfigBase64 = (config: string) => {
    try {
      const newConfig = JSON.parse(atob(config)) as {
        worldConfig?: WorldConfig,
        typesConfig?: TypesConfig,
        typeSymmetricConfig?: TypesSymmetricConfig,
      };

      importConfig(newConfig);
    } catch (e) {
      console.warn(e);
    }
  }

  const randomizeTypesConfig = (skipSubMatricesBoundaryIndex?: number) => {
    const newConfig = partlyRandomizeTypesConfig(
      randomTypesConfig.value,
      typesConfigRaw,
      skipSubMatricesBoundaryIndex,
    );

    flash.turnOn(FLASH_IMPORT_STARTED);
    setTypesConfig(newConfig);
    setTypesConfigRaw(newConfig);

    if (skipSubMatricesBoundaryIndex === undefined) {
      setSymmetricTypesConfig(randomTypesConfig.value);
    }

    applySymmetricTypesConfig();
  }

  const setDefaultTypesConfig = <T>() => {
    const newConfig = creatDefaultTypesConfig();

    for (const i in newConfig) {
      (typesConfig.value[i as keyof TypesConfig] as T) = newConfig[i as keyof TypesConfig] as T;
    }
    setTypesConfigRaw(newConfig);
  }

  const setSymmetricTypesConfig = (config: RandomTypesConfig) => {
    if (config.USE_GRAVITY_BOUNDS) {
      typesSymmetricConfig.value.GRAVITY_MATRIX_SYMMETRIC = config.GRAVITY_MATRIX_SYMMETRIC;
    }
    if (config.USE_LINK_GRAVITY_BOUNDS) {
      typesSymmetricConfig.value.LINK_GRAVITY_MATRIX_SYMMETRIC = config.LINK_GRAVITY_MATRIX_SYMMETRIC;
    }
    if (config.USE_LINK_TYPE_BOUNDS) {
      typesSymmetricConfig.value.LINK_TYPE_MATRIX_SYMMETRIC = config.LINK_TYPE_MATRIX_SYMMETRIC;
    }
    if (config.USE_LINK_TYPE_WEIGHT_BOUNDS) {
      typesSymmetricConfig.value.LINK_TYPE_WEIGHT_MATRIX_SYMMETRIC = config.LINK_TYPE_WEIGHT_MATRIX_SYMMETRIC;
    }
    if (config.USE_LINK_FACTOR_DISTANCE_BOUNDS) {
      typesSymmetricConfig.value.LINK_FACTOR_DISTANCE_MATRIX_SYMMETRIC = config.LINK_FACTOR_DISTANCE_MATRIX_SYMMETRIC;
    }
  }

  const applySymmetricTypesConfig = () => {
    if (typesSymmetricConfig.value.GRAVITY_MATRIX_SYMMETRIC) {
      makeMatrixSymmetric(typesConfig.value.GRAVITY);
    }
    if (typesSymmetricConfig.value.LINK_GRAVITY_MATRIX_SYMMETRIC) {
      makeMatrixSymmetric(typesConfig.value.LINK_GRAVITY);
    }
    if (typesSymmetricConfig.value.LINK_TYPE_MATRIX_SYMMETRIC) {
      makeMatrixSymmetric(typesConfig.value.TYPE_LINKS);
    }
    if (typesSymmetricConfig.value.LINK_TYPE_WEIGHT_MATRIX_SYMMETRIC) {
      makeMatrixSymmetric(typesConfig.value.TYPE_LINK_WEIGHTS);
    }
    if (typesSymmetricConfig.value.LINK_FACTOR_DISTANCE_MATRIX_SYMMETRIC) {
      makeTensorSymmetric(typesConfig.value.LINK_FACTOR_DISTANCE_EXTENDED);
    }
  }

  const addTypesFromConfig = (config: TypesConfig): void => {
    const newConfig = concatTypesConfigs(typesConfig.value, config);
    setTypesConfig(newConfig);
  }

  const removeTypeFromConfig = (index: number): void => {
    const newConfig = removeIndexFromTypesConfig(typesConfig.value, index);
    setTypesConfig(newConfig);
  }

  const appendType = () => {
    const newTypeConfig = createSingleTypeConfig();
    addTypesFromConfig(newTypeConfig);
  }

  watch(worldConfig, (newConfig: WorldConfig) => {
    setWorldConfigRaw(newConfig);
  }, { deep: true });

  watch(typesConfig, (newConfig: TypesConfig) => {
    setTypesConfigRaw(newConfig);
  }, { deep: true });

  return {
    worldConfig,
    typesConfig,
    randomTypesConfig,
    typesSymmetricConfig,
    getConfigValues,
    setViewMode,
    setTypesConfig,
    setWorldConfig,
    randomizeTypesConfig,
    setDefaultTypesConfig,
    setRandomTypesConfig,
    syncRandomTypesCount,
    appendType,
    addTypesFromConfig,
    removeTypeFromConfig,
    exportConfig,
    importConfig,
    exportConfigBase64,
    importConfigBase64,
  }
});
