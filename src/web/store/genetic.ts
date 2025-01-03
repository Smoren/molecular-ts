import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import type {
  GeneticSearchConfig,
  GeneticSearchFitConfig,
  GeneticSearchInterface,
  GeneticSearchStrategyConfig,
  Population,
  GenomeStats,
} from "genetic-search";
import type {
  ClusterizationTaskConfig,
  ClusterizationWeightsConfig,
  DynamicProbabilityMutationStrategyConfig,
  SimulationGenome,
  SimulationMetricsStrategyConfig,
} from "@/lib/genetic/types";
import type { InitialConfig, RandomTypesConfig, TypesConfig, WorldConfig } from "@/lib/config/types";
import {
  GeneticSearch,
  Scheduler,
  WeightedAgeAverageMetricsCache,
} from "genetic-search";
import { useConfigStore } from "@/web/store/config";
import { createModifiedClusterizationWeightsConfig } from "@/lib/analysis/utils";
import {
  ClassicCrossoverStrategy,
  ClusterizationFitnessStrategy,
  ClusterizationMetricsStrategy,
  DynamicProbabilityMutationStrategy,
  RandomPopulateStrategy,
} from "@/lib/genetic/strategies";
import { fullCopyObject } from "@/lib/utils/functions";
import {
  createDefaultMutationRandomTypesConfigCollection,
  createDefaultPopulateRandomTypesConfigCollection,
} from "@/web/utils/genetic";
import { repeatRunSimulationForClustersGradeWithTimeout } from "@/lib/genetic/grade";
import type { GenomeMetricsRow, PopulationSummary } from "genetic-search/src/types";

class StopException extends Error {}

export const useGeneticStore = defineStore("genetic", () => {
  const configStore = useConfigStore();

  const macroConfig = ref<GeneticSearchConfig>({
    populationSize: 50,
    survivalRate: 0.5,
    crossoverRate: 0.5,
  });
  const worldConfigRaw: WorldConfig = fullCopyObject(configStore.worldConfig);
  const typesConfigRaw: TypesConfig = fullCopyObject(configStore.typesConfig);
  const randomTypesConfigRaw: RandomTypesConfig = fullCopyObject(configStore.randomTypesConfig);
  const weightsConfigRaw: ClusterizationWeightsConfig = createModifiedClusterizationWeightsConfig();

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

  const generation = ref<number>(0);
  const bestGenome = ref<SimulationGenome | undefined>();
  const population = ref<Population<SimulationGenome> | undefined>();
  const populationSize = ref<number>(0);
  const populationSummary = ref<PopulationSummary | undefined>();
  const populationStats = ref<GenomeStats[]>([]);
  const statsHistory = ref<GenomeStats[]>([]);

  const progress = computed(() => macroConfig.value.populationSize
    ? (genomesHandled.value / populationSize.value * 100)
    : 0);

  const populationFitness = computed(() => populationStats.value
    .map((x) => x.fitness));

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
      await algoRaw!.fit(createFitConfig());
    } catch (e) {
      if (!(e instanceof StopException)) {
        throw e;
      }
    } finally {
      afterStep();
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
    generation.value = 0;
    genomesHandled.value = 0;
    statsHistory.value = [];
  };

  const beforeStart = () => {
    resetState();
    initConfigsFromStore();

    algoRaw = createAlgo();
    algo.value = algoRaw;

    algoRaw!.population[0].typesConfig = fullCopyObject(configStore.typesConfig);
    isStarted.value = true;

    console.log('init population', algoRaw!.population);
  };

  const afterStep = () => {
    resetState();
  }

  const onTaskResultHandler = (metrics: GenomeMetricsRow) => {
    console.log('time spent', Date.now() - time);
    time = Date.now();

    console.log('genome handled', metrics);
    genomesHandled.value++;
    if (isStopping.value) {
      throw new StopException();
    }
  };

  const beforeStepHandler = () => {
    populationSize.value = algoRaw!.population.length;
  };

  const afterStepHandler = (gen: number) => {
    console.log(`Generation ${gen}`, algoRaw?.bestGenome, algoRaw?.bestGenome.stats, algoRaw?.getPopulationSummary(4));
    console.log('population', algoRaw?.population);
    generation.value = gen;
    bestGenome.value = algoRaw!.bestGenome;
    population.value = algoRaw!.population;
    populationStats.value = algoRaw!.population.map((x) => x.stats!);
    populationSummary.value = algoRaw!.getPopulationSummary(4);
    statsHistory.value.push(bestGenome.value!.stats!);
    genomesHandled.value = 0;

    if (!isStopping.value) {
      applyBestGenome();
    }
  }

  const initConfigsFromStore = () => {
    worldConfig.value = fullCopyObject(configStore.worldConfig);
    worldConfig.value.CONFIG_2D.INITIAL = createDefaultInitialConfig();
    worldConfig.value.TEMPERATURE_FUNCTION = configStore.worldConfig.TEMPERATURE_FUNCTION ?? (() => 0);
    setWorldConfigRaw(worldConfig.value);

    typesConfig.value = fullCopyObject(configStore.typesConfig);
    setConfigRaw(typesConfig.value, typesConfigRaw);

    randomTypesConfig.value = fullCopyObject(configStore.randomTypesConfig);
    randomTypesConfig.value.TYPES_COUNT = typesCount.value;
    setConfigRaw(randomTypesConfig.value, randomTypesConfigRaw);

    console.log('typesCount', typesCount.value);
    console.log('typesConfig', typesConfig.value);
    console.log('randomTypesConfig', randomTypesConfig.value);
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
    checkpoints: [100, 100],
    repeats: 1,
    task: repeatRunSimulationForClustersGradeWithTimeout,
    onTaskResult: onTaskResultHandler, // TODO TTaskConfig to input
  });

  const createStrategyConfig = (): GeneticSearchStrategyConfig<SimulationGenome> => ({
    populate: new RandomPopulateStrategy(createPopulateRandomTypesConfigCollection()),
    metrics: new ClusterizationMetricsStrategy(createMetricsStrategyConfig(), weightsConfigRaw),
    fitness: new ClusterizationFitnessStrategy(),
    mutation: new DynamicProbabilityMutationStrategy(createMutationStrategyConfig(), createMutationRandomTypesConfigCollection()),
    crossover: new ClassicCrossoverStrategy(),
    cache: new WeightedAgeAverageMetricsCache(0.5),
  });

  const createFitConfig = (): GeneticSearchFitConfig => ({
    beforeStep: beforeStepHandler,
    afterStep: afterStepHandler,
    stopCondition: () => isStopping.value,
    scheduler: schedulerRaw,
  });

  const createAlgo = (): GeneticSearchInterface<SimulationGenome> => {
    return new GeneticSearch<SimulationGenome>(macroConfig.value, createStrategyConfig());
  };

  const createDefaultMutationProbabilities = (): number[] => {
    return [0.01, 0.03, 0.05, 0.1, 0.2, 0.3, 0.5];
  }

  const createDefaultInitialConfig = (): InitialConfig => {
    return {
      ATOMS_COUNT: 500,
      MIN_POSITION: [0, 0],
      MAX_POSITION: [1000, 1000],
    }
  }

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
    populationSize,
    populationSummary,
    populationStats,
    populationFitness,
    statsHistory,
    generation,
    genomesHandled,
    progress,
    start,
    stop,
    clear,
  }
});
