import { type Ref, ref } from "vue";
import { defineStore } from "pinia";
import type { InitialConfig, TypesConfig, WorldConfig } from "@/lib/types/config";
import { createBaseWorldConfig } from "@/lib/config/world";
import { createBaseTypesConfig } from "@/lib/config/types";
import { create3dBaseInitialConfig } from "@/lib/config/initial";

export const useConfigStore = defineStore("config", () => {
  const worldConfig: Ref<WorldConfig> = ref(createBaseWorldConfig());
  const typesConfig: Ref<TypesConfig> = ref(createBaseTypesConfig());
  const initialConfig: Ref<InitialConfig> = ref(create3dBaseInitialConfig());

  return {
    worldConfig,
    typesConfig,
    initialConfig,
  };
});
