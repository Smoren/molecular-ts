import os from 'os';
import { ArgsParser } from "@/scripts/lib/router";
import type { RandomSearchByTypesConfigFactoryConfig } from "@/lib/types/genetic";
import { getNormalizedLossesSummary } from "@/scripts/lib/genetic/helpers";
import {
  getGeneticMacroConfig,
  getRunnerStrategyConfig,
  getRandomizeConfig,
  getTypesConfig,
  getWeights,
  getWorldConfig,
  writeJsonFile,
} from "@/scripts/lib/genetic/io";
import { createRandomSearchByTypesConfig } from "@/lib/genetic/factories";

export const actionRandomSearchByTypesConfig = async (...args: string[]) => {
  const ts = Date.now();
  const runId = Math.floor(Math.random()*1000);

  try {
    const argsParser = new ArgsParser(args);
    const argsMap = parseArgs(argsParser);
    const {
      poolSize,
      generationsCount,
      geneticMacroConfigFileName,
      geneticRunnerConfigFileName,
      initialConfigFileName,
      populateRandomizeConfigFileName,
      mutationRandomizeConfigFileName,
      crossoverRandomizeConfigFileName,
      sourceConfigFileName,
      referenceConfigFileName,
      weightsFileName,
    } = argsMap;
    console.log('[INPUT PARAMS]', argsMap);
    console.log(`[START] random search action (process_id = ${runId})`);

    const config: RandomSearchByTypesConfigFactoryConfig = {
      geneticSearchMacroConfig: getGeneticMacroConfig(geneticMacroConfigFileName),
      runnerStrategyConfig: getRunnerStrategyConfig(geneticRunnerConfigFileName, poolSize),
      populateRandomizeConfig: getRandomizeConfig(populateRandomizeConfigFileName),
      mutationRandomizeConfig: getRandomizeConfig(mutationRandomizeConfigFileName),
      crossoverRandomizeConfig: getRandomizeConfig(crossoverRandomizeConfigFileName),
      sourceTypesConfig: getTypesConfig(sourceConfigFileName),
      referenceTypesConfig: getTypesConfig(referenceConfigFileName),
      weights: getWeights(weightsFileName),
      worldConfig: getWorldConfig(initialConfigFileName),
    };

    console.log('[START] Building genetic search');
    const geneticSearch = createRandomSearchByTypesConfig(config);
    console.log('[FINISH] Genetic search built');

    console.log('[START] Running genetic search');
    let bestId: number = 0;

    await geneticSearch.run(generationsCount, (i, [normalizedLosses]) => {
      const [normMinLoss, normMeanLoss, normMedianLoss, normMaxLoss] = getNormalizedLossesSummary(normalizedLosses);

      const bestGenome = geneticSearch.getBestGenome();
      console.log(`[GENERATION ${i+1}] best id=${bestGenome.id}`);
      console.log(`\tnormalized losses:\tmin=${normMinLoss}\tmean=${normMeanLoss}\tmedian=${normMedianLoss}\tmax=${normMaxLoss}`);

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

  const geneticMacroConfigFileName = argsParser.getString('macroConfigFileName', 'default-genetic-macro-config');
  const geneticRunnerConfigFileName = argsParser.getString('geneticRunnerConfigFileName', 'default-genetic-runner-config');

  const initialConfigFileName = argsParser.getString('initialConfigFileName', 'default-genetic-initial-config');
  const sourceConfigFileName = argsParser.getString('sourceConfigFileName', 'default-genetic-source-config');
  const referenceConfigFileName = argsParser.getString('referenceConfigFileName', 'default-genetic-reference-config');
  const weightsFileName = argsParser.getString('weightsFileName', 'default-genetic-weights');

  const randomizeConfigFileName = argsParser.getString('randomizeConfigFileName', 'default-genetic-randomize-config');
  const populateRandomizeConfigFileName = argsParser.getString('populateRandomizeConfigFileName', randomizeConfigFileName);
  const mutationRandomizeConfigFileName = argsParser.getString('mutationRandomizeConfigFileName', randomizeConfigFileName);
  const crossoverRandomizeConfigFileName = argsParser.getString('crossoverRandomizeConfigFileName', randomizeConfigFileName);

  return {
    poolSize,
    generationsCount,
    geneticMacroConfigFileName,
    geneticRunnerConfigFileName,
    initialConfigFileName,
    populateRandomizeConfigFileName,
    mutationRandomizeConfigFileName,
    crossoverRandomizeConfigFileName,
    sourceConfigFileName,
    referenceConfigFileName,
    weightsFileName,
  };
}
