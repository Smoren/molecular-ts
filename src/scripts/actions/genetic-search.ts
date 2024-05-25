import os from "os";
import {
  CachedMultiprocessingRunnerStrategy,
  GeneticSearch,
  ComposedCrossoverStrategy,
  MutationStrategy,
} from "@/lib/analysis/genetic";
import type { GeneticSearchConfig, StrategyConfig } from "@/lib/types/genetic";
import {
  convertWeightsToSummaryMatrixRow,
  repeatTestSimulation,
} from "@/lib/analysis/helpers";
import { getAbsoluteLossesSummary, getNormalizedLossesSummary } from "@/scripts/lib/genetic/helpers";
import {
  getRandomizeConfig,
  getReferenceTypesConfig,
  getWeights,
  getWorldConfig,
  writeJsonFile
} from "@/scripts/lib/genetic/io";
import { ArgsParser } from "@/scripts/lib/router";

export const actionGeneticSearch = async (...args: string[]) => {
  const ts = Date.now();
  const runId = Math.floor(Math.random()*1000);

  try {
    const argsParser = new ArgsParser(args);

    const argsMap = parseArgs(argsParser);
    const {
      initialConfigFileName,
      randomizeConfigFileName,
      referenceConfigFileName,
      weightsFileName,
    } = argsMap;
    console.log('[INPUT PARAMS]', argsMap);

    console.log(`[START] genetic search action (process_id = ${runId})`);

    const generationCount = 100;
    const checkpoints = [200, 1, 1, 1, 1, 1, 50, 1, 1, 1, 1, 1, 50, 1, 1, 1, 1, 1, 20, 1, 1, 1, 1, 1];
    const repeats = 3;
    const strategyConfig: StrategyConfig = {
      runner: new CachedMultiprocessingRunnerStrategy(os.cpus().length),
      mutation: new MutationStrategy(),
      crossover: new ComposedCrossoverStrategy(),
    };

    const worldConfig = getWorldConfig(initialConfigFileName);
    const typesConfig = getReferenceTypesConfig(referenceConfigFileName);
    const typesCount = typesConfig.FREQUENCIES.length;
    const randomTypesConfig = getRandomizeConfig(randomizeConfigFileName, typesCount);
    const weights = convertWeightsToSummaryMatrixRow(getWeights(weightsFileName), typesCount);

    console.log('[START] Calculating reference matrix');

    const reference = repeatTestSimulation(worldConfig, typesConfig, checkpoints, repeats);
    const geneticConfig: GeneticSearchConfig = {
      populationSize: 100,
      survivalRate: 0.3,
      crossoverRate: 0.5,
      mutationProbability: 0.02,
      reference,
      weights,
      worldConfig,
      randomTypesConfig,
      checkpoints,
      repeats,
    };
    console.log('[FINISH] Calculating reference matrix');

    console.log('[START] Running genetic search');
    const geneticSearch = new GeneticSearch(geneticConfig, strategyConfig);
    let bestId: number = 0;

    for (let i=0; i<generationCount; i++) {
      const [normalizedLosses, absoluteLosses] = await geneticSearch.runGenerationStep();

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
    }
  } catch (e) {
    console.error('[ERROR]', (e as Error).message);
  }

  console.log(`[FINISH] in ${Date.now() - ts} ms`);
}

function parseArgs(argsParser: ArgsParser) {
  const initialConfigFileName = argsParser.getString('initialConfigFileName', 'default-genetic-initial-config');
  const randomizeConfigFileName = argsParser.getString('randomizeConfigFileName', 'default-genetic-randomize-config');
  const referenceConfigFileName = argsParser.getString('referenceConfigFileName', 'default-genetic-reference-config');
  const weightsFileName = argsParser.getString('weightsFileName', 'default-genetic-weights');

  return {
    initialConfigFileName,
    randomizeConfigFileName,
    referenceConfigFileName,
    weightsFileName,
  };
}
