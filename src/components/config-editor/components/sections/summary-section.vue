<script setup lang="ts">

import ConfigSection from '@/components/config-editor/components/containers/config-section.vue';
import { useSimulationStore } from '@/store/simulation';
import type { TimeSeriesConfig } from "@/components/config-editor/components/widgets/chart.vue";
import Chart from "@/components/config-editor/components/widgets/chart.vue";

const { getCurrentSimulation } = useSimulationStore();

type ChartConfig = {
  id: string;
  name: string;
  config: Record<string, TimeSeriesConfig>;
}

const timeSeriesConfig: ChartConfig[] = [
  {
    id: 'fps',
    name: 'FPS',
    config: {
      STEP_FREQUENCY: {
        name: 'FPS',
        options: {
          strokeStyle: 'rgb(13, 110, 253)',
          fillStyle: 'rgba(13, 110, 253, 0.4)',
          lineWidth: 3,
        },
        getter: () => getCurrentSimulation().summary['STEP_FREQUENCY'][0],
      },
    }
  },
  {
    id: 'links-count',
    name: 'Links Count',
    config: {
      LINKS_COUNT: {
        name: 'Links Count',
        options: {
          strokeStyle: 'rgb(13, 110, 253)',
          fillStyle: 'rgba(13, 110, 253, 0.4)',
          lineWidth: 3,
        },
        getter: () => getCurrentSimulation().summary['LINKS_COUNT'][0],
      },
    }
  },
  {
    id: 'atoms-mean-speed',
    name: 'Atoms Mean Speed',
    config: {
      LINKS_COUNT: {
        name: 'Atoms Mean Speed',
        options: {
          strokeStyle: 'rgb(13, 110, 253)',
          fillStyle: 'rgba(13, 110, 253, 0.4)',
          lineWidth: 3,
        },
        getter: () => getCurrentSimulation().summary['ATOMS_MEAN_SPEED'][0],
      },
    }
  },
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
          :period="100"
          :width="350"
          :height="100"
          :config="config.config"
        />
      </div>
    </template>
  </config-section>
</template>

<style scoped lang="scss">

@import "../../assets/config-editor";

#chart {
  width: 100%;
}

</style>
