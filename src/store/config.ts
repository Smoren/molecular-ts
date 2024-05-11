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
  createBaseTypesConfig,
  createColors,
  createDefaultRandomTypesConfig,
  createSingleTypeConfig,
} from "@/lib/config/types";
import { fullCopyObject } from "@/helpers/utils";
import {
  createDistributedLinkFactorDistance,
  distributeLinkFactorDistance,
} from "@/lib/helpers";
import { useFlash } from '@/hooks/use-flash';
import { concatArrays, concatMatrices, concatTensors } from "@/lib/math";
import { randomizeTypesConfig as partlyRandomizeTypesConfig } from '@/lib/config/helpers';
import { makeMatrixSymmetric, makeTensorSymmetric } from '@/lib/math/operations';

export const useConfigStore = defineStore("config", () => {
  const worldConfigRaw: WorldConfig = createBaseWorldConfig();
  const typesConfigRaw: TypesConfig = createBaseTypesConfig();

  const worldConfig: Ref<WorldConfig> = ref(fullCopyObject(worldConfigRaw));
  const typesConfig: Ref<TypesConfig> = ref(fullCopyObject(typesConfigRaw));
  const randomTypesConfig: Ref<RandomTypesConfig> = ref(createDefaultRandomTypesConfig(typesConfigRaw.COLORS.length));

  const flash = useFlash();
  const FLASH_IMPORT_STARTED = Symbol();

  const typesSymmetricConfig: Ref<TypesSymmetricConfig> = ref({
    GRAVITY_MATRIX_SYMMETRIC: false,
    LINK_GRAVITY_MATRIX_SYMMETRIC: false,
    LINK_TYPE_MATRIX_SYMMETRIC: false,
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
        if (config.typesConfig.LINK_FACTOR_DISTANCE_USE_EXTENDED === undefined) {
          config.typesConfig.LINK_FACTOR_DISTANCE_USE_EXTENDED = false;
        }

        if (
          config.typesConfig.LINK_FACTOR_DISTANCE_EXTENDED === undefined ||
          !config.typesConfig.LINK_FACTOR_DISTANCE_USE_EXTENDED
        ) {
          config.typesConfig.LINK_FACTOR_DISTANCE_EXTENDED = createDistributedLinkFactorDistance(
            config.typesConfig.LINK_FACTOR_DISTANCE,
          );
        }

        if (config.typesConfig.RADIUS === undefined) {
          const radius: number[] = [];
          radius.length = config.typesConfig.FREQUENCIES.length;
          radius.fill(1);
          config.typesConfig.RADIUS = radius;
        }

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
    if (typesSymmetricConfig.value.LINK_FACTOR_DISTANCE_MATRIX_SYMMETRIC) {
      makeMatrixSymmetric(typesConfig.value.LINK_FACTOR_DISTANCE);
      makeTensorSymmetric(typesConfig.value.LINK_FACTOR_DISTANCE_EXTENDED);
    }
  }

  const addTypesFromConfig = (config: TypesConfig): void => {
    typesConfig.value.COLORS = createColors(typesConfig.value.COLORS.length + config.COLORS.length);
    typesConfig.value.RADIUS = concatArrays(typesConfig.value.RADIUS, config.RADIUS);
    typesConfig.value.FREQUENCIES = concatArrays(typesConfig.value.FREQUENCIES, config.FREQUENCIES);

    typesConfig.value.GRAVITY = concatMatrices(typesConfig.value.GRAVITY, config.GRAVITY);
    typesConfig.value.LINK_GRAVITY = concatMatrices(typesConfig.value.LINK_GRAVITY, config.LINK_GRAVITY);

    typesConfig.value.LINKS = concatArrays(typesConfig.value.LINKS, config.LINKS);
    typesConfig.value.TYPE_LINKS = concatMatrices(typesConfig.value.TYPE_LINKS, config.TYPE_LINKS);

    typesConfig.value.LINK_FACTOR_DISTANCE = concatMatrices(
      typesConfig.value.LINK_FACTOR_DISTANCE,
      config.LINK_FACTOR_DISTANCE,
      1,
    );
    typesConfig.value.LINK_FACTOR_DISTANCE_EXTENDED = concatTensors(
      typesConfig.value.LINK_FACTOR_DISTANCE_EXTENDED,
      config.LINK_FACTOR_DISTANCE_EXTENDED,
      1,
    );

    setTypesConfig(typesConfig.value);
  }

  const appendType = () => {
    const newTypeConfig = createSingleTypeConfig();
    addTypesFromConfig(newTypeConfig);
  }

  watch(() => typesConfig.value.LINK_FACTOR_DISTANCE_USE_EXTENDED, (value: boolean) => {
    if (!value || flash.receive(FLASH_IMPORT_STARTED)) {
      return;
    }

    distributeLinkFactorDistance(typesConfig.value.LINK_FACTOR_DISTANCE_EXTENDED, typesConfig.value.LINK_FACTOR_DISTANCE);
  });

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
    appendType,
    addTypesFromConfig,
    exportConfig,
    importConfig,
    exportConfigBase64,
    importConfigBase64,
  }
});
