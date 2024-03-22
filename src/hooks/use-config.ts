import type { InitialConfig, TypesConfig, WorldConfig } from "@/lib/types/config";
import { createBaseWorldConfig } from "@/lib/config/world";
import { createBaseTypesConfig } from "@/lib/config/types";
import { create3dBaseInitialConfig } from "@/lib/config/initial";

export type Config = {
    worldConfig: WorldConfig,
    typesConfig: TypesConfig,
    initialConfig: InitialConfig
}

export const useConfig = (): Config => {
  const worldConfig: WorldConfig = createBaseWorldConfig();
  const typesConfig: TypesConfig = createBaseTypesConfig();
  const initialConfig: InitialConfig = create3dBaseInitialConfig();

  return {
    worldConfig,
    typesConfig,
    initialConfig,
  }
}
