import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
  GeneticSearch,
  type GeneticSearchConfig,
  type GeneticSearchFitConfig,
  type GeneticSearchInterface,
  type GeneticSearchStrategyConfig,
  type Scheduler,
} from "genetic-search";
import type {
  ClusterizationTaskConfig,
  ClusterizationWeightsConfig,
  DynamicProbabilityMutationStrategyConfig,
  SimulationGenome,
  SimulationMetricsStrategyConfig,
} from "@/lib/genetic/types";
import type { RandomTypesConfig, TypesConfig, WorldConfig } from "@/lib/config/types";
import { useConfigStore } from "@/web/store/config";
import { createDefaultClusterizationWeightsConfig } from "@/lib/analysis/utils";
import {
  ClassicCrossoverStrategy,
  ClusterizationFitnessStrategy,
  ClusterizationMetricsStrategy,
  DynamicProbabilityMutationStrategy,
  RandomPopulateStrategy,
} from "@/lib/genetic/strategies";
import { SimpleMetricsCache } from "genetic-search/src/cache";
import { fullCopyObject } from "@/lib/utils/functions";
import {
  createDefaultMutationProbabilities,
  createDefaultMutationRandomTypesConfigCollection,
  createDefaultPopulateRandomTypesConfigCollection,
} from "@/web/utils/genetic";
import { repeatRunSimulationForClustersGradeWithTimeout } from "@/lib/genetic/grade";

class StopException extends Error {}

export const useGeneticStore = defineStore("genetic", () => {
  const configStore = useConfigStore();

  const macroConfig = ref<GeneticSearchConfig>({
    populationSize: 30,
    survivalRate: 0.5,
    crossoverRate: 0.5,
  });
  const worldConfig = ref<WorldConfig>(fullCopyObject(configStore.worldConfig));
  const typesConfig = ref<TypesConfig>(fullCopyObject(configStore.typesConfig));
  const randomTypesConfig = ref<RandomTypesConfig>(fullCopyObject(configStore.randomTypesConfig));
  const weightsConfig = ref<ClusterizationWeightsConfig>(createDefaultClusterizationWeightsConfig());
  const mutationStrategyConfig = ref<DynamicProbabilityMutationStrategyConfig>({
    probabilities: createDefaultMutationProbabilities(),
  });

  const algo = ref<GeneticSearchInterface<SimulationGenome> | undefined>();
  const scheduler = ref<Scheduler<SimulationGenome, Record<string, unknown>> | undefined>();
  const isStopping = ref(false);

  const genomesHandled = ref(0);
  const progress = computed(() => macroConfig.value.populationSize
    ? (genomesHandled.value / macroConfig.value.populationSize * 100)
    : 0);

  const typesCount = computed(() => typesConfig.value.FREQUENCIES.length);
  const bestGenome = computed(() => algo.value?.bestGenome);
  const populationSummary = computed(() => algo.value?.getPopulationSummary(4));

  const populationStats = computed(() => (algo.value?.population ?? [])
    .filter((x) => x.stats !== undefined)
    .map((x) => x.stats!));

  const populationFitness = computed(() => populationStats.value
    .map((x) => x.fitness));

  const isRunning = computed(() => {
    return algo.value !== undefined;
  });

  const start = async () => {
    if (isRunning.value || isStopping.value) {
      return;
    }

    resetState();
    initConfigsFromStore();

    algo.value = createAlgo();

    try {
      await algo.value.fit(createFitConfig());
    } catch (e) {
      if (!(e instanceof StopException)) {
        throw e;
      }
    }
  };

  const stop = () => {
    isStopping.value = true;
  };

  const clear = () => {
    algo.value = undefined;
  };

  const resetState = () => {
    isStopping.value = false;
    genomesHandled.value = 0;
  };

  const initConfigsFromStore = () => {
    worldConfig.value = fullCopyObject(configStore.worldConfig);
    typesConfig.value = fullCopyObject(configStore.typesConfig);
    randomTypesConfig.value = fullCopyObject(configStore.randomTypesConfig);
  }

  const applyTypesConfig = () => {
    configStore.setTypesConfig(typesConfig.value);
  }

  const createPopulateRandomTypesConfigCollection = () => [
    fullCopyObject(configStore.randomTypesConfig),
    ...createDefaultPopulateRandomTypesConfigCollection(),
  ].map((x) => {
    x.TYPES_COUNT = typesCount.value;
    return x;
  });

  const createMutationRandomTypesConfigCollection = () => [
    fullCopyObject(configStore.randomTypesConfig),
    ...createDefaultMutationRandomTypesConfigCollection(),
  ].map((x) => {
    x.TYPES_COUNT = typesCount.value;
    return x;
  });

  const createMutationStrategyConfig = (): DynamicProbabilityMutationStrategyConfig => ({
    probabilities: createDefaultMutationProbabilities(),
  });

  const createMetricsStrategyConfig = (): SimulationMetricsStrategyConfig<ClusterizationTaskConfig> => ({
    worldConfig: worldConfig.value,
    checkpoints: [30, 30],
    repeats: 1,
    task: repeatRunSimulationForClustersGradeWithTimeout,
    onTaskResult: (metrics) => {
      console.log('genome handled', metrics);
      genomesHandled.value++;
      if (isStopping.value) {
        throw new StopException();
      }
    } // TODO TTaskConfig to input
  });

  const createStrategyConfig = (): GeneticSearchStrategyConfig<SimulationGenome> => ({
    populate: new RandomPopulateStrategy(createPopulateRandomTypesConfigCollection()),
    metrics: new ClusterizationMetricsStrategy(createMetricsStrategyConfig(), weightsConfig.value),
    fitness: new ClusterizationFitnessStrategy(),
    mutation: new DynamicProbabilityMutationStrategy(createMutationStrategyConfig(), createMutationRandomTypesConfigCollection()),
    crossover: new ClassicCrossoverStrategy(),
    cache: new SimpleMetricsCache(),
  });

  const createFitConfig = (): GeneticSearchFitConfig => ({
    afterStep: (generation) => {
      console.log('generation', generation);
    },
    stopCondition: () => isStopping.value,
    scheduler: scheduler.value,
  });

  const createAlgo = (): GeneticSearchInterface<SimulationGenome> => {
    return new GeneticSearch<SimulationGenome>(macroConfig.value, createStrategyConfig());
  };

  return {
    macroConfig,
    weightsConfig,
    mutationStrategyConfig,
    isRunning,
    isStopping,
    bestGenome,
    populationSummary,
    populationStats,
    populationFitness,
    genomesHandled,
    progress,
    start,
    stop,
    clear,
    applyTypesConfig,
  }
});
