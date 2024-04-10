<script setup lang="ts">

import ConfigSection from '@/components/config-editor/components/containers/config-section.vue';
import { useSimulationStore } from '@/store/simulation';
import Chart from "@/components/config-editor/components/widgets/chart.vue";
const { getCurrentSimulation } = useSimulationStore();

const timeSeriesConfig = [
  {
    id: 'atoms-count',
    name: 'Atoms count',
    options: {
      strokeStyle: 'rgb(255, 0, 0)',
      fillStyle: 'rgba(255, 0, 0, 0.4)',
      lineWidth: 3,
    },

  },
  {
    id: 'links-count',
    name: 'Links count',
    options: {
      strokeStyle: 'rgb(0, 255, 0)',
      fillStyle: 'rgba(0, 255, 0, 0.4)',
      lineWidth: 3,
    },

  },
  {
    id: 'step-frequency',
    name: 'FPS',
    options: {
      strokeStyle: 'rgb(0, 0, 255)',
      fillStyle: 'rgba(0, 0, 255, 0.4)',
      lineWidth: 3,
    },

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
      <div v-for="ch in timeSeriesConfig">
        <chart
            :id="ch.id"
            :period="1000"
            :width="350"
            :height="300"
            :config="ch."
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
