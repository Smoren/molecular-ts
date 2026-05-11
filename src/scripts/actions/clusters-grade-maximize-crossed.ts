import os from 'os';
import { type GeneticSearchFitConfig, IdGenerator } from "genetic-search";
import { ArgsParser } from "@/scripts/lib/router";
import type {
  CrossedSubmatricesClusterGradeMaximizeConfigFactoryConfig,
} from "@/lib/genetic/clusters-grade-maximize/types";
import { modifyMacroConfig, printGenerationSummary } from "@/scripts/lib/genetic/helpers";
import {
  getWorldConfig,
  getGeneticMainConfig,
  writeJsonFile,
  getClusterizationConfig,
  getTransformationConfig,
  getRandomizeConfigCollection,
  getPopulation,
  getCache,
  getCacheOutputFilePath,
  getGenerationResultFilePath,
  getPopulationOutputFilePath,
  sendStateToServer,
  sendGenomeToServer, getSourcePopulation,
} from "@/scripts/lib/genetic/io";
import {
  createCrossedSubmatricesClusterGradeMaximize,
} from "@/lib/genetic/clusters-grade-maximize/search";
import { clusterizationGradeMultiprocessingTask } from "@/lib/genetic/clusters-grade-maximize/multiprocessing";
import { StdoutInterceptor } from "@/scripts/lib/stdout";
import { formatRoundedRecursive, getCurrentDateTime } from '@/scripts/lib/helpers';
import type { RemoteApiConfig } from "@/scripts/lib/genetic/types";
import { createSchedulerForClustersGradeMaximize } from "@/lib/genetic/clusters-grade-maximize/scheduler";
import type { SelectionStrategyFactoryConfig, SelectionStrategyType, SimulationGenome } from "@/lib/genetic/types";

