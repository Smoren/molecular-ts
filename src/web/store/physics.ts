import { type Ref, ref, watch } from "vue";
import { defineStore } from "pinia";
import type { PhysicModelName } from "@/lib/config/types";
import { useConfigStore } from '@/web/store/config';
import { useSimulationStore } from '@/web/store/simulation';
import { createPhysicModel } from '@/lib/utils/functions';

export const usePhysicsStore = defineStore("physics", () => {
  const configStore = useConfigStore();
  const simulationStore = useSimulationStore();

  const physicModelName: Ref<PhysicModelName> = ref(configStore.worldConfig.PHYSIC_MODEL);
  const physicModelNameMap: Record<PhysicModelName, string> = {
    'v1': 'V1',
    'v2': 'V2',
  };

  watch(physicModelName, <T>(modelName: PhysicModelName) => {
    configStore.worldConfig.PHYSIC_MODEL = modelName;

    const { worldConfig, typesConfig } = configStore.getConfigValues();
    worldConfig.PHYSIC_MODEL = modelName;

    simulationStore.setPhysicModel(createPhysicModel(worldConfig, typesConfig));
  });

  watch(() => configStore.worldConfig.PHYSIC_MODEL, <T>(modelName: PhysicModelName) => {
    physicModelName.value = modelName;
  });

  return {
    physicModelName,
    physicModelNameMap,
  }
});
