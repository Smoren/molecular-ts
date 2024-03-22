import type { InitialConfig, TypesConfig, WorldConfig } from "@/lib/types/config";
import { createBaseWorldConfig } from "@/lib/config/world";
import { createBaseTypesConfig } from "@/lib/config/types";
import { create3dBaseInitialConfig } from "@/lib/config/initial";
import { type Ref, ref, watch } from 'vue';

export type Config = {
  worldConfig: WorldConfig;
  typesConfig: TypesConfig;
  initialConfig: InitialConfig;
  worldConfigRef: Ref<WorldConfig>;
  typesConfigRef: Ref<TypesConfig>;
  initialConfigRef: Ref<InitialConfig>;
}

export const useConfig = (): Config => {
  const worldConfig: WorldConfig = createBaseWorldConfig();
  const typesConfig: TypesConfig = createBaseTypesConfig();
  const initialConfig: InitialConfig = create3dBaseInitialConfig();

  const worldConfigRef: Ref<WorldConfig> = ref(worldConfig);
  const typesConfigRef: Ref<TypesConfig> = ref(typesConfig);
  const initialConfigRef: Ref<InitialConfig> = ref(initialConfig);

  watch(worldConfig, (newConfig) => {
    for (const i in newConfig) {
      // @ts-ignore
      worldConfig[i] = newConfig[i];
    }
  }, { deep: true });

  watch(typesConfigRef, (newConfig) => {
    for (const i in newConfig) {
      // @ts-ignore
      typesConfig[i] = newConfig[i];
    }
  }, { deep: true });

  watch(initialConfigRef, (newConfig) => {
    for (const i in newConfig) {
      // @ts-ignore
      initialConfig[i] = newConfig[i];
    }
  }, { deep: true });

  return {
    worldConfig,
    typesConfig,
    initialConfig,
    worldConfigRef,
    typesConfigRef,
    initialConfigRef,
  }
}
