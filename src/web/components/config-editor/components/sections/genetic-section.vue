<script setup lang="ts">

import type { GeneticSearchConfig, GeneticSearchStrategyConfig } from "genetic-search";
import {
  GeneticSearch,
} from "genetic-search";
import type {
  ClusterizationTaskConfig,
  ClusterizationWeightsConfig,
  DynamicProbabilityMutationStrategyConfig,
  SimulationGenome,
  SimulationMetricsStrategyConfig
} from "@/lib/genetic/types";
import {
  ClassicCrossoverStrategy,
  ClusterizationFitnessStrategy,
  ClusterizationMetricsStrategy,
  DynamicProbabilityMutationStrategy,
  RandomPopulateStrategy,
} from "@/lib/genetic/strategies";
import { repeatRunSimulationForClustersGradeWithTimeout } from "@/lib/genetic/grade";
import { createDefaultClusterizationWeightsConfig } from "@/lib/analysis/utils";
import { useConfigStore } from "@/web/store/config";
import { fullCopyObject } from "@/lib/utils/functions";
import { SimpleMetricsCache } from "genetic-search/src/cache";
import { computed, onUnmounted, ref } from "vue";
import { arraySum, round } from "@/lib/math";
import {
  createDefaultInitialConfig,
  createDefaultMutationProbabilities,
  createDefaultMutationRandomTypesConfigCollection,
  createDefaultPopulateRandomTypesConfigCollection
} from "@/web/utils/genetic";

const configStore = useConfigStore();
const isStarted = ref(false);
const needStop = ref(false);
const bestGenome = ref<SimulationGenome | undefined>();
const averageScore = ref(0);
const generation = ref(0);
const genomesHandled = ref(0);

const POPULATION_SIZE = 30;

const progress = computed(() => {
  const totalCount = generation.value ? POPULATION_SIZE/2 : POPULATION_SIZE;
  return genomesHandled.value / totalCount * 100;
});

function createAlgo() {
  const worldConfig = fullCopyObject(configStore.worldConfig);
  worldConfig.TEMPERATURE_FUNCTION = () => 0;
  worldConfig.CONFIG_2D.INITIAL = createDefaultInitialConfig();

  const macroConfig: GeneticSearchConfig = {
    populationSize: POPULATION_SIZE,
    survivalRate: 0.5,
    crossoverRate: 0.5,
  };
  const metricsStrategyConfig: SimulationMetricsStrategyConfig<ClusterizationTaskConfig> = {
    worldConfig,
    checkpoints: [30, 30],
    repeats: 1,
    task: repeatRunSimulationForClustersGradeWithTimeout,
    onTaskResult: (metrics) => {
      console.log('genome handled', metrics);
      genomesHandled.value++;
    } // TODO TTaskConfig to input
  };
  const weightsConfig: ClusterizationWeightsConfig = createDefaultClusterizationWeightsConfig();
  const populateRandomTypesConfigCollection = [fullCopyObject(configStore.randomTypesConfig), ...createDefaultPopulateRandomTypesConfigCollection(configStore.randomTypesConfig.TYPES_COUNT)];
  const mutationRandomTypesConfigCollection = [fullCopyObject(configStore.randomTypesConfig), ...createDefaultMutationRandomTypesConfigCollection(configStore.randomTypesConfig.TYPES_COUNT)];
  const mutationStrategyConfig: DynamicProbabilityMutationStrategyConfig = {
    probabilities: createDefaultMutationProbabilities(),
  }

  const strategyConfig: GeneticSearchStrategyConfig<SimulationGenome> = {
    populate: new RandomPopulateStrategy(populateRandomTypesConfigCollection),
    metrics: new ClusterizationMetricsStrategy(metricsStrategyConfig, weightsConfig),
    fitness: new ClusterizationFitnessStrategy(),
    mutation: new DynamicProbabilityMutationStrategy(mutationStrategyConfig, mutationRandomTypesConfigCollection),
    crossover: new ClassicCrossoverStrategy(),
    cache: new SimpleMetricsCache(),
  };

  return new GeneticSearch<SimulationGenome>(macroConfig, strategyConfig);
}

function startAlgo() {
  if (isStarted.value) {
    console.log('Already started. Terminate.');
    return;
  }

  console.log('Start genetic algo');

  isStarted.value = true;
  const algo = createAlgo();
  algo.population[0].typesConfig = fullCopyObject(configStore.typesConfig);
  runAlgoStep(algo);
}

function stopAlgo() {
  console.log('Stopping genetic algo...');
  needStop.value = true;
}

async function runAlgoStep(algo: GeneticSearch<SimulationGenome>) {
  genomesHandled.value = 0;

  await algo.fitStep();
  algo.clearCache();

  bestGenome.value = algo.bestGenome;
  generation.value = algo.generation;

  const scores = algo.population.map((x) => x.stats!.fitness);
  averageScore.value = arraySum(scores) / scores.length;

  console.log(`Generation ${algo.generation}`, algo.bestGenome, algo.bestGenome.stats);
  console.log('Fitness', algo.population.map((x) => x.stats!.fitness));

  if (needStop.value) {
    isStarted.value = false;
    console.log('Genetic algo stopped.');
    return;
  }

  configStore.setTypesConfig(algo.bestGenome.typesConfig);

  setTimeout(async () => {
    await runAlgoStep(algo);
  }, 10);
}

onUnmounted(() => {
  stopAlgo();
});

</script>

<template>
  <div class="btn-group" style="width: 100%;">
    <button class="btn btn-outline-secondary" @click="startAlgo" :disabled="isStarted">
      Start
    </button>
    <button class="btn btn-outline-secondary" @click="stopAlgo" :disabled="!isStarted || needStop">
      Stop
    </button>
  </div>
  <div class="progress-block" v-if="isStarted">
    Genomes handled: <b>{{ genomesHandled }}</b>
    <span v-if="needStop">&nbsp;(stopping...)</span>
    <div class="progress">
      <div class="progress-bar progress-bar-striped progress-bar-animated" :style="{ width: progress + '%'}"></div>
    </div>
  </div>

  <div class="summary">
    <table class="table" style="width: 100%">
      <tbody>
        <tr v-if="generation">
          <td width="50%">Generation</td>
          <td>{{ generation-1 }}</td>
        </tr>
        <tr v-if="bestGenome">
          <td>Best genome ID</td>
          <td>{{ bestGenome!.id }}</td>
        </tr>
        <tr v-if="bestGenome">
          <td>Best genome score</td>
          <td>{{ round(bestGenome!.stats!.fitness, 4) }}</td>
        </tr>
        <tr v-if="bestGenome">
          <td>Average population score</td>
          <td>{{ round(averageScore, 4) }}</td>
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
