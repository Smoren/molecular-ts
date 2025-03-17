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
const meanAgeHistoryChartData = computed(() => geneticStore.populationSummaryHistory.map((stats, x) => ({x, y: stats.ageSummary.mean})));

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
        <tr v-if="geneticStore.populationSummary">
          <td>Average genome age</td>
          <td>{{ geneticStore.populationSummary!.ageSummary.mean }}</td>
        </tr>
        <tr v-if="geneticStore.bestGenome">
          <td>Best genome ID</td>
          <td>{{ geneticStore.bestGenome!.id }}</td>
        </tr>
        <tr v-if="geneticStore.bestGenome">
          <td>Best genome origin</td>
          <td>{{ geneticStore.bestGenome!.stats!.origin }}</td>
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
  <div class="genetic-charts-container" v-if="meanAgeHistoryChartData.length > 1">
    <h6>Mean age history</h6>
    <chart-static :data="meanAgeHistoryChartData" />
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
        <div>
          <div>
            <label>
              <input type="checkbox" v-model="geneticStore.launchConfig.addCurrentTypesConfig" />
              Add current types config to population
            </label>
          </div>
          <div>
            <label>
              <input type="checkbox" v-model="geneticStore.launchConfig.randomizeStartPopulation" />
              Randomize start population
            </label>
          </div>
        </div>
      </div>
    </MDBAccordionItem>
    <MDBAccordionItem headerTitle="Params config" collapseId="collapse-params">
      <div class="config-block">
        <div>
          <input-header name="Min compound size" />
          <input type="number" step="1" v-model="geneticStore.clusterizationConfig.params.minCompoundSize" />
        </div>
        <div>
          <input-header name="Min unique types count" />
          <input type="number" step="1" v-model="geneticStore.clusterizationConfig.params.minUniqueTypesCount" />
        </div>
        <div>
          <input-header name="Min polymer size" />
          <input type="number" step="1" v-model="geneticStore.clusterizationConfig.params.minPolymerSize" />
        </div>
        <div>
          <input-header name="Min polymer confidence score" />
          <input type="number" step="0.1" v-model="geneticStore.clusterizationConfig.params.minPolymerConfidenceScore" />
        </div>
        <div>
          <input-header name="Monomer candidate vertexes count bounds" />
          <input type="number" step="1" style="width: 50%" v-model="geneticStore.clusterizationConfig.params.monomerCandidateVertexesCountBounds[0]" />
          <input type="number" step="1" style="width: 50%" v-model="geneticStore.clusterizationConfig.params.monomerCandidateVertexesCountBounds[1]" />
        </div>
        <div>
          <input-header name="Polymer candidate vertexes count bounds" />
          <input type="number" step="1" style="width: 50%" v-model="geneticStore.clusterizationConfig.params.polymerCandidateVertexesCountBounds[0]" />
          <input type="number" step="1" style="width: 50%" v-model="geneticStore.clusterizationConfig.params.polymerCandidateVertexesCountBounds[1]" />
        </div>
      </div>
    </MDBAccordionItem>
    <MDBAccordionItem headerTitle="Weights config" collapseId="collapse-weights">
      <div class="config-block">
        <div>
          <input-header name="Weight of clusters count" />
          <input type="number" step="0.1" v-model="geneticStore.clusterizationConfig.weights.clustersCountWeight" />
        </div>
        <div>
          <input-header name="Weight of average cluster size" />
          <input type="number" step="0.1" v-model="geneticStore.clusterizationConfig.weights.averageClusterSizeWeight" />
        </div>
        <div>
          <input-header name="Weight of max cluster size" />
          <input type="number" step="0.1" v-model="geneticStore.clusterizationConfig.weights.maxClusterSizeWeight" />
        </div>
        <div>
          <input-header name="Weight of relative filtered compounds count" />
          <input type="number" step="0.1" v-model="geneticStore.clusterizationConfig.weights.relativeFilteredCompoundsWeight" />
        </div>
        <div>
          <input-header name="Weight of relative clustered compounds count" />
          <input type="number" step="0.1" v-model="geneticStore.clusterizationConfig.weights.relativeClusteredCompoundsWeight" />
        </div>
        <div>
          <input-header name="Weight of relative clustered atoms count" />
          <input type="number" step="0.1" v-model="geneticStore.clusterizationConfig.weights.relativeClusteredAtomsWeight" />
        </div>
        <div>
          <input-header name="Weight of average atoms count in clustered compound" />
          <input type="number" step="0.1" v-model="geneticStore.clusterizationConfig.weights.averageClusteredCompoundVertexesCountWeight" />
        </div>
        <div>
          <input-header name="Weight of max atoms count in clustered compound" />
          <input type="number" step="0.1" v-model="geneticStore.clusterizationConfig.weights.maxClusteredCompoundVertexesCountWeight" />
        </div>
        <div>
          <input-header name="Weight of links count in clustered compound" />
          <input type="number" step="0.1" v-model="geneticStore.clusterizationConfig.weights.averageClusteredCompoundEdgesCountWeight" />
        </div>
        <div>
          <input-header name="Weight of unique types count in clustered compound" />
          <input type="number" step="0.1" v-model="geneticStore.clusterizationConfig.weights.averageClusteredCompoundUniqueTypesCountWeight" />
        </div>
        <div>
          <input-header name="Weight of symmetry grade of clustered compounds" />
          <input type="number" step="0.1" v-model="geneticStore.clusterizationConfig.weights.averageClusteredCompoundSymmetryScoreWeight" />
        </div>
        <div>
          <input-header name="Weight of compounds radii in clusters" />
          <input type="number" step="0.1" v-model="geneticStore.clusterizationConfig.weights.averageClusteredCompoundRadiusWeight" />
        </div>
        <div>
          <input-header name="Weight of compounds speeds in clusters" />
          <input type="number" step="0.1" v-model="geneticStore.clusterizationConfig.weights.averageClusteredCompoundSpeedWeight" />
        </div>
        <div>
          <input-header name="Weight of relative compounded atoms count" />
          <input type="number" step="0.1" v-model="geneticStore.clusterizationConfig.weights.relativeCompoundedAtomsWeight" />
        </div>
        <div>
          <input-header name="Weight of average links weight" />
          <input type="number" step="0.1" v-model="geneticStore.clusterizationConfig.weights.averageAtomLinksWeight" />
        </div>
        <div>
          <input-header name="Weight of new created links per step weight" />
          <input type="number" step="0.1" v-model="geneticStore.clusterizationConfig.weights.newLinksCreatedPerStepScoreWeight" />
        </div>
        <div>
          <input-header name="Weight of max polymer size" />
          <input type="number" step="0.1" v-model="geneticStore.clusterizationConfig.weights.maxPolymerSizeWeight" />
        </div>
        <div>
          <input-header name="Weight of average monomer vertexes count" />
          <input type="number" step="0.1" v-model="geneticStore.clusterizationConfig.weights.averageMonomerVertexesCountWeight" />
        </div>
        <div>
          <input-header name="Weight of average monomer unique types count" />
          <input type="number" step="0.1" v-model="geneticStore.clusterizationConfig.weights.averageMonomerUniqueTypesCountWeight" />
        </div>
        <div>
          <input-header name="Weight of average polymer vertexes count" />
          <input type="number" step="0.1" v-model="geneticStore.clusterizationConfig.weights.averagePolymerVertexesCountWeight" />
        </div>
        <div>
          <input-header name="Weight of average polymer size" />
          <input type="number" step="0.1" v-model="geneticStore.clusterizationConfig.weights.averagePolymerSizeWeight" />
        </div>
        <div>
          <input-header name="Weight of average polymer confidence score" />
          <input type="number" step="0.1" v-model="geneticStore.clusterizationConfig.weights.averagePolymerConfidenceScoreWeight" />
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
