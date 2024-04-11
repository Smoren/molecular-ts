<script setup lang="ts">

import ConfigSection from '@/components/config-editor/components/containers/config-section.vue';
import { useSimulationStore } from '@/store/simulation';
import type { TimeSeriesConfig } from "@/components/config-editor/components/widgets/chart.vue";
import Chart from "@/components/config-editor/components/widgets/chart.vue";

const { getCurrentSimulation } = useSimulationStore();

type ChartConfig = {
  id: string;
  name: string;
  data: () => number[];
  width?: number;
  height?: number;
  period?: number;
  config: TimeSeriesConfig[];
}

const timeSeriesFpsConfig: ChartConfig = {
  id: 'fps',
  name: 'FPS',
  data: () => getCurrentSimulation().summary['STEP_FREQUENCY'],
  config: [
    {
      name: 'FPS',
      options: {
        strokeStyle: 'rgb(13, 110, 253)',
        fillStyle: 'rgba(13, 110, 253, 0.4)',
        lineWidth: 3,
      },
    },
  ],
};
const timeSeriesLinksCountConfig = {
  id: 'links-count',
  name: 'Links Count',
  data: () => getCurrentSimulation().summary['LINKS_COUNT'],
  config: [
    {
      name: 'Links Count',
      options: {
        strokeStyle: 'rgb(13, 110, 253)',
        fillStyle: 'rgba(13, 110, 253, 0.4)',
        lineWidth: 3,
      },
    },
  ],
};
const timeSeriesAtomsMeanSpeedConfig = {
  id: 'atoms-mean-speed',
  name: 'Atoms Mean Speed',
  data: () => getCurrentSimulation().summary['ATOMS_MEAN_SPEED'],
  config: [
    {
      name: 'Atoms Mean Speed',
      options: {
        strokeStyle: 'rgb(13, 110, 253)',
        fillStyle: 'rgba(13, 110, 253, 0.4)',
        lineWidth: 3,
      },
    },
  ],
}
const timeSeriesAtomsTypeMeanSpeedConfig = {
  id: 'atoms-type-mean-speed',
  name: 'Atoms Type Mean Speed',
  height: 200,
  data: () => getCurrentSimulation().summary['ATOMS_TYPE_MEAN_SPEED'],
  config: getCurrentSimulation().config.typesConfig.COLORS.map((color, i) => {
    const strColor = color.join(', ')
    return {
      name: 'Atoms Mean Speed',
      options: {
        strokeStyle: `rgb(${strColor})`,
        lineWidth: 2,
      },
    };
  }),
}
const timeSeriesAtomsTypeLinksCountConfig = {
  id: 'atoms-type-links-count-speed',
  name: 'Atoms Type Links Count',
  height: 200,
  data: () => getCurrentSimulation().summary['ATOMS_TYPE_LINKS_COUNT'],
  config: getCurrentSimulation().config.typesConfig.COLORS.map((color, i) => {
    const strColor = color.join(', ')
    return {
      name: 'Atoms Type Links Count',
      options: {
        strokeStyle: `rgb(${strColor})`,
        lineWidth: 2,
      },
    };
  }),
}
const timeSeriesAtomsTypeLinksMeanCountConfig = {
  id: 'atoms-type-links-mean-count-speed',
  name: 'Atoms Type Links Mean Count',
  height: 200,
  data: () => getCurrentSimulation().summary['ATOMS_TYPE_LINKS_MEAN_COUNT'],
  config: getCurrentSimulation().config.typesConfig.COLORS.map((color, i) => {
    const strColor = color.join(', ')
    return {
      name: 'Atoms Type Links Mean Count',
      options: {
        strokeStyle: `rgb(${strColor})`,
        lineWidth: 2,
      },
    };
  }),
}

const timeSeriesConfig: ChartConfig[] = [
  timeSeriesFpsConfig,
  timeSeriesLinksCountConfig,
  timeSeriesAtomsMeanSpeedConfig,
  timeSeriesAtomsTypeMeanSpeedConfig,
  timeSeriesAtomsTypeLinksCountConfig,
  timeSeriesAtomsTypeLinksMeanCountConfig,
];

</script>

<template>
  <config-section>
    <template #title>
      Summary
    </template>
    <template #body>
      <br />
      <div v-for="config in timeSeriesConfig">
        <chart
          :id="config.id"
          :name="config.name"
          :data="config.data"
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
