import os from 'os';
import type { GeneticSearchFitConfig } from "genetic-search";
import { ArgsParser } from "@/scripts/lib/router";
import type { ClusterGradeMaximizeConfigFactoryConfig } from "@/lib/genetic/clusters-grade-maximize/types";
import { modifyMacroConfig, printGenerationSummary } from "@/scripts/lib/genetic/helpers";
import {
  getWorldConfig,
  getGeneticMainConfig,
  writeJsonFile,
  getClusterizationConfig,
  getRandomizeConfigCollection,
  getPopulation,
  getCache,
  getCacheOutputFilePath,
  getGenerationResultFilePath,
  getPopulationOutputFilePath,
  sendStateToServer,
  sendGenomeToServer,
} from "@/scripts/lib/genetic/io";
import { createClusterGradeMaximize } from "@/lib/genetic/clusters-grade-maximize/search";
import { clusterizationGradeMultiprocessingTask } from "@/lib/genetic/clusters-grade-maximize/multiprocessing";
import { StdoutInterceptor } from "@/scripts/lib/stdout";
import { getCurrentDateTime } from '@/scripts/lib/helpers';
import type { RemoteApiConfig } from "@/scripts/lib/genetic/types";
import { createSchedulerForClustersGradeMaximize } from "@/lib/genetic/clusters-grade-maximize/scheduler";
import type { SimulationGenome } from "@/lib/genetic/types";

export const actionClustersGradeMaximize = async (...args: string[]) => {
  const ts = Date.now();
  const runId = Math.floor(Math.random()*1000);
  const dateTimeString = getCurrentDateTime();

  try {
    const argsParser = new ArgsParser(args);
    const argsMap = parseArgs(argsParser);
    const {
      poolSize,
      typesCount,
      generationsCount,
      populationSize,
      survivalRate,
      crossoverRate,
      mainConfigFileName,
      populateRandomizeConfigCollectionFileName,
      mutationRandomizeConfigCollectionFileName,
      crossoverRandomizeConfigCollectionFileName,
      randomizeStartPopulation,
      worldConfigFileName,
      configFileName,
      populationFileName,
      cacheFileName,
      useCache,
      useScheduler,
      useComposedAlgo,
      composedFinalPopulation,
      genomeAgeWeight,
      genomeMaxAge,
      useDropout,
      useAnsiCursor,
      remoteApiUrl,
      remoteApiToken,
    } = argsMap;
    console.log(`[START] genetic search action (process_id = ${runId})`);
    console.log('[INPUT PARAMS]', argsMap);

    const apiConfig: RemoteApiConfig = {
      url: remoteApiUrl,
      token: remoteApiToken,
    };

    const mainConfig = getGeneticMainConfig(mainConfigFileName, poolSize, clusterizationGradeMultiprocessingTask);
    modifyMacroConfig(mainConfig.macro, populationSize, survivalRate, crossoverRate);

    const config: ClusterGradeMaximizeConfigFactoryConfig = {
      geneticSearchMacroConfig: mainConfig.macro,
      phenomeStrategyConfig: mainConfig.phenome,
      mutationStrategyConfig: mainConfig.mutation,
      populateRandomizeConfigCollection: getRandomizeConfigCollection(populateRandomizeConfigCollectionFileName),
      mutationRandomizeConfigCollection: getRandomizeConfigCollection(mutationRandomizeConfigCollectionFileName),
      crossoverRandomizeConfigCollection: getRandomizeConfigCollection(crossoverRandomizeConfigCollectionFileName),
      worldConfig: getWorldConfig(worldConfigFileName, mainConfig.initial),
      clusterizationConfig: getClusterizationConfig(configFileName),
      randomizeStartPopulation,
      typesCount,
      useCache,
      useComposedAlgo,
      composedFinalPopulation,
      genomeAgeWeight,
     };

    const population = getPopulation(populationFileName);
    const cache = getCache(cacheFileName);

    console.log('[START] Building genetic search');
    const geneticSearch = createClusterGradeMaximize(config);
    if (population) {
      geneticSearch.population = population;
    }
    if (cache) {
      geneticSearch.cache.import(cache);
    }
    console.log('[FINISH] Genetic search built');

    console.log('[START] Running genetic search');
    const foundGenomeIds: Set<number> = new Set();
    const scheduler = createSchedulerForClustersGradeMaximize({
      useScheduler,
      runner: geneticSearch,
      config: config.clusterizationConfig,
      maxAge: genomeMaxAge,
      useDropout,
    });
    const stdoutInterceptor = new StdoutInterceptor(useAnsiCursor);
    const formatString = (count: number) => `Genomes handled: ${count}`;

    const fitConfig: GeneticSearchFitConfig<SimulationGenome> = {
      generationsCount,
      scheduler,
      beforeStep: () => {
        writeJsonFile(getPopulationOutputFilePath(), geneticSearch.population);
        writeJsonFile(getCacheOutputFilePath(), geneticSearch.cache.export());
        sendStateToServer(apiConfig, {
          typesCount,
          runId,
          dateTime: dateTimeString,
          population: geneticSearch.population,
          cache: geneticSearch.cache.export(),
        });
        stdoutInterceptor.startCountDots(formatString);
      },
      afterStep: (generation) => {
        stdoutInterceptor.finish();

        writeJsonFile(getPopulationOutputFilePath(), geneticSearch.population);
        writeJsonFile(getCacheOutputFilePath(), geneticSearch.cache.export());

        const bestGenome = geneticSearch.bestGenome;
        const bestScore = bestGenome.stats!.fitness;

        const summary = geneticSearch.getPopulationSummary(6);

        printGenerationSummary(generation, bestGenome, summary);
        scheduler.logs.forEach((line) => console.log(`[SCHEDULER] ${line}`));

        if (!foundGenomeIds.has(bestGenome.id)) {
          foundGenomeIds.add(bestGenome.id);
          writeJsonFile(
            getGenerationResultFilePath(runId, generation, bestGenome.id, bestScore, mainConfig.macro.populationSize),
            geneticSearch.bestGenome,
          );
          sendGenomeToServer(apiConfig, {
            typesCount,
            runId,
            dateTime: dateTimeString,
            generation,
            score: bestScore,
            genome: bestGenome,
          });
        }
      },
    };

    stdoutInterceptor.startCountDots(formatString);
    await geneticSearch.fit(fitConfig);
  } catch (e) {
    console.error('[ERROR]', (e as Error).message);
    console.error(e);
  }

  console.log(`[FINISH] in ${Date.now() - ts} ms`);
}

