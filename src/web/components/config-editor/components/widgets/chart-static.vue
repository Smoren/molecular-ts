<script setup lang="ts">

import { ref } from "vue";
import { Chart, Line, Responsive } from 'vue3-charts';
import type { ChartAxis } from "vue3-charts/dist/types";

defineProps<{
  data: { x: number, y: number }[],
}>()

const axis = ref<ChartAxis>({
  primary: {
    domain: ["dataMin", "dataMax*1.05"],
    type: "linear",
    ticks: 8,
  },
  secondary: {
    domain: ["dataMin", "dataMax*1.1"],
    type: "linear",
    ticks: 8,
  },
});

</script>

<template>
  <Responsive class="w-full">
    <template #main="{ width }">
      <Chart
        :axis="axis"
        :size="{ width, height: 200 }"
        :margin="{ top: 0, right: 0, bottom: 0, left: 0 }"
        :data="data"
        direction="horizontal"
      >
        <template #layers>
          <Line :dataKeys="['x', 'y']" type="monotone" :hide-dot="true" />
        </template>
      </Chart>
    </template>
  </Responsive>
</template>
