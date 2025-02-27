import fs from "node:fs";
import fetch from 'node-fetch';
import type { CalcPhenomeTask, IdGeneratorInterface, Population } from "genetic-search";
import type { InitialConfig, RandomTypesConfig, WorldConfig } from "@/lib/config/types";
import type { RemoteApiConfig, SendGenomeRequestData, SendStateRequestData } from "@/scripts/lib/genetic/types";
import type { ClusterizationConfig, SimulationGenome } from "@/lib/genetic/types";
import { createWorldConfig2d } from "@/lib/config/world";
import { addLeadingZeros, formatJsonString, formatRounded } from "@/scripts/lib/helpers";
import type { ClusterGradeMaximizeGeneticMainConfig } from "@/lib/genetic/clusters-grade-maximize/types";
import { round } from "@/lib/math";

export function getGeneticMainConfig<TTaskConfig>(
  fileName: string,
  poolSize: number,
  task: CalcPhenomeTask<TTaskConfig>,
): ClusterGradeMaximizeGeneticMainConfig<TTaskConfig> {
  const result = readJsonFile(`data/input/${fileName}`) as ClusterGradeMaximizeGeneticMainConfig<TTaskConfig>;
  result.phenome.poolSize = poolSize;
  result.phenome.task = task;
  result.phenome.onTaskResult = () => process.stdout.write('.');

  return result;
}

export function getRandomizeConfigCollection(fileName: string, typesCount?: number): RandomTypesConfig[] {
  const result = readJsonFile(`data/input/${fileName}`) as RandomTypesConfig[];
  if (typesCount !== undefined) {
    result.forEach((config) => { config.TYPES_COUNT = typesCount });
  }
  return result;
}

export function getWorldConfig(fileName: string, initialConfig: InitialConfig): WorldConfig {
  const worldConfig = readJsonFile(`data/input/${fileName}`) as WorldConfig;
  worldConfig.TEMPERATURE_FUNCTION = () => 1;
  return createWorldConfig2d(initialConfig, worldConfig);
}

export function getClusterizationConfig(fileName: string): ClusterizationConfig {
  return readJsonFile(`data/input/${fileName}`) as ClusterizationConfig;
}

export function getSourcePopulation(fileName: string, idGenerator: IdGeneratorInterface<SimulationGenome>): Population<SimulationGenome> {
  const source = readJsonFile(`data/input/${fileName}`) as SimulationGenome | SimulationGenome[];
  const sourcePopulation = Array.isArray(source) ? source : [source];
  return sourcePopulation.map(genome => ({
    id: idGenerator.nextId(),
    typesConfig: genome.typesConfig,
  }))
}

export function getPopulation(fileName?: string): Population<SimulationGenome> | undefined {
  if (fileName === undefined) {
    return undefined;
  }
  return readJsonFile(getPopulationInputFilePath(fileName)) as Population<SimulationGenome>;
}

export function getCache(fileName?: string): Record<number, unknown> | undefined {
  if (fileName === undefined) {
    return undefined;
  }
  return readJsonFile(getCacheInputFilePath(fileName)) as Record<number, unknown>;
}

export function readJsonFile(path: string) {
  path = path.match(/\.json$/) ? path : `${path}.json`;

  if (!fs.existsSync(path)) {
    throw new Error(`File not found: ${path}`);
  }

  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

export function writeJsonFile(path: string, data: Record<number | string, unknown> | unknown[]) {
  path = path.match(/\.json$/) ? path : `${path}.json`;
  fs.writeFileSync(path, formatJsonString(JSON.stringify(data, null, 4)));
}

export function getGenerationResultFilePath(
  runId: number,
  generationIndex: number,
  bestId: number,
  bestScore: number,
  totalGenerations: number,
): string {
  const generationIndexStr = addLeadingZeros(generationIndex, String(totalGenerations).length);
  return `data/output/${runId}_generation_${generationIndexStr}_id_${bestId}_score_${formatRounded(bestScore, 6)}.json`;
}

export function getPopulationInputFilePath(fileName: string = 'population'): string {
  return `data/input/${fileName}.json`;
}

export function getPopulationOutputFilePath(fileName: string = 'population'): string {
  return `data/output/${fileName}.json`;
}

export function getCacheInputFilePath(fileName: string = 'cache'): string {
  return `data/input/${fileName}.json`;
}

export function getCacheOutputFilePath(fileName: string = 'cache'): string {
  return `data/output/${fileName}.json`;
}

export async function sendStateToServer(apiConfig: RemoteApiConfig, requestData: SendStateRequestData) {
  if (apiConfig.url === undefined) {
    return;
  }

  const body = {
    action: 'state',
    token: apiConfig.token,
    ...requestData,
  };

  try {
    const result = await fetch(apiConfig.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (result.status !== 200) {
      const errorData = await result.json();
      throw new Error(`${String(result.status)} ${JSON.stringify(errorData)}`);
    }
  } catch (e) {
    console.warn('Cannot send state to server', (e as Error).message);
  }
}

export async function sendGenomeToServer(apiConfig: RemoteApiConfig, requestData: SendGenomeRequestData) {
  if (apiConfig.url === undefined) {
    return;
  }

  const body = {
    action: 'genome',
    token: apiConfig.token,
    ...requestData,
  };

  try {
    const result = await fetch(apiConfig.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (result.status !== 200) {
      const errorData = await result.json();
      throw new Error(`${String(result.status)} ${JSON.stringify(errorData)}`);
    }
  } catch (e) {
    console.warn('Cannot send state to server', (e as Error).message);
  }
}