function parseArgs(argsParser: ArgsParser) {
  const poolSize = argsParser.getInt('poolSize', os.cpus().length);
  const typesCount = argsParser.getInt('typesCount', 3);
  const generationsCount = argsParser.getNullableInt('generationsCount');
  const populationSize = argsParser.getNullableInt('populationSize');
  const survivalRate = argsParser.getNullableFloat('survivalRate');
  const crossoverRate = argsParser.getNullableFloat('crossoverRate');

  const mainConfigFileName = argsParser.getString('mainConfigFileName', 'default-genetic-main-config');

  const populateRandomizeConfigCollectionFileName = argsParser.getString('populateRandomizeConfigCollectionFileName', 'default-randomize-config-populate-collection');
  const mutationRandomizeConfigCollectionFileName = argsParser.getString('mutationRandomizeConfigCollectionFileName', 'default-randomize-config-mutate-collection');
  const crossoverRandomizeConfigCollectionFileName = argsParser.getString('crossoverRandomizeConfigCollectionFileName', 'default-randomize-config-crossover-collection');

  const randomizeStartPopulation = argsParser.getBool('randomizeStartPopulation', true);

  const worldConfigFileName = argsParser.getString('worldConfigFileName', 'default-world-config');
  const configFileName = argsParser.getString('configFileName', 'default-clusterization-config');
  const populationFileName = argsParser.getNullableString('populationFileName');
  const cacheFileName = argsParser.getNullableString('cacheFileName');

  const useCache = argsParser.getBool('useCache', true);
  const useScheduler = argsParser.getBool('useScheduler', false);
  const useComposedAlgo = argsParser.getBool('useComposedAlgo', false);
  const composedFinalPopulation = useComposedAlgo ? argsParser.getInt('composedFinalPopulation', 5) : 0;
  const genomeAgeWeight = useCache ? 0 : argsParser.getFloat('genomeAgeWeight', 0.5);

  const genomeMaxAge = useScheduler ? argsParser.getInt('genomeMaxAge', 5) : undefined;
  const useDropout = useScheduler ? argsParser.getBool('useDropout', true) : false;

  const useAnsiCursor = argsParser.getBool('useAnsiCursor', true);

  const remoteApiUrl = argsParser.getNullableString('remoteApiUrl');
  const remoteApiToken = argsParser.getNullableString('remoteApiToken');

  return {
    poolSize,
    typesCount,
    generationsCount,
    populationSize,
    survivalRate,
    crossoverRate,
    mainConfigFileName,
    populateRandomizeConfigCollectionFileName,
    mutationRandomizeConfigCollectionFileName,
    crossoverRandomizeConfigCollectionFileName,
    randomizeStartPopulation,
    worldConfigFileName,
    configFileName,
    populationFileName,
    cacheFileName,
    useCache,
    useScheduler,
    useComposedAlgo,
    composedFinalPopulation,
    genomeAgeWeight,
    genomeMaxAge,
    useDropout,
    useAnsiCursor,
    remoteApiUrl,
    remoteApiToken,
  };
}
