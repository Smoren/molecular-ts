<script setup lang="ts">

import { useGeneticStore } from "@/web/store/genetic";
import { round } from "@/lib/math";
import InputHeader from "@/web/components/base/input-header.vue";
import { computed, ref } from "vue";
import { MDBAccordion, MDBAccordionItem } from "mdb-vue-ui-kit";
import ChartStatic from "@/web/components/config-editor/components/widgets/chart-static.vue";

const geneticStore = useGeneticStore();
const activeAccordionItem = ref('collapse-macro');
const fitnessChartData = computed(() => geneticStore.populationFitness.map((y, x) => ({x, y})));
const bestFitnessHistoryChartData = computed(() => geneticStore.bestGenomeStatsHistory.map((stats, x) => ({x, y: stats.fitness})));
const meanFitnessHistoryChartData = computed(() => geneticStore.populationSummaryHistory.map((stats, x) => ({x, y: stats.fitnessSummary.mean})));

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
    Genomes handled: <b>{{ geneticStore.genomesHandled }} / {{ geneticStore.populationSize }}</b>
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
        <tr v-if="geneticStore.populationSummary">
          <td>Stagnation counter</td>
          <td>{{ geneticStore.populationSummary!.stagnationCounter }}</td>
        </tr>
        <tr v-if="geneticStore.bestGenome">
          <td>Best genome ID</td>
          <td>{{ geneticStore.bestGenome!.id }}</td>
        </tr>
        <tr v-if="geneticStore.populationSummary">
          <td>Best genome score</td>
          <td>{{ round(geneticStore.populationSummary!.fitnessSummary.best, 4) }}</td>
        </tr>
        <tr v-if="geneticStore.populationSummary">
          <td>Second genome score</td>
          <td>{{ round(geneticStore.populationSummary!.fitnessSummary.second, 4) }}</td>
        </tr>
        <tr v-if="geneticStore.populationSummary">
          <td>Average population score</td>
          <td>{{ round(geneticStore.populationSummary!.fitnessSummary.mean, 4) }}</td>
        </tr>
        <tr v-if="geneticStore.populationSummary">
          <td>Median population score</td>
          <td>{{ round(geneticStore.populationSummary!.fitnessSummary.median, 4) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="genetic-charts-container" v-if="fitnessChartData.length">
    <h6>Population fitness</h6>
    <chart-static :data="fitnessChartData" />
  </div>
  <div class="genetic-charts-container" v-if="bestFitnessHistoryChartData.length > 1">
    <h6>Best fitness history</h6>
    <chart-static :data="bestFitnessHistoryChartData" />
  </div>
  <div class="genetic-charts-container" v-if="meanFitnessHistoryChartData.length > 1">
    <h6>Mean fitness history</h6>
    <chart-static :data="meanFitnessHistoryChartData" />
  </div>
  <MDBAccordion v-model="activeAccordionItem">
    <MDBAccordionItem headerTitle="Macro config" collapseId="collapse-macro">
      <div class="config-block">
        <div>
          <input-header name="Population size" />
          <input type="number" step="1" v-model="geneticStore.macroConfig.populationSize" />
        </div>
        <div>
          <input-header name="Survival rate" />
          <input type="number" step="0.1" v-model="geneticStore.macroConfig.survivalRate" />
        </div>
        <div>
          <input-header name="Crossover rate" />
          <input type="number" step="0.1" v-model="geneticStore.macroConfig.crossoverRate" />
        </div>
      </div>
    </MDBAccordionItem>
    <MDBAccordionItem headerTitle="Weights config" collapseId="collapse-weights">
      <div class="config-block">
        <div>
          <input-header name="Min compound size" />
          <input type="number" step="1" v-model="geneticStore.weightsConfig.minCompoundSize" />
        </div>
        <div>
          <input-header name="Weight of clusters count" />
          <input type="number" step="0.5" v-model="geneticStore.weightsConfig.clustersCountWeight" />
        </div>
        <div>
          <input-header name="Weight of cluster size" />
          <input type="number" step="0.5" v-model="geneticStore.weightsConfig.averageClusterSizeWeight" />
        </div>
        <div>
          <input-header name="Weight of filtered compounds count" />
          <input type="number" step="0.5" v-model="geneticStore.weightsConfig.relativeFilteredCountWeight" />
        </div>
        <div>
          <input-header name="Weight of clustered compounds count" />
          <input type="number" step="0.5" v-model="geneticStore.weightsConfig.relativeClusteredCountWeight" />
        </div>
        <div>
          <input-header name="Weight of atoms count in clustered compound" />
          <input type="number" step="0.5" v-model="geneticStore.weightsConfig.vertexesCountWeight" />
        </div>
        <div>
          <input-header name="Weight of links count in clustered compound" />
          <input type="number" step="0.5" v-model="geneticStore.weightsConfig.edgesCountWeight" />
        </div>
        <div>
          <input-header name="Weight of unique types count in clustered compound" />
          <input type="number" step="0.5" v-model="geneticStore.weightsConfig.uniqueTypesCountWeight" />
        </div>
        <div>
          <input-header name="Weight of symmetry grade of clustered compounds" />
          <input type="number" step="0.5" v-model="geneticStore.weightsConfig.symmetryWeight" />
        </div>
        <div>
          <input-header name="Weight of compounds radii in clusters" />
          <input type="number" step="0.5" v-model="geneticStore.weightsConfig.radiusWeight" />
        </div>
        <div>
          <input-header name="Weight of compounds speeds in clusters" />
          <input type="number" step="0.5" v-model="geneticStore.weightsConfig.speedWeight" />
        </div>
        <div>
          <input-header name="Relative compounded atoms count weight" />
          <input type="number" step="0.5" v-model="geneticStore.weightsConfig.relativeCompoundedAtomsCountWeight" />
        </div>
        <div>
          <input-header name="Relative compounded links count weight" />
          <input type="number" step="0.5" v-model="geneticStore.weightsConfig.relativeLinksCountWeight" />
        </div>
        <div>
          <input-header name="New created links per step weight" />
          <input type="number" step="0.5" v-model="geneticStore.weightsConfig.linksCreatedWeight" />
        </div>
      </div>
    </MDBAccordionItem>
  </MDBAccordion>
</template>

<style scoped lang="scss">

@use "../../assets/config-editor.scss";

.progress-block {
  margin-top: 30px;
}

.summary {
  margin-top: 30px;
}

.config-block > div {
  margin-bottom: 15px;
}

.config-block input[type=number] {
  width: 100%;
}

.genetic-charts-container {
  margin-top: 30px;
  margin-bottom: 30px;

  h6 {
    margin-bottom: 15px;
  }
}

</style>
