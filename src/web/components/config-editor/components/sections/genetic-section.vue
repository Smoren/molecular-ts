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
import { computed, ref } from "vue";
import { round } from "@/lib/math";

const configStore = useConfigStore();
const isStarted = ref(false);
const bestGenome = ref<SimulationGenome | undefined>();
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
  worldConfig.CONFIG_2D.INITIAL.ATOMS_COUNT = 500;
  worldConfig.CONFIG_2D.INITIAL.MIN_POSITION = [0, 0];
  worldConfig.CONFIG_2D.INITIAL.MAX_POSITION = [1000, 1000];

  const macroConfig: GeneticSearchConfig = {
    populationSize: POPULATION_SIZE,
    survivalRate: 0.5,
    crossoverRate: 0.5,
  };
  const metricsStrategyConfig: SimulationMetricsStrategyConfig<ClusterizationTaskConfig> = {
    worldConfig,
    checkpoints: [50, 50],
    repeats: 1,
    task: repeatRunSimulationForClustersGradeWithTimeout,
    onTaskResult: (metrics) => {
      console.log('genome handled', metrics);
      genomesHandled.value++;
    } // TODO TTaskConfig to input
  };
  const weightsConfig: ClusterizationWeightsConfig = createDefaultClusterizationWeightsConfig();
  const populateRandomTypesConfigCollection = [fullCopyObject(configStore.randomTypesConfig)];
  const mutationRandomTypesConfigCollection = [fullCopyObject(configStore.randomTypesConfig)];
  const mutationStrategyConfig: DynamicProbabilityMutationStrategyConfig = {
    probabilities: [0.01, 0.03, 0.05, 0.1, 0.2, 0.3, 0.5],
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
  isStarted.value = false;
}

async function runAlgoStep(algo: GeneticSearch<SimulationGenome>) {
  genomesHandled.value = 0;

  await algo.fitStep();
  algo.clearCache();

  bestGenome.value = algo.bestGenome;
  generation.value = algo.generation;

  console.log(`Generation ${algo.generation}`, algo.bestGenome, algo.bestGenome.stats);
  console.log('Fitness', algo.population.map((x) => x.stats!.fitness));
  configStore.setTypesConfig(algo.bestGenome.typesConfig);

  if (!isStarted.value) {
    console.log('Stopping genetic algo');
    return;
  }

  setTimeout(async () => {
    await runAlgoStep(algo);
  }, 10);
}

</script>

<template>
  <div class="btn-group" style="width: 100%;">
    <button class="btn btn-outline-secondary" @click="startAlgo" :disabled="isStarted">
      Start
    </button>
    <button class="btn btn-outline-secondary" @click="stopAlgo" :disabled="!isStarted">
      Stop
    </button>
  </div>
  <div class="progress-block" v-if="isStarted">
    Genomes handled: <b>{{ genomesHandled }}</b>
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
