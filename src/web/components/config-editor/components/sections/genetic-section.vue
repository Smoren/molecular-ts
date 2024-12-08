<script setup lang="ts">

import { useGeneticStore } from "@/web/store/genetic";
import { round } from "@/lib/math";
import InputHeader from "@/web/components/base/input-header.vue";

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
        <tr v-if="geneticStore.populationSummary">
          <td>Median population score</td>
          <td>{{ round(geneticStore.populationSummary!.fitnessSummary.median, 4) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="weights-config">
    <h4>Weights config</h4>
    <div>
      <input-header name="Min compound size" />
      <input type="number" step="0.5" v-model="geneticStore.weightsConfig.minCompoundSize" />
    </div>
    <div>
      <input-header name="Weight of clusters count" />
      <input type="number" step="0.5" v-model="geneticStore.weightsConfig.clustersCountWeight" />
    </div>
    <div>
      <input-header name="Weight of cluster size" />
      <input type="number" step="0.5" v-model="geneticStore.weightsConfig.clusterSizeWeight" />
    </div>
    <div>
      <input-header name="Weight of filtered compounds count" />
      <input type="number" step="0.5" v-model="geneticStore.weightsConfig.relativeFilteredCountWeight" />
    </div>
    <div>
      <input-header name="Weight of clustered compounds count" />
      <input type="number" step="0.5" v-model="geneticStore.weightsConfig.relativeFilteredCountWeight" />
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
      <input-header name="Weight of difference grade of compounds in cluster" />
      <input type="number" step="0.5" v-model="geneticStore.weightsConfig.differenceWeight" />
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

.weights-config > div {
  margin-bottom: 15px;
}

.weights-config input[type=number] {
  width: 100%;
}

</style>