export const actionClustersGradeMaximizeCrossed = async (...args: string[]) => {
  const ts = Date.now();
  const runId = Math.floor(Math.random()*1000);
  const dateTimeString = getCurrentDateTime();

  try {
    const argsParser = new ArgsParser(args);
    const argsMap = parseArgs(argsParser);
    const {
      poolSize,
      submatrixSeparator,
      generationsCount,
      startPopulationSize,
      populationSize,
      survivalRate,
      crossoverRate,
      mainConfigFileName,
      sourceFileName,
      populateRandomizeConfigCollectionFileName,
      mutationRandomizeConfigCollectionFileName,
      crossoverRandomizeConfigCollectionFileName,
      selectionStrategyType,
      useTransformations,
      transformationConfigFileName,
      randomizeStartPopulation,
      worldConfigFileName,
      configFileName,
      populationFileName,
      cacheFileName,
      useCache,
      useScheduler,
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
    modifyMacroConfig(mainConfig.macro, populationSize, startPopulationSize, survivalRate, crossoverRate);

    const idGenerator = new IdGenerator<SimulationGenome>();
    const sourcePopulation = getSourcePopulation(sourceFileName, idGenerator);
    const typesCollection = sourcePopulation.map((source) => source.typesConfig);

    const selectionStrategyFactoryConfig: SelectionStrategyFactoryConfig = {
      type: selectionStrategyType,
    }

    const config: CrossedSubmatricesClusterGradeMaximizeConfigFactoryConfig = {
      geneticSearchMacroConfig: mainConfig.macro,
      phenomeStrategyConfig: mainConfig.phenome,
      mutationStrategyConfig: mainConfig.mutation,
      sourceConfigCollection: typesCollection,
      populateRandomizeConfigCollection: getRandomizeConfigCollection(populateRandomizeConfigCollectionFileName),
      mutationRandomizeConfigCollection: getRandomizeConfigCollection(mutationRandomizeConfigCollectionFileName),
      crossoverRandomizeConfigCollection: getRandomizeConfigCollection(crossoverRandomizeConfigCollectionFileName),
      worldConfig: getWorldConfig(worldConfigFileName, mainConfig.initial),
      clusterizationConfig: getClusterizationConfig(configFileName),
      transformationConfig: useTransformations ? getTransformationConfig(transformationConfigFileName) : {},
      selectionStrategyFactoryConfig,
      randomizeStartPopulation,
      useCache,
      genomeAgeWeight,
      submatrixSeparator,
    };

    const population = getPopulation(populationFileName);
    const cache = getCache(cacheFileName);

    console.log('[START] Building genetic search');
    const geneticSearch = createCrossedSubmatricesClusterGradeMaximize(config);
    const typesCount = config.sourceConfigCollection[0].FREQUENCIES.length;
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

        const summary = formatRoundedRecursive(geneticSearch.getPopulationSummary(), 6);

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
  const submatrixSeparator = argsParser.getInt('submatrixSeparator', 3);
  const generationsCount = argsParser.getNullableInt('generationsCount');
  const populationSize = argsParser.getNullableInt('populationSize');
  const startPopulationSize = argsParser.getNullableInt('startPopulationSize');
  const survivalRate = argsParser.getNullableFloat('survivalRate');
  const crossoverRate = argsParser.getNullableFloat('crossoverRate');

  const mainConfigFileName = argsParser.getString('mainConfigFileName', 'default-genetic-main-config');

  const sourceFileName = argsParser.getString('sourceFileName', 'default-crossed-source-genome-config');
  const populateRandomizeConfigCollectionFileName = argsParser.getString('populateRandomizeConfigCollectionFileName', 'default-randomize-config-populate-collection');
  const mutationRandomizeConfigCollectionFileName = argsParser.getString('mutationRandomizeConfigCollectionFileName', 'default-randomize-config-mutate-collection');
  const crossoverRandomizeConfigCollectionFileName = argsParser.getString('crossoverRandomizeConfigCollectionFileName', 'default-randomize-config-crossover-collection');
  const selectionStrategyType = argsParser.getString('selectionStrategyType', 'tournament') as SelectionStrategyType;

  const useTransformations = argsParser.getBool('useTransformations', false);
  const transformationConfigFileName = argsParser.getString('transformationConfigFileName', 'default-transformation-config');

  const randomizeStartPopulation = argsParser.getBool('randomizeStartPopulation', true);

  const worldConfigFileName = argsParser.getString('worldConfigFileName', 'default-world-config');
  const configFileName = argsParser.getString('configFileName', 'default-clusterization-polymerize-config');
  const populationFileName = argsParser.getNullableString('populationFileName');
  const cacheFileName = argsParser.getNullableString('cacheFileName');

  const useCache = argsParser.getBool('useCache', true);
  const useScheduler = argsParser.getBool('useScheduler', false);
  const genomeAgeWeight = useCache ? 0 : argsParser.getFloat('genomeAgeWeight', 0.5);

  const genomeMaxAge = useScheduler ? argsParser.getInt('genomeMaxAge', 10) : undefined;
  const useDropout = useScheduler ? argsParser.getBool('useDropout', true) : false;

  const useAnsiCursor = argsParser.getBool('useAnsiCursor', true);

  const remoteApiUrl = argsParser.getNullableString('remoteApiUrl');
  const remoteApiToken = argsParser.getNullableString('remoteApiToken');

  return {
    poolSize,
    submatrixSeparator,
    generationsCount,
    populationSize,
    startPopulationSize,
    survivalRate,
    crossoverRate,
    mainConfigFileName,
    sourceFileName,
    populateRandomizeConfigCollectionFileName,
    mutationRandomizeConfigCollectionFileName,
    crossoverRandomizeConfigCollectionFileName,
    selectionStrategyType,
    useTransformations,
    transformationConfigFileName,
    randomizeStartPopulation,
    worldConfigFileName,
    configFileName,
    populationFileName,
    cacheFileName,
    useCache,
    useScheduler,
    genomeAgeWeight,
    genomeMaxAge,
    useDropout,
    useAnsiCursor,
    remoteApiUrl,
    remoteApiToken,
  };
}
