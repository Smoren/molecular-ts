import os from "os";
import type { RandomTypesConfig, TypesConfig, WorldConfig } from "@/lib/types/config";
import {
  CachedMultiprocessingRunnerStrategy,
  GeneticSearch,
  MultiprocessingRunnerStrategy,
  MutationStrategy, RandomCrossoverStrategy, SimpleRunnerStrategy,
  SubMatrixCrossoverStrategy,
} from "@/lib/analysis/genetic";
import { createWorldConfig2d } from "@/lib/config/world";
import { createWideRandomTypesConfig } from "@/lib/config/types";
import type { GeneticSearchConfig, StrategyConfig } from "@/lib/types/genetic";
import {
  convertWeightsToSummaryMatrixRow,
  createTransparentWeights,
  createZeroWeights,
  repeatTestSimulation,
  testSimulation,
} from "@/lib/analysis/helpers";
import type { TotalSummaryWeights } from "@/lib/types/analysis";
import { arraySum, round } from "@/lib/math";
import * as fs from "node:fs";

export const actionGeneticSearch = async (...args: string[]) => {
  console.log('[START] genetic search action', args);
  const ts = Date.now();
  const runId = Math.floor(Math.random()*1000);

  const generationCount = 100;
  const checkpoints = [200, 1, 1, 1, 1, 1, 50, 1, 1, 1, 1, 1, 50, 1, 1, 1, 1, 1, 20, 1, 1, 1, 1, 1];
  const repeats = 1;
  const strategyConfig: StrategyConfig = {
    // runner: new MultiprocessingRunnerStrategy(os.cpus().length),
    runner: new CachedMultiprocessingRunnerStrategy(os.cpus().length / 2),
    mutation: new MutationStrategy(),
    crossover: new SubMatrixCrossoverStrategy(),
    // crossover: new RandomCrossoverStrategy(),
  };

  const worldConfig = getWorldConfig();
  const typesConfig = getReferenceTypesConfig();
  const typesCount = typesConfig.FREQUENCIES.length;
  const randomTypesConfig = getRandomizeConfig(typesCount);
  const weights = convertWeightsToSummaryMatrixRow(getWeights(), typesCount);

  console.log('[START] Calculating reference matrix');

  const reference = repeatTestSimulation(worldConfig, typesConfig, checkpoints, repeats);
  const geneticConfig: GeneticSearchConfig = {
    populationSize: 100,
    survivalRate: 0.3,
    crossoverRate: 0.5,
    mutationProbability: 0.1,
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
      fs.writeFile(
        `data/output/${runId}_generation_${i+1}_id_${bestId}.json`,
        formatJsonString(JSON.stringify(geneticSearch.getBestGenome(), null, 4)),
        () => null
      );
    }
  }

  // console.log(JSON.stringify(geneticSearch.getBestGenome(), null, 4));
  console.log(`[FINISH] in ${Date.now() - ts} ms`);
}

function getNormalizedLossesSummary(losses: number[]): [number, number, number, number] {
  const minLoss = round(losses[0], 2);
  const meanLoss = round(losses.reduce((a, b) => a + b, 0) / losses.length, 2);
  const medianLoss = round(losses[round(losses.length/2, 0)], 2);
  const maxLoss = round(losses[losses.length-1], 2);

  return [minLoss, meanLoss, medianLoss, maxLoss];
}

function getAbsoluteLossesSummary(losses: number[]): [number, number] {
  const minLoss = round(losses[0], 2);
  const meanLoss = round(losses.reduce((a, b) => a + b, 0) / losses.length, 2);

  return [minLoss, meanLoss];
}

function getReferenceTypesConfig(): TypesConfig {
  return {
    "RADIUS": [1, 1],
    "GRAVITY": [
      [0.1, -0.7],
      [-0.7, -2.4]
    ],
    "LINK_GRAVITY": [
      [-0.4, -6.3],
      [-6.3, -1.7]
    ],
    "LINKS": [5, 5],
    "TYPE_LINKS": [
      [2, 1],
      [1, 2]
    ],
    "LINK_FACTOR_DISTANCE": [
      [1, 1],
      [1, 1]
    ],
    "LINK_FACTOR_DISTANCE_EXTENDED": [
      [
        [1, 1],
        [1, 1]
      ],
      [
        [1, 1],
        [1, 1]
      ]
    ],
    "LINK_FACTOR_DISTANCE_USE_EXTENDED": true,
    "FREQUENCIES": [1, 1],
    "COLORS": [
      [250, 20, 20],
      [200, 140, 100]
    ]
  };
}

function getRandomizeConfig(typesCount: number): RandomTypesConfig {
  return createWideRandomTypesConfig(typesCount);
}

function getWorldConfig(): WorldConfig {
  // const atomsCount = 100;
  // const minPosition = [0, 0];
  // const maxPosition = [450, 450];

  const atomsCount = 300;
  const minPosition = [0, 0];
  const maxPosition = [800, 800];

  const initialConfig = {
    ATOMS_COUNT: atomsCount,
    MIN_POSITION: minPosition,
    MAX_POSITION: maxPosition,
  };

  return createWorldConfig2d(initialConfig);
}

function getWeights(): TotalSummaryWeights {
  return createTransparentWeights();
}

const formatJsonString = (jsonStr: string) => {
  const regex = /(\[)([\d\s.,-]+)(])/g;
  jsonStr = jsonStr.replace(regex, function(_, p1, p2, p3) {
    let numbersOnly = p2.replace(/\s+/g, ' ');
    return p1 + numbersOnly + p3;
  });
  jsonStr = jsonStr.replace(/\[ /g, '[');
  jsonStr = jsonStr.replace(/([0-9]) ]/g, '$1]');

  return jsonStr;
}
