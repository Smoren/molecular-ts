import type { InitialConfig, TypesConfig, WorldConfig } from "@/lib/types/config";
import { createBaseWorldConfig } from "@/lib/config/world";
import { createBaseTypesConfig } from "@/lib/config/types";
import { create3dBaseInitialConfig } from "@/lib/config/initial";

export const useConfig = () => {
  const worldConfig: WorldConfig = createBaseWorldConfig();
  const typesConfig: TypesConfig = createBaseTypesConfig();
  const initialConfig: InitialConfig = create3dBaseInitialConfig();

  return {
    worldConfig,
    typesConfig,
    initialConfig,
  }
}
