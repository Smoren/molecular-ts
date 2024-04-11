<script setup lang="ts">

import ConfigSection from '@/components/config-editor/components/containers/config-section.vue';
import { useSimulationStore } from '@/store/simulation';
import type { TimeSeriesConfig } from "@/components/config-editor/components/widgets/chart.vue";
import Chart from "@/components/config-editor/components/widgets/chart.vue";

const { getCurrentSimulation } = useSimulationStore();

type ChartConfig = {
  id: string;
  name: string;
  width?: number;
  height?: number;
  period?: number;
  config: TimeSeriesConfig[];
}

const timeSeriesFpsConfig: ChartConfig = {
  id: 'fps',
  name: 'FPS',
  config: [
    {
      name: 'FPS',
      options: {
        strokeStyle: 'rgb(13, 110, 253)',
        fillStyle: 'rgba(13, 110, 253, 0.4)',
        lineWidth: 3,
      },
      getter: () => getCurrentSimulation().summary['STEP_FREQUENCY'][0],
    },
  ],
};
const timeSeriesLinksCountConfig = {
  id: 'links-count',
  name: 'Links Count',
  config: [
    {
      name: 'Links Count',
      options: {
        strokeStyle: 'rgb(13, 110, 253)',
        fillStyle: 'rgba(13, 110, 253, 0.4)',
        lineWidth: 3,
      },
      getter: () => getCurrentSimulation().summary['LINKS_COUNT'][0],
    },
  ],
};
const timeSeriesAtomsMeanSpeedConfig = {
  id: 'atoms-mean-speed',
  name: 'Atoms Mean Speed',
  config: [
    {
      name: 'Atoms Mean Speed',
      options: {
        strokeStyle: 'rgb(13, 110, 253)',
        fillStyle: 'rgba(13, 110, 253, 0.4)',
        lineWidth: 3,
      },
      getter: () => getCurrentSimulation().summary['ATOMS_MEAN_SPEED'][0],
    },
  ],
}
const timeSeriesAtomsTypeMeanSpeedConfig = {
  id: 'atoms-type-mean-speed',
  name: 'Atoms Type Mean Speed',
  height: 200,
  config: getCurrentSimulation().config.typesConfig.COLORS.map((color, i) => {
    const strColor = color.join(', ')
    return {
      name: 'Atoms Mean Speed',
      options: {
        strokeStyle: `rgb(${strColor})`,
        lineWidth: 2,
      },
      getter: () => getCurrentSimulation().summary['ATOMS_TYPE_MEAN_SPEED'][i],
    };
  }),
}

const timeSeriesConfig: ChartConfig[] = [
  timeSeriesFpsConfig,
  timeSeriesLinksCountConfig,
  timeSeriesAtomsMeanSpeedConfig,
  timeSeriesAtomsTypeMeanSpeedConfig,
];

</script>

<template>
  <config-section>
    <template #title>
      Summary
    </template>
    <template #body>
      <div v-for="config in timeSeriesConfig">
        <br />
        <chart
          :id="config.id"
          :name="config.name"
          :period="config.period ?? 100"
          :width="config.width ?? 467"
          :height="config.height ?? 100"
          :config="config.config"
        />
      </div>
    </template>
  </config-section>
</template>

<style scoped lang="scss">

@import "../../assets/config-editor";

</style>
