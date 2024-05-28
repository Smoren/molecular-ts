import os from 'os';
import { ArgsParser } from "@/scripts/lib/router";
import type { GeneticSearchByTypesConfigFactoryConfig } from "@/lib/types/genetic";
import { getAbsoluteLossesSummary, getNormalizedLossesSummary } from "@/scripts/lib/genetic/helpers";
import {
  getRandomizeConfig,
  getTypesConfig,
  getSummaryRowObject,
  getWeights,
  getWorldConfig,
  getGeneticMainConfig,
  writeJsonFile,
} from "@/scripts/lib/genetic/io";
import { createGeneticSearchByTypesConfig } from "@/lib/genetic/factories";

export const actionGeneticSearchByTypesConfig = async (...args: string[]) => {
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
    } = argsMap;
    console.log(`[START] genetic search action (process_id = ${runId})`);
    console.log('[INPUT PARAMS]', argsMap);

    const mainConfig = getGeneticMainConfig(geneticMainConfigFileName, poolSize);
    const config: GeneticSearchByTypesConfigFactoryConfig = {
      geneticSearchMacroConfig: mainConfig.macro,
      runnerStrategyConfig: mainConfig.runner,
      mutationStrategyConfig: mainConfig.mutation,
      populateRandomizeConfig: getRandomizeConfig(populateRandomizeConfigFileName),
      mutationRandomizeConfig: getRandomizeConfig(mutationRandomizeConfigFileName),
      crossoverRandomizeConfig: getRandomizeConfig(crossoverRandomizeConfigFileName),
      referenceTypesConfig: getTypesConfig(referenceConfigFileName),
      referenceSummaryRowObject: getSummaryRowObject(referenceSummaryFileName),
      weights: getWeights(weightsFileName),
      worldConfig: getWorldConfig(worldConfigFileName, mainConfig.initial),
    };

    console.log('[START] Building genetic search');
    const geneticSearch = createGeneticSearchByTypesConfig(config);
    console.log('[FINISH] Genetic search built');

    console.log('[START] Running genetic search');
    let bestId: number = 0;

    await geneticSearch.run(generationsCount, (i, [normalizedLosses, absoluteLosses]) => {
      const [normMinLoss, normMeanLoss, normMedianLoss, normMaxLoss] = getNormalizedLossesSummary(normalizedLosses);
      const [absMinLoss, absMeanLoss] = getAbsoluteLossesSummary(absoluteLosses);

      const bestGenome = geneticSearch.getBestGenome();
      console.log(`[GENERATION ${i+1}] best id=${bestGenome.id}`);
      console.log(`\tnormalized losses:\tmin=${normMinLoss}\tmean=${normMeanLoss}\tmedian=${normMedianLoss}\tmax=${normMaxLoss}`);
      // console.log(`\tBest absolute losses:\t[${absoluteLosses.slice(0, 5).map((x) => round(x, 2)).join(', ')}]`);
      // console.log(`\tBest normalized losses:\t[${normalizedLosses.slice(0, 5).map((x) => round(x, 2)).join(', ')}]`);

      if (bestGenome.id > bestId) {
        bestId = bestGenome.id;
        writeJsonFile(`data/output/${runId}_generation_${i+1}_id_${bestId}.json`, geneticSearch.getBestGenome());
      }
    });
  } catch (e) {
    console.error('[ERROR]', (e as Error).message);
  }

  console.log(`[FINISH] in ${Date.now() - ts} ms`);
}

function parseArgs(argsParser: ArgsParser) {
  const poolSize = argsParser.getInt('poolSize', os.cpus().length);
  const generationsCount = argsParser.getInt('generationsCount', 100);

  const geneticMainConfigFileName = argsParser.getString('mainConfigFileName', 'default-genetic-main-config');

  const referenceConfigFileName = argsParser.getString('referenceConfigFileName', 'default-genetic-reference-config');
  const referenceSummaryFileName = argsParser.get('referenceSummaryFileName', undefined);
  const weightsFileName = argsParser.getString('weightsFileName', 'default-genetic-weights');

  const randomizeConfigFileName = argsParser.getString('randomizeConfigFileName', 'default-genetic-randomize-config');
  const populateRandomizeConfigFileName = argsParser.getString('populateRandomizeConfigFileName', randomizeConfigFileName);
  const mutationRandomizeConfigFileName = argsParser.getString('mutationRandomizeConfigFileName', randomizeConfigFileName);
  const crossoverRandomizeConfigFileName = argsParser.getString('crossoverRandomizeConfigFileName', randomizeConfigFileName);

  const worldConfigFileName = argsParser.getString('worldConfigFileName', 'default-genetic-world-config');

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
  };
}
