import { useConfigStore, type ViewMode } from "@/store/config";
import { watch } from "vue";
import { Simulation } from "@/lib/simulation";
import { create2dBaseInitialConfig, create3dBaseInitialConfig } from "@/lib/config/initial";
import { create2dRandomDistribution, create3dRandomDistribution } from "@/lib/config/atoms";
import { create3dDrawer } from "@/lib/drawer/3d";
import { create2dDrawer } from "@/lib/drawer/2d";

export const useSimulation = () => {
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
        atomsFactory: create2dRandomDistribution,
        drawer: create2dDrawer('canvas2d', configStore.worldConfig, configStore.typesConfig),
      });
    }

    simulation2d.start();
  };

  const isMode = (mode: ViewMode) => configStore.viewMode === mode;

  const restartSimulation = () => {
    if (configStore.viewMode === '3d') {
      start3dSimulation();
    } else {
      start2dSimulation();
    }
  };

  watch(() => configStore.viewMode, () => {
    restartSimulation();
  })

  return {
    restartSimulation,
    isMode,
  }
}
