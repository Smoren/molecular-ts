import os from "os";
import type { RandomTypesConfig, TypesConfig, WorldConfig } from "@/lib/types/config";
import {
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
  createZeroWeights, repeatTestSimulation,
  testSimulation,
} from "@/lib/analysis/helpers";
import type { TotalSummaryWeights } from "@/lib/types/analysis";
import { arraySum, round } from "@/lib/math";

export const actionGeneticSearch = async (...args: string[]) => {
  console.log('[START] genetic search action', args);
  const ts = Date.now();

  const generationCount = 30;
  const checkpoints = [200, 100, 20, 20, 15, 15, 10, 10, 5, 5];
  const repeats = 5;
  const strategyConfig: StrategyConfig = {
    // runner: new SimpleRunnerStrategy(),
    runner: new MultiprocessingRunnerStrategy(os.cpus().length),
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
    populationSize: 10,
    survivalRate: 0.5,
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

  for (let i=0; i<generationCount; i++) {
    const losses = await geneticSearch.runGenerationStep();
    const minLoss = round(losses[0], 2);
    const medianLoss = round(losses[round(losses.length/2, 0)], 2);
    const meanLoss = round(losses.reduce((a, b) => a + b, 0) / losses.length, 2);
    const maxLoss = round(losses[losses.length-1], 2);
    const bestGenome = geneticSearch.getBestGenome();
    console.log(`[GENERATION ${i+1}] id=${bestGenome.id} losses: min=${minLoss}, median=${medianLoss}, mean=${meanLoss}, max=${maxLoss}`);
    // console.log('Best losses:', losses.slice(0, 5).map((x) => round(x, 2)).join(', '));
  }

  console.log(JSON.stringify(geneticSearch.getBestGenome(), null, 4));
  console.log(`[FINISH] in ${Date.now() - ts} ms`);
}

function getReferenceTypesConfig(): TypesConfig {
  return {
    "RADIUS": [1, 1, 1],
    "GRAVITY": [
      [-1.4, -1.6, -0.7],
      [-0.9, -1.9, -1.3],
      [-0.6, -1.3, -0.5]
    ],
    "LINK_GRAVITY": [
      [-0.4, 0, -2.5],
      [-2.3, 0, -5],
      [-0.6, -3.3, -3]
    ],
    "LINKS": [2, 2, 3],
    "TYPE_LINKS": [
      [3, 0, 2],
      [3, 0, 2],
      [1, 1, 1]
    ],
    "LINK_FACTOR_DISTANCE": [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1]
    ],
    "LINK_FACTOR_DISTANCE_EXTENDED": [
      [
        [1, 1, 1],
        [1, 1, 0.8],
        [1, 1, 1]
      ],
      [
        [0.7, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
      ],
      [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
      ]
    ],
    "LINK_FACTOR_DISTANCE_USE_EXTENDED": true,
    "FREQUENCIES": [1, 1, 1],
    "COLORS": [
      [250, 20, 20],
      [200, 140, 100],
      [80, 170, 140]
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

  const atomsCount = 100;
  const minPosition = [0, 0];
  const maxPosition = [450, 450];

  const initialConfig = {
    ATOMS_COUNT: atomsCount,
    MIN_POSITION: minPosition,
    MAX_POSITION: maxPosition,
  };

  return createWorldConfig2d(initialConfig);
}

function getWeights(): TotalSummaryWeights {
  return createTransparentWeights();
  // return {
  //   ...createZeroWeights(),
  //   ATOMS_MEAN_SPEED: 1,
  //   COMPOUND_LENGTH_SUMMARY: {
  //     size: 0,
  //     frequency: 0,
  //     min: 0,
  //     max: 0,
  //     mean: 0,
  //     median: 1,
  //   },
  // }
}
