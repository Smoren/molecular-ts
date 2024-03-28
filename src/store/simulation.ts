import { computed, watch } from "vue";
import { defineStore } from "pinia";
import { create2dBaseInitialConfig, create3dBaseInitialConfig } from "@/lib/config/initial";
import { useConfigStore, type ViewMode } from "@/store/config";
import { Simulation } from "@/lib/simulation";
import { create2dRandomDistribution, create3dRandomDistribution } from "@/lib/config/atoms";
import { create3dDrawer } from "@/lib/drawer/3d";
import { create2dDrawer } from "@/lib/drawer/2d";
import type { SimulationInterface } from "@/lib/types/simulation";
import { createPhysicModel } from '@/lib/helpers';
import type { PhysicModelInterface } from '@/lib/types/interaction';

export const useSimulationStore = defineStore("simulation", () => {
  const configStore = useConfigStore();
  const {
    worldConfig,
    typesConfig,
    initialConfig,
  } = configStore.getConfigValues();

  let simulation2d: Simulation | null = null;
  let simulation3d: Simulation | null = null;

  const start3dSimulation = () => {
    if (simulation2d) {
      simulation2d.stop();
    }

    configStore.setInitialConfig(create3dBaseInitialConfig());

    if (!simulation3d) {
      simulation3d = new Simulation({
        worldConfig: worldConfig,
        typesConfig: typesConfig,
        initialConfig: initialConfig,
        physicModel: createPhysicModel(worldConfig, typesConfig),
        atomsFactory: create3dRandomDistribution,
        drawer: create3dDrawer('canvas3d', configStore.worldConfig, configStore.typesConfig),
      });
    }

    simulation3d.start();
  };

  const start2dSimulation = () => {
    if (simulation3d) {
      simulation3d.stop();
    }

    configStore.setInitialConfig(create2dBaseInitialConfig());

    if (!simulation2d) {
      simulation2d = new Simulation({
        worldConfig: worldConfig,
        typesConfig: typesConfig,
        initialConfig: initialConfig,
        physicModel: createPhysicModel(worldConfig, typesConfig),
        atomsFactory: create2dRandomDistribution,
        drawer: create2dDrawer('canvas2d', configStore.worldConfig, configStore.typesConfig),
      });
    }

    simulation2d.start();
  };

  const isMode = (mode: ViewMode) => configStore.viewMode === mode;

  const getCurrentSimulation = (): SimulationInterface => {
    return (configStore.viewMode === '3d' ? simulation3d : simulation2d) as SimulationInterface;
  }

  const simulation = computed<SimulationInterface>(() => {
    return getCurrentSimulation();
  });

  const restart = () => {
    if (configStore.viewMode === '3d') {
      start3dSimulation();
    } else {
      start2dSimulation();
    }
  };

  const clearAtoms = (globally: boolean = false) => {
    if (globally) {
      simulation2d?.clear();
      simulation3d?.clear();
    } else {
      getCurrentSimulation().clear();
    }
  }

  const refillAtoms = (globally: boolean = false) => {
    if (globally) {
      const initialConfig2d = isMode('2d') ? configStore.initialConfig : create2dBaseInitialConfig();
      const initialConfig3d = isMode('3d') ? configStore.initialConfig : create3dBaseInitialConfig();

      simulation2d?.refill(initialConfig2d);
      simulation3d?.refill(initialConfig3d);
    } else {
      getCurrentSimulation().refill();
    }
  }

  const setPhysicModel = (model: PhysicModelInterface) => {
    simulation2d?.setPhysicModel(model);
    simulation3d?.setPhysicModel(model);
  }

  watch(() => configStore.viewMode, () => {
    restart();
  });

  return {
    simulation,
    restart,
    clearAtoms,
    refillAtoms,
    setPhysicModel,
    isMode,
  }
});
