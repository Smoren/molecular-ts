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
  createRandomTypesConfig,
} from "@/lib/config/types";
import { fullCopyObject } from "@/helpers/utils";
import {
  concatArrays,
  concatMatrices,
  concatTensors,
  createDistributedLinkFactorDistance,
  distributeLinkFactorDistance,
  getRandomColor,
} from "@/lib/helpers";
import { useFlash } from '@/hooks/use-flash';

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
    LINK_FACTOR_DISTANCE_MATRIX_SYMMETRIC: false,
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
        setViewMode(config.worldConfig.VIEW_MODE);
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

  const copyConfigListValue = (copyFrom: unknown[], copyTo: unknown[], defaultValue: number) => {
    for (const i in copyTo as Array<unknown>) {
      copyTo[i] = copyFrom[i] ?? defaultValue;
    }
  }

  const copyConfigMatrixValue = (copyFrom: unknown[][], copyTo: unknown[][], defaultValue: number) => {
    for (let i=0; i<copyTo.length; ++i) {
      for (let j=0; j<copyTo[i].length; ++j) {
        if (copyFrom[i] === undefined) {
          copyTo[i][j] = defaultValue;
        } else {
          copyTo[i][j] = copyFrom[i][j] ?? defaultValue;
        }
      }
    }
  }

  const copyConfigTensorValue = (copyFrom: unknown[][][], copyTo: unknown[][][], defaultValue: number) => {
    for (let i=0; i<copyTo.length; ++i) {
      for (let j=0; j<copyTo[i].length; ++j) {
        for (let k=0; k<copyTo[i][j].length; ++k)
        if (copyFrom[i] === undefined || copyFrom[i][j] === undefined) {
          copyTo[i][j][k] = defaultValue;
        } else {
          copyTo[i][j][k] = copyFrom[i][j][k] ?? defaultValue;
        }
      }
    }
  }

  const randomizeTypesConfig = () => {
    const newConfig = createRandomTypesConfig(randomTypesConfig.value);

    if (!randomTypesConfig.value.USE_FREQUENCY_BOUNDS) {
      copyConfigListValue(typesConfigRaw.FREQUENCIES, newConfig.FREQUENCIES, 1);
    }

    if (!randomTypesConfig.value.USE_RADIUS_BOUNDS) {
      copyConfigListValue(typesConfigRaw.RADIUS, newConfig.RADIUS, 1);
    }

    if (!randomTypesConfig.value.USE_GRAVITY_BOUNDS) {
      copyConfigMatrixValue(typesConfigRaw.GRAVITY, newConfig.GRAVITY, 0);
    }

    if (!randomTypesConfig.value.USE_LINK_GRAVITY_BOUNDS) {
      copyConfigMatrixValue(typesConfigRaw.LINK_GRAVITY, newConfig.LINK_GRAVITY, 0);
    }

    if (!randomTypesConfig.value.USE_LINK_BOUNDS) {
      copyConfigListValue(typesConfigRaw.LINKS, newConfig.LINKS, 0);
    }

    if (!randomTypesConfig.value.USE_LINK_TYPE_BOUNDS) {
      copyConfigMatrixValue(typesConfigRaw.TYPE_LINKS, newConfig.TYPE_LINKS, 0);
    }

    if (!randomTypesConfig.value.USE_LINK_FACTOR_DISTANCE_BOUNDS) {
      copyConfigMatrixValue(typesConfigRaw.LINK_FACTOR_DISTANCE, newConfig.LINK_FACTOR_DISTANCE, 1);
      copyConfigTensorValue(typesConfigRaw.LINK_FACTOR_DISTANCE_EXTENDED, newConfig.LINK_FACTOR_DISTANCE_EXTENDED, 1);
      newConfig.LINK_FACTOR_DISTANCE_USE_EXTENDED = typesConfigRaw.LINK_FACTOR_DISTANCE_USE_EXTENDED;
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
    typesConfig.value.RADIUS.push(1);
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

    // TODO LINK_FACTOR_DISTANCE_EXTENDED
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
