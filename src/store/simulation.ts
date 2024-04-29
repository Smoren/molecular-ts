import { computed } from "vue";
import { defineStore } from "pinia";
import type { SimulationInterface } from "@/lib/types/simulation";
import type { PhysicModelInterface } from '@/lib/types/interaction';
import type { ViewMode } from "@/lib/types/config";
import { create2dBaseInitialConfig, create3dBaseInitialConfig } from "@/lib/config/initial";
import { useConfigStore } from "@/store/config";
import { create2dRandomDistribution, create3dRandomDistribution } from "@/lib/config/atoms";
import { create3dDrawer } from "@/lib/drawer/3d";
import { create2dDrawer } from "@/lib/drawer/2d";
import { createPhysicModel } from '@/lib/helpers';
import { Simulation } from "@/lib/simulation";

export const useSimulationStore = defineStore("simulation", () => {
  const configStore = useConfigStore();
  const {
    worldConfig,
    typesConfig,
  } = configStore.getConfigValues();

  let simulation2d: Simulation | null = null;
  let simulation3d: Simulation | null = null;

  const init = async () => {
    if (!simulation3d) {
      simulation3d = new Simulation({
        viewMode: '3d',
        worldConfig: worldConfig,
        typesConfig: typesConfig,
        initialConfig: create3dBaseInitialConfig(),
        physicModel: createPhysicModel(worldConfig, typesConfig),
        atomsFactory: create3dRandomDistribution,
        drawer: create3dDrawer('canvas3d', configStore.worldConfig, configStore.typesConfig),
      });
    }

    if (!simulation2d) {
      simulation2d = new Simulation({
        viewMode: '2d',
        worldConfig: worldConfig,
        typesConfig: typesConfig,
        initialConfig: create2dBaseInitialConfig(),
        physicModel: createPhysicModel(worldConfig, typesConfig),
        atomsFactory: create2dRandomDistribution,
        drawer: create2dDrawer('canvas2d', configStore.worldConfig, configStore.typesConfig),
      });
    }

    await simulation3d.stop();
    await simulation2d.stop();
  }

  const start3dSimulation = async () => {
    configStore.setInitialConfig(create3dBaseInitialConfig());

    await init();

    simulation3d?.start();
  };

  const start2dSimulation = async () => {
    configStore.setInitialConfig(create2dBaseInitialConfig());

    await init();

    simulation2d?.start();
  };

  const isMode = (mode: ViewMode) => configStore.worldConfig.VIEW_MODE === mode;

  const getCurrentSimulation = (): SimulationInterface => {
    return (configStore.worldConfig.VIEW_MODE === '3d' ? simulation3d : simulation2d) as SimulationInterface;
  }

  const simulation = computed<SimulationInterface>(() => {
    return getCurrentSimulation();
  });

  const restart = async () => {
    if (configStore.worldConfig.VIEW_MODE === '3d') {
      await start3dSimulation();
    } else {
      await start2dSimulation();
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
      simulation2d?.refill();
      simulation3d?.refill();
    } else {
      getCurrentSimulation().refill();
    }
  }

  const setPhysicModel = (model: PhysicModelInterface) => {
    simulation2d?.setPhysicModel(model);
    simulation3d?.setPhysicModel(model);
  }

  const exportState = async () => {
    return {
      '2d': await simulation2d?.exportState(),
      '3d': await simulation3d?.exportState(),
    };
  }

  const importState = async (state: Record<string, unknown>) => {
    if (state['2d'] && simulation2d) {
      await simulation2d.importState(state['2d'] as Record<string, unknown>);
    }
    if (state['3d'] && simulation3d) {
      await simulation3d.importState(state['3d'] as Record<string, unknown>);
    }
  }

  const start = () => {
    getCurrentSimulation().start();
  }

  const stop = async () => {
    await getCurrentSimulation().stop();
  }

  const isPaused = () => {
    return getCurrentSimulation().isPaused;
  }

  const togglePause = () => {
    return getCurrentSimulation().togglePause();
  }

  const setViewMode = async (viewMode: ViewMode) => {
    await stop();
    configStore.setViewMode(viewMode);
    await restart();
  }

  // watch(() => configStore.worldConfig.VIEW_MODE, async () => {
  //   await restart();
  // });

  return {
    simulation,
    restart,
    clearAtoms,
    refillAtoms,
    setPhysicModel,
    isMode,
    getCurrentSimulation,
    exportState,
    importState,
    start,
    stop,
    isPaused,
    togglePause,
    setViewMode,
  }
});
