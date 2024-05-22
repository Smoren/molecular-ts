import os from "os";
import type { RandomTypesConfig, TypesConfig, WorldConfig } from "@/lib/types/config";
import {
  GeneticSearch,
  MultiprocessingRunnerStrategy,
  MutationStrategy,
  SubMatrixCrossoverStrategy,
} from "@/lib/analysis/genetic";
import { createWorldConfig2d } from "@/lib/config/world";
import { createWideRandomTypesConfig } from "@/lib/config/types";
import type { GeneticSearchConfig, StrategyConfig } from "@/lib/types/genetic";
import { convertWeightsToSummaryMatrixRow, createTransparentWeights, testSimulation } from "@/lib/analysis/helpers";
import type { TotalSummaryWeights } from "@/lib/types/analysis";
import { round } from "@/lib/math";

export const actionGeneticSearch = async (...args: string[]) => {
  console.log('[START] genetic search action', args);
  const ts = Date.now();

  const generationCount = 30;
  const simulationStepsCount = [200, 100, 20, 20, 15, 15, 10, 10, 5, 5];
  const strategyConfig: StrategyConfig = {
    runner: new MultiprocessingRunnerStrategy(os.cpus().length),
    mutation: new MutationStrategy(),
    crossover: new SubMatrixCrossoverStrategy(),
  };

  const worldConfig = getWorldConfig();
  const typesConfig = getReferenceTypesConfig();
  const typesCount = typesConfig.FREQUENCIES.length;
  const randomTypesConfig = getRandomizeConfig(typesCount);
  const weights = convertWeightsToSummaryMatrixRow(getWeights(), typesCount);

  console.log('[START] Calculating reference matrix');
  const reference = testSimulation(worldConfig, typesConfig, simulationStepsCount);
  const geneticConfig: GeneticSearchConfig = {
    populationSize: 200,
    survivalRate: 0.5,
    crossoverRate: 0.5,
    mutationProbability: 0.1,
    reference,
    weights,
    worldConfig,
    randomTypesConfig,
    simulationStepsCount,
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
    console.log(`[GENERATION ${i+1}] losses: min=${minLoss}, median=${medianLoss}, mean=${meanLoss}, max=${maxLoss}`);
  }

  console.log(JSON.stringify(geneticSearch.getBestGenome(), null, 4));
  console.log(`[FINISH] in ${Date.now() - ts} ms`);
}

