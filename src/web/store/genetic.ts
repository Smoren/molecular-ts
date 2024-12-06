import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import type {
  GeneticSearchConfig,
  GeneticSearchFitConfig,
  GeneticSearchInterface,
  GeneticSearchStrategyConfig,
  Population,
} from "genetic-search";
import { SimpleMetricsCache } from "genetic-search";
import type {
  ClusterizationTaskConfig,
  ClusterizationWeightsConfig,
  DynamicProbabilityMutationStrategyConfig,
  SimulationGenome,
  SimulationMetricsStrategyConfig,
} from "@/lib/genetic/types";
import type { RandomTypesConfig, TypesConfig, WorldConfig } from "@/lib/config/types";
import {
  GeneticSearch,
  Scheduler,
  WeightedAgeAverageMetricsCache,
} from "genetic-search";
import { useConfigStore } from "@/web/store/config";
import { createDefaultClusterizationWeightsConfig } from "@/lib/analysis/utils";
import {
  ClassicCrossoverStrategy,
  ClusterizationFitnessStrategy,
  ClusterizationMetricsStrategy,
  DynamicProbabilityMutationStrategy,
  RandomPopulateStrategy,
} from "@/lib/genetic/strategies";
import { fullCopyObject } from "@/lib/utils/functions";
import {
  createDefaultMutationProbabilities,
  createDefaultMutationRandomTypesConfigCollection,
  createDefaultPopulateRandomTypesConfigCollection,
} from "@/web/utils/genetic";
import { repeatRunSimulationForClustersGradeWithTimeout } from "@/lib/genetic/grade";
import type { PopulationSummary } from "genetic-search/lib/types";

class StopException extends Error {}

