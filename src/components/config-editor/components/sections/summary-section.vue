<script setup lang="ts">

import { onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import type { ITimeSeriesPresentationOptions } from 'smoothie';
import { SmoothieChart, TimeSeries } from 'smoothie';
import ConfigSection from '@/components/config-editor/components/containers/config-section.vue';
import { useSimulationStore } from '@/store/simulation';
import type { SummaryAttr } from "@/lib/types/summary";

type TimeSeriesConfig = {
  name: string;
  options: ITimeSeriesPresentationOptions;
}

const { getCurrentSimulation } = useSimulationStore();

const timeSeriesConfig: Record<SummaryAttr | string, TimeSeriesConfig> = {
  ATOMS_COUNT: {
    name: 'Atoms count',
    options: {
      strokeStyle: 'rgb(255, 0, 0)',
      fillStyle: 'rgba(255, 0, 0, 0.4)',
      lineWidth: 3,
    }
  },
  LINKS_COUNT: {
    name: 'Links count',
    options: {
      strokeStyle: 'rgb(0, 255, 0)',
      fillStyle: 'rgba(0, 255, 0, 0.4)',
      lineWidth: 3,
    }
  },
  STEP_FREQUENCY: {
    name: 'FPS',
    options: {
      strokeStyle: 'rgb(0, 0, 255)',
      fillStyle: 'rgba(0, 0, 255, 0.4)',
      lineWidth: 3,
    }
  },
};

const timeSeries: Record<SummaryAttr | string, TimeSeries> = {
  // ATOMS_COUNT: new TimeSeries(),
  // LINKS_COUNT: new TimeSeries(),
  STEP_FREQUENCY: new TimeSeries(),
};

const interval: Ref<number | undefined> = ref();

onMounted(() => {
  const smoothie = new SmoothieChart({
    grid: {
      strokeStyle: 'rgb(80, 80, 80)',
      fillStyle: 'rgb(0, 0, 0)',
      lineWidth: 1,
      millisPerLine: 1250,
      verticalSections: 6,
    },
    labels: {fillStyle: 'rgb(255, 255, 255)'}
  });
  smoothie.streamTo(document.getElementById('chart') as HTMLCanvasElement);

  for (const attr in timeSeries) {
    const series = timeSeries[attr as SummaryAttr];
    const config = timeSeriesConfig[attr as SummaryAttr];
    smoothie.addTimeSeries(series, config.options);
  }

  // Add a random value to each line every second
  clearInterval(interval.value);
  interval.value = setInterval(() => {
    const summary = getCurrentSimulation().summary;
    const now = Date.now();
    for (const key in summary) {
      if (key in timeSeries) {
        timeSeries[key].append(now, summary[key as SummaryAttr]);
      }
    }
  }, 1000);
});

</script>

<template>
  <config-section>
    <template #title>
      Summary
    </template>
    <template #body>
      <br />
      <b>FPS</b>
      <canvas id="chart" width="350" height="300"></canvas>
    </template>
  </config-section>
</template>

<style scoped lang="scss">

@import "../../assets/config-editor";

#chart {
  width: 100%;
}

</style>