function getReferenceTypesConfig(): TypesConfig {
  return {
    "RADIUS": [1, 1, 1, 1, 1, 1],
    "GRAVITY": [
      [0, -4.9, -0.9, -0.6, -0.8, -4.6],
      [-4.9, 0.8, -3.3, -0.6, -0.7, -0.2],
      [-0.8, -0.7, -0.9, -2.9, -0.4, -1.6],
      [-0.2, -1, -2.9, -0.9, -3.5, 0],
      [-0.8, -4.9, -0.5, -3.7, 0.5, -3],
      [-3, -2.4, -0.1, -0.7, -3, -1.1]
    ],
    "LINK_GRAVITY": [
      [0.3, 0.9, -4.8, -0.6, -0.1, -4.7],
      [0.9, -11.5, -0.6, -0.1, -0.5, -3.6],
      [-1, -0.8, -13.7, -5.7, -4.9, -1.7],
      [0, -2.9, -5.7, 0.9, -2.8, -0.4],
      [-4.4, -0.7, -4.1, -2.3, 0.1, -1.9],
      [-1, 0, -0.1, -1.6, 1, -4]
    ],
    "LINKS": [3, 2, 3, 1, 4, 2],
    "TYPE_LINKS": [
      [2, 3, 2, 2, 1, 1],
      [3, 4, 0, 2, 2, 1],
      [1, 0, 2, 2, 1, 1],
      [1, 1, 2, 2, 1, 1],
      [1, 1, 1, 0, 3, 1],
      [2, 1, 1, 1, 1, 0]
    ],
    "LINK_FACTOR_DISTANCE": [
      [1, 1, 1, 1.1, 1.1, 0.6],
      [1.1, 1, 1.2, 0.5, 1.1, 1.1],
      [1, 1.2, 1, 1, 0.8, 1],
      [1.1, 0.5, 1.1, 1, 1, 1],
      [1.1, 1.1, 0.8, 1, 1, 1],
      [0.6, 1.1, 1, 1, 1.1, 1]
    ],
    "LINK_FACTOR_DISTANCE_EXTENDED": [
      [
        [1, 1.2, 0.8, 0.3, 0.8, 1],
        [1.2, 0.6, 0.3, 1.2, 1, 1],
        [0.8, 0.3, 0.3, 1.2, 1.2, 1.2],
        [0.3, 1.2, 1.2, 1.2, 1.1, 0.5],
        [0.8, 1, 1.2, 1.1, 1.1, 1.1],
        [1, 1, 1.2, 0.5, 1.1, 1.2]
      ],
      [
        [1.1, 1, 0.4, 1.1, 1.2, 1.1],
        [1, 1, 0.4, 1.2, 0.5, 1.1],
        [0.4, 0.4, 0.6, 1.2, 1.1, 1.1],
        [1.1, 1.2, 1.2, 1.1, 0.3, 0.9],
        [1.2, 0.5, 1.1, 0.3, 1.1, 1.1],
        [1.1, 1.1, 1.1, 0.9, 1.1, 0.4]
      ],
      [
        [0.5, 0.3, 1, 0.6, 0.8, 0.6],
        [0.3, 1.1, 1, 1.1, 1, 1.1],
        [1, 1, 1, 1.2, 0.9, 1],
        [0.6, 1.1, 1.2, 0.6, 1, 1.1],
        [0.8, 1, 0.9, 1, 1.1, 1.1],
        [0.6, 1.1, 1, 1.1, 1.1, 0.5]
      ],
      [
        [0.3, 1.2, 1.1, 0.9, 0.5, 1],
        [1.2, 1.1, 0.7, 0.6, 1, 0.6],
        [1.1, 0.7, 1.1, 1, 1.1, 0.7],
        [0.9, 0.6, 1, 1, 0.8, 1.1],
        [0.5, 1, 1.1, 0.8, 0.7, 1.1],
        [1, 0.6, 0.7, 1.1, 1.1, 1.2]
      ],
      [
        [1.2, 1.2, 1, 1.1, 1.1, 1.2],
        [1.2, 1, 1.1, 0.4, 1.1, 0.3],
        [1, 1.1, 0.5, 0.4, 1, 0.3],
        [1.1, 0.4, 0.4, 1.2, 1.1, 1],
        [1.1, 1.1, 1, 1.1, 1, 1.2],
        [1.2, 0.3, 0.3, 1, 1.2, 0.6]
      ],
      [
        [1.1, 1.2, 0.7, 1.1, 1.1, 1.2],
        [1.2, 0.9, 0.4, 1.2, 0.9, 0.7],
        [0.7, 0.4, 0.6, 0.9, 1.2, 1.1],
        [1.1, 1.2, 0.9, 0.5, 1.1, 1],
        [1.1, 0.9, 1.2, 1.1, 1.1, 1],
        [1.2, 0.7, 1.1, 1, 1, 1]
      ]
    ],
    "LINK_FACTOR_DISTANCE_USE_EXTENDED": true,
    "FREQUENCIES": [1, 1, 1, 1, 1, 1],
    "COLORS": [
      [250, 20, 20],
      [200, 140, 100],
      [80, 170, 140],
      [180, 180, 80],
      [70, 120, 250],
      [250, 100, 250]
    ]
  };
}

function getRandomizeConfig(typesCount: number): RandomTypesConfig {
  return createWideRandomTypesConfig(typesCount);
}

function getWorldConfig(): WorldConfig {
  const atomsCount = 1000;
  const minPosition = [0, 0];
  const maxPosition = [1500, 1500];

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
