<script setup lang="ts">

import { onMounted, onUnmounted, ref, type Ref } from 'vue';
import type { ITimeSeriesPresentationOptions } from 'smoothie';
import { SmoothieChart, TimeSeries } from 'smoothie';

export type TimeSeriesConfig = {
  name: string;
  options: ITimeSeriesPresentationOptions;
  getter: () => number;
}

const props = defineProps<{
  id: string;
  name: string;
  config: TimeSeriesConfig[];
  period: number;
  width: number;
  height: number;
}>();

const chart = new SmoothieChart({
  grid: {
    strokeStyle: 'rgb(80, 80, 80)',
    fillStyle: 'rgb(0, 0, 0)',
    lineWidth: 1,
    millisPerLine: 1250,
    verticalSections: 6,
  },
  labels: {fillStyle: 'rgb(255, 255, 255)'}
});

const interval: Ref<number | undefined> = ref();
const timeSeries: Ref<TimeSeries[]> = ref([]);

const init = (): void => {
  chart.streamTo(document.getElementById(`chart-${props.id}`) as HTMLCanvasElement);

  for (let i=0; i<props.config.length; ++i) {
    const config = props.config[i];
    const series = new TimeSeries();

    timeSeries.value[i] = series;
    chart.addTimeSeries(series, config.options);
  }

  interval.value = setInterval(() => {
    const now = Date.now();
    for (let i=0; i<props.config.length; ++i) {
      const config = props.config[i];
      const summary = config.getter();
      const series = timeSeries.value[i] as TimeSeries;
      series.append(now, summary);
    }
  }, props.period);

  chart.start();
};

const dispose = (): void => {
  chart.stop();

  for (let i=0; i<timeSeries.value.length; ++i) {
    chart.removeTimeSeries(timeSeries.value[i]);
  }

  timeSeries.value = [];
  clearInterval(interval.value);
};

onMounted(() => {
  init();
  console.log(`chart '${props.id}' mounted`);
})

onUnmounted(() => {
  dispose();
  console.log(`chart '${props.id}' unmounted`);
})

</script>

<template>
  <h5>{{ name }}</h5>
  <canvas :id="`chart-${id}`" class="chart" :width="width" :height="height"></canvas>
</template>

<style scoped lang="scss">

@import "../../assets/config-editor";

.chart {
  width: 100%;
  border: 1px solid #353535;
}

</style>
