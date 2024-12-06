<script setup lang="ts">

import { useGeneticStore } from "@/web/store/genetic";
import { round } from "@/lib/math";

const geneticStore = useGeneticStore();

</script>

<template>
  <div class="btn-group" style="width: 100%;">
    <button class="btn btn-outline-secondary" @click="geneticStore.start" :disabled="geneticStore.isRunning">
      Start
    </button>
    <button class="btn btn-outline-secondary" @click="geneticStore.stop" :disabled="!geneticStore.isRunning || geneticStore.isStopping">
      Stop
    </button>
  </div>
  <div class="progress-block" v-if="geneticStore.isRunning">
    Genomes handled: <b>{{ geneticStore.genomesHandled }}</b>
    <span v-if="geneticStore.isStopping">&nbsp;(stopping...)</span>
    <div class="progress">
      <div class="progress-bar progress-bar-striped progress-bar-animated" :style="{ width: geneticStore.progress + '%'}"></div>
    </div>
  </div>

  <div class="summary">
    <table class="table" style="width: 100%">
      <tbody>
        <tr v-if="geneticStore.generation">
          <td width="50%">Generation</td>
          <td>{{ geneticStore.generation }}</td>
        </tr>
        <tr v-if="geneticStore.bestGenome">
          <td>Best genome ID</td>
          <td>{{ geneticStore.bestGenome!.id }}</td>
        </tr>
        <tr v-if="geneticStore.bestGenome">
          <td>Best genome score</td>
          <td>{{ round(geneticStore.bestGenome!.stats!.fitness, 4) }}</td>
        </tr>
        <tr v-if="geneticStore.populationSummary">
          <td>Average population score</td>
          <td>{{ round(geneticStore.populationSummary!.fitnessSummary.mean, 4) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">

@import "../../assets/config-editor.scss";

.progress-block {
  margin-top: 30px;
}

.summary {
  margin-top: 30px;
}

</style>
