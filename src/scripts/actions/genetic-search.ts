import os from "os";
import type { RandomTypesConfig, TypesConfig, WorldConfig } from "@/lib/types/config";
import {
  GeneticSearch,
  MultiprocessingRunnerStrategy,
  MutationStrategy,
  SubMatrixCrossoverStrategy,
} from "@/lib/analysis/genetic";
import { createWorldConfig2d } from "@/lib/config/world";
import { createDefaultRandomTypesConfig } from "@/lib/config/types";
import type { GeneticSearchConfig, StrategyConfig } from "@/lib/types/genetic";
import { convertWeightsToSummaryMatrixRow, createTransparentWeights, testSimulation } from "@/lib/analysis/helpers";
import type { TotalSummaryWeights } from "@/lib/types/analysis";

export const actionGeneticSearch = async (...args: string[]) => {
  console.log('[START] genetic search action', args);
  const ts = Date.now();

  const simulationStepsCount = [300, 5, 5, 5, 5];
  const strategyConfig: StrategyConfig = {
    runner: new MultiprocessingRunnerStrategy(os.cpus().length),
    mutation: new MutationStrategy(),
    crossover: new SubMatrixCrossoverStrategy()
  };

  const worldConfig = getWorldConfig();
  const typesConfig = getReferenceTypesConfig();
  const typesCount = typesConfig.FREQUENCIES.length;
  const randomTypesConfig = getRandomizeConfig(typesCount);
  const weights = convertWeightsToSummaryMatrixRow(getWeights(), typesCount);

  const reference = testSimulation(worldConfig, typesConfig, simulationStepsCount);
  const geneticConfig: GeneticSearchConfig = {
    populationSize: 100,
    survivalRate: 0.5,
    crossoverRate: 0.5,
    mutationProbability: 0.1,
    reference,
    weights,
    worldConfig,
    randomTypesConfig,
    simulationStepsCount,
  };

  console.log(geneticConfig);

  const geneticSearch = new GeneticSearch(geneticConfig, strategyConfig);

  await geneticSearch.runGenerationStep();

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
  return createDefaultRandomTypesConfig(typesCount);
}

function getWorldConfig(): WorldConfig {
  const atomsCount = 500;
  const minPosition = [0, 0];
  const maxPosition = [1000, 1000];

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
