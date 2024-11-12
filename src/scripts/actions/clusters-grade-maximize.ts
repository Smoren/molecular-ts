import os from 'os';
import type { GeneticSearchFitConfig } from "genetic-search";
import { ArgsParser } from "@/scripts/lib/router";
import type { ClusterGradeMaximizeConfigFactoryConfig } from "@/lib/types/genetic";
import { getScoresSummary } from "@/scripts/lib/genetic/helpers";
import {
  getWorldConfig,
  getGeneticMainConfig,
  writeJsonFile,
  getClusterizationWeights, getRandomizeConfigCollection, getPopulation,
} from "@/scripts/lib/genetic/io";
import { createClusterGradeMaximize } from "@/lib/genetic/factories";
import { clusterizationGradeMultiprocessingTask } from "@/lib/genetic/multiprocessing";
import { StdoutInterceptor } from "@/scripts/lib/stdout";
import {
  getCacheOutputFilePath,
  getGenerationResultFilePath,
  getPopulationOutputFilePath
} from '@/scripts/lib/helpers';

export const actionClustersGradeMaximize = async (...args: string[]) => {
  const ts = Date.now();
  const runId = Math.floor(Math.random()*1000);

  try {
    const argsParser = new ArgsParser(args);
    const argsMap = parseArgs(argsParser);
    const {
      poolSize,
      typesCount,
      generationsCount,
      mainConfigFileName,
      populateRandomizeConfigCollectionFileName,
      mutationRandomizeConfigCollectionFileName,
      crossoverRandomizeConfigCollectionFileName,
      worldConfigFileName,
      weightsFileName,
      populationFileName,
      useCache,
      useComposedAlgo,
      composedFinalPopulation,
      useAnsiCursor,
    } = argsMap;
    console.log(`[START] genetic search action (process_id = ${runId})`);
    console.log('[INPUT PARAMS]', argsMap);

    const mainConfig = getGeneticMainConfig(mainConfigFileName, poolSize, clusterizationGradeMultiprocessingTask);
    const config: ClusterGradeMaximizeConfigFactoryConfig = {
      geneticSearchMacroConfig: mainConfig.macro,
      runnerStrategyConfig: mainConfig.metrics,
      mutationStrategyConfig: mainConfig.mutation,
      populateRandomizeConfigCollection: getRandomizeConfigCollection(populateRandomizeConfigCollectionFileName),
      mutationRandomizeConfigCollection: getRandomizeConfigCollection(mutationRandomizeConfigCollectionFileName),
      crossoverRandomizeConfigCollection: getRandomizeConfigCollection(crossoverRandomizeConfigCollectionFileName),
      worldConfig: getWorldConfig(worldConfigFileName, mainConfig.initial),
      weightsConfig: getClusterizationWeights(weightsFileName),
      population: getPopulation(populationFileName),
      typesCount,
      useCache,
      useComposedAlgo,
      composedFinalPopulation,
    };

    console.log('[START] Building genetic search');
    const geneticSearch = createClusterGradeMaximize(config);
    console.log('[FINISH] Genetic search built');

    console.log('[START] Running genetic search');
    const foundGenomeIds: Set<number> = new Set();

    const stdoutInterceptor = new StdoutInterceptor(useAnsiCursor);
    const formatString = (count: number) => `Genomes handled: ${count}`;

    const fitConfig: GeneticSearchFitConfig = {
      generationsCount,
      beforeStep: () => {
        writeJsonFile(getPopulationOutputFilePath(), geneticSearch.population);
        writeJsonFile(getCacheOutputFilePath(), geneticSearch.cache.export());
        stdoutInterceptor.startCountDots(formatString);
      },
      afterStep: (i, scores) => {
        stdoutInterceptor.finish();

        const [bestScore, secondScore, meanScore, medianScore, worstScore] = getScoresSummary(scores);

        const bestGenome = geneticSearch.bestGenome;
        console.log(`\n[GENERATION ${i+1}] best id=${bestGenome.id}`);
        console.log(`\tscores:\tbest=${bestScore}\tsecond=${secondScore}\tmean=${meanScore}\tmedian=${medianScore}\tworst=${worstScore}`);

        if (!foundGenomeIds.has(bestGenome.id)) {
          foundGenomeIds.add(bestGenome.id);
          writeJsonFile(
            getGenerationResultFilePath(runId, i, bestGenome.id, bestScore, mainConfig.macro.populationSize),
            geneticSearch.bestGenome,
          );
        }
      },
    };

    stdoutInterceptor.startCountDots(formatString);
    await geneticSearch.fit(fitConfig);
  } catch (e) {
    console.error('[ERROR]', (e as Error).message);
  }

  console.log(`[FINISH] in ${Date.now() - ts} ms`);
}

function parseArgs(argsParser: ArgsParser) {
  const poolSize = argsParser.getInt('poolSize', os.cpus().length);
  const typesCount = argsParser.getInt('typesCount', 3);
  const generationsCount = argsParser.getInt('generationsCount', 100);

  const mainConfigFileName = argsParser.getString('mainConfigFileName', 'default-genetic-main-config');

  const populateRandomizeConfigCollectionFileName = argsParser.getString('populateRandomizeConfigCollectionFileName', 'default-randomize-config-populate-collection');
  const mutationRandomizeConfigCollectionFileName = argsParser.getString('mutationRandomizeConfigCollectionFileName', 'default-randomize-config-mutate-collection');
  const crossoverRandomizeConfigCollectionFileName = argsParser.getString('crossoverRandomizeConfigCollectionFileName', 'default-randomize-config-crossover-collection');

  const worldConfigFileName = argsParser.getString('worldConfigFileName', 'default-world-config');
  const weightsFileName = argsParser.getString('weightsFileName', 'default-clusterization-weights');
  const populationFileName = argsParser.getNullableString('populationFileName');

  const useCache = argsParser.getBool('useCache', true);
  const useComposedAlgo = argsParser.getBool('useComposedAlgo', false);
  const composedFinalPopulation = useComposedAlgo ? argsParser.getInt('composedFinalPopulation', 5) : 0;

  const useAnsiCursor = argsParser.getBool('useAnsiCursor', true);

  return {
    poolSize,
    typesCount,
    generationsCount,
    mainConfigFileName,
    populateRandomizeConfigCollectionFileName,
    mutationRandomizeConfigCollectionFileName,
    crossoverRandomizeConfigCollectionFileName,
    worldConfigFileName,
    weightsFileName,
    populationFileName,
    useCache,
    useComposedAlgo,
    composedFinalPopulation,
    useAnsiCursor,
  };
}