export const useGeneticStore = defineStore("genetic", () => {
  const configStore = useConfigStore();

  const macroConfig = ref<GeneticSearchConfig>({
    populationSize: 30,
    survivalRate: 0.5,
    crossoverRate: 0.5,
  });
  const worldConfigRaw: WorldConfig = fullCopyObject(configStore.worldConfig);
  const typesConfigRaw: TypesConfig = fullCopyObject(configStore.typesConfig);
  const randomTypesConfigRaw: RandomTypesConfig = fullCopyObject(configStore.randomTypesConfig);
  const weightsConfigRaw: ClusterizationWeightsConfig = createDefaultClusterizationWeightsConfig();

  const worldConfig = ref<WorldConfig>(worldConfigRaw);
  const typesConfig = ref<TypesConfig>(typesConfigRaw);
  const randomTypesConfig = ref<RandomTypesConfig>(randomTypesConfigRaw);
  const weightsConfig = ref<ClusterizationWeightsConfig>(weightsConfigRaw);

  let algoRaw: GeneticSearchInterface<SimulationGenome> | undefined;
  let schedulerRaw: Scheduler<SimulationGenome, Record<string, unknown>>;

  const algo = ref<GeneticSearchInterface<SimulationGenome> | undefined>();

  const isStarted = ref(false);
  const isStopping = ref(false);
  const genomesHandled = ref(0);
  const typesCount = computed(() => typesConfig.value.FREQUENCIES.length);

  const bestGenome = ref<SimulationGenome | undefined>();
  const population = ref<Population<SimulationGenome> | undefined>();
  const populationSummary = ref<PopulationSummary | undefined>();

  const progress = computed(() => macroConfig.value.populationSize
    ? (genomesHandled.value / macroConfig.value.populationSize * 100)
    : 0);

  const populationStats = computed(() => (population.value ?? [])
    .filter((x) => x.stats !== undefined)
    .map((x) => x.stats!));

  const populationFitness = computed(() => populationStats.value
    .map((x) => x.fitness));

  const generation = computed(() => (algo.value?.generation ?? 1) - 1);

  const isRunning = computed(() => {
    return algo.value !== undefined && isStarted.value;
  });

  const start = async () => {
    if (isRunning.value || isStopping.value) {
      return;
    }

    algoRaw = createAlgo();

    beforeStart();

    try {
      await algoRaw.fit(createFitConfig());
    } catch (e) {
      if (!(e instanceof StopException)) {
        throw e;
      }
    } finally {
      afterStop();
    }
  };

  const stop = () => {
    isStopping.value = true;
  };

  const clear = () => {
    algoRaw = undefined;
  };

  const resetState = () => {
    isStarted.value = false;
    isStopping.value = false;
    genomesHandled.value = 0;
  };

  const beforeStart = () => {
    algoRaw!.population[0].typesConfig = fullCopyObject(configStore.typesConfig);
    algo.value = algoRaw;

    resetState();
    initConfigsFromStore();

    isStarted.value = true;
  };

  const afterStop = () => {
    resetState();
  }

  const initConfigsFromStore = () => {
    worldConfig.value = fullCopyObject(configStore.worldConfig);
    worldConfig.value.TEMPERATURE_FUNCTION = configStore.worldConfig.TEMPERATURE_FUNCTION ?? (() => 0);
    worldConfigRaw.TEMPERATURE_FUNCTION = configStore.worldConfig.TEMPERATURE_FUNCTION ?? (() => 0);
    typesConfig.value = fullCopyObject(configStore.typesConfig);
    randomTypesConfig.value = fullCopyObject(configStore.randomTypesConfig);
  }

  const applyBestGenome = () => {
    if (bestGenome.value === undefined) {
      throw new Error('Best genome is undefined');
    }
    configStore.setTypesConfig(bestGenome.value?.typesConfig);
  }

  const createPopulateRandomTypesConfigCollection = () => [
    fullCopyObject(randomTypesConfigRaw),
    ...createDefaultPopulateRandomTypesConfigCollection(),
  ].map((x) => {
    x.TYPES_COUNT = typesCount.value;
    return x;
  });

  const createMutationRandomTypesConfigCollection = () => [
    fullCopyObject(randomTypesConfigRaw),
    ...createDefaultMutationRandomTypesConfigCollection(),
  ].map((x) => {
    x.TYPES_COUNT = typesCount.value;
    return x;
  });

  const createMutationStrategyConfig = (): DynamicProbabilityMutationStrategyConfig => ({
    probabilities: createDefaultMutationProbabilities(),
  });

  let time = Date.now();

  const createMetricsStrategyConfig = (): SimulationMetricsStrategyConfig<ClusterizationTaskConfig> => ({
    worldConfig: worldConfigRaw,
    checkpoints: [30, 30],
    repeats: 1,
    task: repeatRunSimulationForClustersGradeWithTimeout,
    onTaskResult: (metrics) => {
      console.log('time spent', Date.now() - time);
      time = Date.now();

      console.log('genome handled', metrics);
      genomesHandled.value++;
      if (isStopping.value) {
        throw new StopException();
      }
    } // TODO TTaskConfig to input
  });

  const createStrategyConfig = (): GeneticSearchStrategyConfig<SimulationGenome> => ({
    populate: new RandomPopulateStrategy(createPopulateRandomTypesConfigCollection()),
    metrics: new ClusterizationMetricsStrategy(createMetricsStrategyConfig(), weightsConfigRaw),
    fitness: new ClusterizationFitnessStrategy(),
    mutation: new DynamicProbabilityMutationStrategy(createMutationStrategyConfig(), createMutationRandomTypesConfigCollection()),
    crossover: new ClassicCrossoverStrategy(),
    cache: new SimpleMetricsCache(),
    // cache: new WeightedAgeAverageMetricsCache(0.5),
  });

  const createFitConfig = (): GeneticSearchFitConfig => ({
    afterStep: (gen) => {
      console.log(`Generation ${gen}`, algoRaw?.bestGenome, algoRaw?.bestGenome.stats, algoRaw?.getPopulationSummary(4));
      bestGenome.value = algoRaw!.bestGenome;
      population.value = algoRaw!.population;
      populationSummary.value = algoRaw!.getPopulationSummary(4);
      genomesHandled.value = 0;

      if (!isStopping.value) {
        applyBestGenome();
      }
    },
    stopCondition: () => isStopping.value,
    scheduler: schedulerRaw,
  });

  const createAlgo = (): GeneticSearchInterface<SimulationGenome> => {
    return new GeneticSearch<SimulationGenome>(macroConfig.value, createStrategyConfig());
  };

  const setConfigRaw = <T, U extends Record<string, unknown>>(fromConfig: U, toConfig: U) => {
    const buf = fullCopyObject(fromConfig);
    for (const i in fromConfig) {
      (toConfig[i as keyof U] as T) = buf[i as keyof U] as T;
    }
  }

  const setWorldConfigRaw = (newConfig: WorldConfig) => {
    setConfigRaw(newConfig, worldConfigRaw);
    worldConfigRaw.TEMPERATURE_FUNCTION = worldConfigRaw.TEMPERATURE_FUNCTION ?? (() => 0);
  }

  watch(worldConfig, (newConfig: WorldConfig) => {
    setWorldConfigRaw(newConfig);
  }, { deep: true });

  watch(typesConfig, (newConfig: TypesConfig) => {
    setConfigRaw(newConfig, typesConfigRaw);
  }, { deep: true });

  watch(randomTypesConfig, (newConfig: RandomTypesConfig) => {
    setConfigRaw(newConfig, randomTypesConfigRaw);
  }, { deep: true });

  watch(weightsConfig, (newConfig: ClusterizationWeightsConfig) => {
    setConfigRaw(newConfig, weightsConfigRaw);
  }, { deep: true });

  return {
    macroConfig,
    weightsConfig,
    isRunning,
    isStopping,
    bestGenome,
    populationSummary,
    populationStats,
    populationFitness,
    generation,
    genomesHandled,
    progress,
    start,
    stop,
    clear,
  }
});
