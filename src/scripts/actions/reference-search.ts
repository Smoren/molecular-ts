import os from 'os';
import type { GeneticSearchFitConfig } from "genetic-search";
import { ArgsParser } from "@/scripts/lib/router";
import type { ReferenceSearchConfigFactoryConfig } from "@/lib/genetic/types";
import { getScoresSummary } from "@/scripts/lib/genetic/helpers";
import {
  getRandomizeConfig,
  getTypesConfig,
  getSummaryRowObject,
  getReferenceWeights,
  getWorldConfig,
  getGeneticMainConfig,
  writeJsonFile,
  getGenerationResultFilePath,
} from "@/scripts/lib/genetic/io";
import { createReferenceSearch } from "@/lib/genetic/factories";
import { referenceGradeMultiprocessingTask } from "@/lib/genetic/multiprocessing";
import { StdoutInterceptor } from "@/scripts/lib/stdout";

export const actionReferenceSearch = async (...args: string[]) => {
  const ts = Date.now();
  const runId = Math.floor(Math.random()*1000);

  try {
    const argsParser = new ArgsParser(args);
    const argsMap = parseArgs(argsParser);
    const {
      poolSize,
      generationsCount,
      geneticMainConfigFileName,
      populateRandomizeConfigFileName,
      mutationRandomizeConfigFileName,
      crossoverRandomizeConfigFileName,
      referenceConfigFileName,
      referenceSummaryFileName,
      weightsFileName,
      worldConfigFileName,
      targetClustersScore,
      useAnsiCursor,
    } = argsMap;
    console.log(`[START] genetic search action (process_id = ${runId})`);
    console.log('[INPUT PARAMS]', argsMap);

    const mainConfig = getGeneticMainConfig(geneticMainConfigFileName, poolSize, referenceGradeMultiprocessingTask);
    const config: ReferenceSearchConfigFactoryConfig = {
      geneticSearchMacroConfig: mainConfig.macro,
      metricsStrategyConfig: mainConfig.metrics,
      mutationStrategyConfig: mainConfig.mutation,
      populateRandomizeConfig: getRandomizeConfig(populateRandomizeConfigFileName),
      mutationRandomizeConfig: getRandomizeConfig(mutationRandomizeConfigFileName),
      crossoverRandomizeConfig: getRandomizeConfig(crossoverRandomizeConfigFileName),
      referenceTypesConfig: getTypesConfig(referenceConfigFileName),
      referenceSummaryRowObject: getSummaryRowObject(referenceSummaryFileName),
      weights: getReferenceWeights(weightsFileName),
      worldConfig: getWorldConfig(worldConfigFileName, mainConfig.initial),
      targetClustersScore,
    };

    console.log('[START] Building genetic search');
    const geneticSearch = createReferenceSearch(config);
    console.log('[FINISH] Genetic search built');

    console.log('[START] Running genetic search');
    const foundGenomeIds: Set<number> = new Set();

    const stdoutInterceptor = new StdoutInterceptor(useAnsiCursor);
    const formatString = (count: number) => `Genomes handled: ${count}`;

    // TODO before step
    const fitConfig: GeneticSearchFitConfig = {
      generationsCount,
      afterStep: (i, scores) => {
        stdoutInterceptor.finish();

        const [bestScore, secondScore, meanScore, medianScore, worstScore] = getScoresSummary(scores);

        const bestGenome = geneticSearch.bestGenome;
        console.log(`\n[GENERATION ${i}] best id=${bestGenome.id}`);
        console.log(`\tscores:\tbest=${bestScore}\tsecond=${secondScore}\tmean=${meanScore}\tmedian=${medianScore}\tworst=${worstScore}`);

        if (!foundGenomeIds.has(bestGenome.id)) {
          foundGenomeIds.add(bestGenome.id);
          writeJsonFile(
            getGenerationResultFilePath(runId, i, bestGenome.id, bestScore, mainConfig.macro.populationSize),
            geneticSearch.bestGenome,
          );
        }
        stdoutInterceptor.startCountDots(formatString);
      },
    }

    stdoutInterceptor.startCountDots(formatString);
    await geneticSearch.fit(fitConfig);
  } catch (e) {
    console.error('[ERROR]', (e as Error).message);
  }

  console.log(`[FINISH] in ${Date.now() - ts} ms`);
}

function parseArgs(argsParser: ArgsParser) {
  const poolSize = argsParser.getInt('poolSize', os.cpus().length);
  const generationsCount = argsParser.getInt('generationsCount', 100);

  const geneticMainConfigFileName = argsParser.getString('mainConfigFileName', 'default-genetic-main-config');

  const referenceConfigFileName = argsParser.getString('referenceConfigFileName', 'default-reference-types-config');
  const referenceSummaryFileName = argsParser.get('referenceSummaryFileName', undefined);
  const weightsFileName = argsParser.getString('weightsFileName', 'default-reference-weights');

  const randomizeConfigFileName = argsParser.getString('randomizeConfigFileName', 'default-randomize-config');
  const populateRandomizeConfigFileName = argsParser.getString('populateRandomizeConfigFileName', randomizeConfigFileName);
  const mutationRandomizeConfigFileName = argsParser.getString('mutationRandomizeConfigFileName', randomizeConfigFileName);
  const crossoverRandomizeConfigFileName = argsParser.getString('crossoverRandomizeConfigFileName', randomizeConfigFileName);

  const worldConfigFileName = argsParser.getString('worldConfigFileName', 'default-world-config');

  const targetClustersScore = argsParser.getInt('targetClustersScore', 1000000);
  const useAnsiCursor = argsParser.getBool('useAnsiCursor', true);

  return {
    poolSize,
    generationsCount,
    geneticMainConfigFileName,
    populateRandomizeConfigFileName,
    mutationRandomizeConfigFileName,
    crossoverRandomizeConfigFileName,
    referenceConfigFileName,
    referenceSummaryFileName,
    weightsFileName,
    worldConfigFileName,
    targetClustersScore,
    useAnsiCursor,
  };
}
