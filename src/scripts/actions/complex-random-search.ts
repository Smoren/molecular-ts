import os from 'os';
import type { GeneticSearchFitConfig } from "genetic-search";
import { ArgsParser } from "@/scripts/lib/router";
import type { SimulationRandomSearchByTypesConfigFactoryConfig } from "@/lib/types/genetic";
import { getNormalizedLossesSummary } from "@/scripts/lib/genetic/helpers";
import {
  getRandomizeConfig,
  getTypesConfig,
  getSummaryRowObject,
  getWeights,
  getWorldConfig,
  getGeneticMainConfig,
  writeJsonFile,
} from "@/scripts/lib/genetic/io";
import { createReferenceRandomSearchByTypesConfig } from "@/lib/genetic/factories";
import { simulationComplexGradeTaskMultiprocessing } from "@/lib/genetic/multiprocessing";

export const actionComplexRandomSearch = async (...args: string[]) => {
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
      sourceConfigFileName,
      referenceConfigFileName,
      referenceSummaryFileName,
      weightsFileName,
      worldConfigFileName,
      targetClustersScore,
    } = argsMap;
    console.log(`[START] random search action (process_id = ${runId})`);
    console.log('[INPUT PARAMS]', argsMap);

    const mainConfig = getGeneticMainConfig(geneticMainConfigFileName, poolSize, simulationComplexGradeTaskMultiprocessing);
    const config: SimulationRandomSearchByTypesConfigFactoryConfig = {
      geneticSearchMacroConfig: mainConfig.macro,
      runnerStrategyConfig: mainConfig.runner,
      mutationStrategyConfig: mainConfig.mutation,
      populateRandomizeConfig: getRandomizeConfig(populateRandomizeConfigFileName),
      mutationRandomizeConfig: getRandomizeConfig(mutationRandomizeConfigFileName),
      crossoverRandomizeConfig: getRandomizeConfig(crossoverRandomizeConfigFileName),
      sourceTypesConfig: getTypesConfig(sourceConfigFileName),
      referenceTypesConfig: getTypesConfig(referenceConfigFileName),
      referenceSummaryRowObject: getSummaryRowObject(referenceSummaryFileName),
      weights: getWeights(weightsFileName),
      worldConfig: getWorldConfig(worldConfigFileName, mainConfig.initial),
      targetClustersScore,
    };

    console.log('[START] Building genetic search');
    const geneticSearch = createReferenceRandomSearchByTypesConfig(config);
    console.log('[FINISH] Genetic search built');

    console.log('[START] Running genetic search');
    let bestId: number = 0;
    const foundGenomeIds: Set<number> = new Set();

    const fitConfig: GeneticSearchFitConfig = {
      generationsCount,
      afterStep: (i, scores) => {
        const [bestScore, meanScore, medianScore, worstScore] = getNormalizedLossesSummary(scores);

        const bestGenome = geneticSearch.bestGenome;
        console.log(`\n[GENERATION ${i+1}] best id=${bestGenome.id}`);
        console.log(`\tscores:\tbest=${bestScore}\tmean=${meanScore}\tmedian=${medianScore}\tworst=${worstScore}`);

        if (!foundGenomeIds.has(bestGenome.id)) {
          foundGenomeIds.add(bestGenome.id);
          bestId = bestGenome.id;
          writeJsonFile(`data/output/${runId}_generation_${i+1}_id_${bestId}.json`, geneticSearch.bestGenome);
        }
      },
    }

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

  const sourceConfigFileName = argsParser.getString('sourceConfigFileName', 'default-genetic-source-config');
  const referenceConfigFileName = argsParser.getString('referenceConfigFileName', 'default-genetic-reference-config');
  const referenceSummaryFileName = argsParser.get('referenceSummaryFileName', undefined);
  const weightsFileName = argsParser.getString('weightsFileName', 'default-genetic-weights');

  const randomizeConfigFileName = argsParser.getString('randomizeConfigFileName', 'default-genetic-randomize-config');
  const populateRandomizeConfigFileName = argsParser.getString('populateRandomizeConfigFileName', randomizeConfigFileName);
  const mutationRandomizeConfigFileName = argsParser.getString('mutationRandomizeConfigFileName', randomizeConfigFileName);
  const crossoverRandomizeConfigFileName = argsParser.getString('crossoverRandomizeConfigFileName', randomizeConfigFileName);

  const worldConfigFileName = argsParser.getString('worldConfigFileName', 'default-genetic-world-config');

  const targetClustersScore = argsParser.getNullableInt('targetClustersScore');

  return {
    poolSize,
    generationsCount,
    geneticMainConfigFileName,
    populateRandomizeConfigFileName,
    mutationRandomizeConfigFileName,
    crossoverRandomizeConfigFileName,
    sourceConfigFileName,
    referenceConfigFileName,
    referenceSummaryFileName,
    weightsFileName,
    worldConfigFileName,
    targetClustersScore,
  };
}
