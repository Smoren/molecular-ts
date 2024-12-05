<script setup lang="ts">

import type { GeneticSearchConfig, GeneticSearchFitConfig, GeneticSearchStrategyConfig } from "genetic-search";
import {
  GeneticSearch,
  Scheduler,
  WeightedAgeAverageMetricsCache,
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
import { repeatRunSimulationForClustersGrade } from "@/lib/genetic/grade";
import { createDefaultClusterizationWeightsConfig } from "@/lib/analysis/utils";
import { useConfigStore } from "@/web/store/config";

const configStore = useConfigStore();

function startAlgo() {
  const macroConfig: GeneticSearchConfig = {
    populationSize: 20,
    survivalRate: 0.5,
    crossoverRate: 0.5,
  };
  const runnerStrategyConfig: SimulationMetricsStrategyConfig<ClusterizationTaskConfig> = {
    worldConfig: configStore.worldConfig,
    checkpoints: [50, 50],
    repeats: 1,
    task: repeatRunSimulationForClustersGrade,
    onTaskResult: (metrics) => console.log('genome handled', metrics), // TODO TTaskConfig to input
  };
  const weightsConfig: ClusterizationWeightsConfig = createDefaultClusterizationWeightsConfig();
  const populateRandomTypesConfigCollection = [configStore.randomTypesConfig];
  const mutationRandomTypesConfigCollection = [configStore.randomTypesConfig];
  const mutationStrategyConfig: DynamicProbabilityMutationStrategyConfig = {
    probabilities: [0.01, 0.03, 0.05, 0.1, 0.2, 0.3, 0.5],
  }

  const strategyConfig: GeneticSearchStrategyConfig<SimulationGenome> = {
    populate: new RandomPopulateStrategy(populateRandomTypesConfigCollection),
    metrics: new ClusterizationMetricsStrategy(runnerStrategyConfig, weightsConfig),
    fitness: new ClusterizationFitnessStrategy(),
    mutation: new DynamicProbabilityMutationStrategy(mutationStrategyConfig, mutationRandomTypesConfigCollection),
    crossover: new ClassicCrossoverStrategy(),
    cache: new WeightedAgeAverageMetricsCache(0.5),
  };

  const algo = new GeneticSearch<SimulationGenome>(macroConfig, strategyConfig);
  const scheduler = new Scheduler({
    runner: algo,
    maxHistoryLength: 10,
    config: {},
    rules: [],
  });

  const fitConfig: GeneticSearchFitConfig = {
    scheduler,
    afterStep: (generation) => {
      const bestGenome = algo.bestGenome;
      const bestScore = bestGenome.stats!.fitness;
      const summary = algo.getPopulationSummary(3);
      console.log(`Generation ${generation}`, bestScore, bestGenome, summary);
    },
  }

  algo.fit(fitConfig);
}

</script>

<template>
  <button class="btn btn-primary" @click="startAlgo">
    Start
  </button>
</template>

<style scoped lang="scss">

@import "../../assets/config-editor.scss";

</style>
