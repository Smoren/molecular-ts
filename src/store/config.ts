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
    return {
      worldConfig: worldConfigRaw,
      typesConfig: typesConfigRaw,
      typesSymmetricConfig,
    };
  }

  const exportConfigBase64 = () => {
    return btoa(JSON.stringify(exportConfig()));
  }

  const importConfig = (config: {
    worldConfig?: WorldConfig,
    typesConfig?: TypesConfig,
    typeSymmetricConfig?: TypesSymmetricConfig,
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
      if (config.typeSymmetricConfig !== undefined) {
        setTypesSymmetricConfig(config.typeSymmetricConfig);
        console.log('typesConfig upd');
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
    exportConfigBase64,
    importConfigBase64,
  }
});
