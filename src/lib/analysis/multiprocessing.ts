import type { TypesConfig, WorldConfig } from '../types/config';
import { repeatTestSimulation } from '../analysis/helpers';

export type SimulationTaskConfig = [number, WorldConfig, TypesConfig, number[], number];

export const simulationTaskMultiprocessing = async ([id, worldConfig, typesConfig, checkpoints, repeats]: SimulationTaskConfig): Promise<number[]> => {
  // console.log(`-> task ${id} started`);
  const ts = Date.now();

  worldConfig.TEMPERATURE_FUNCTION = () => 1;

  const dirName = __dirname.replace('/node_modules/multiprocess-pool/dist', '/src');
  const { repeatTestSimulation } = await import(`${dirName}/lib/analysis/helpers`);

  const result = repeatTestSimulation(worldConfig, typesConfig, checkpoints, repeats);

  // console.log(`<- task ${id} finished in ${Date.now() - ts} ms`);

  return result;
}

export const simulationTaskSingle = async ([id, worldConfig, typesConfig, checkpoints, repeats]: SimulationTaskConfig): Promise<number[]> => {
  // console.log(`-> task ${id} started`);
  const ts = Date.now();

  worldConfig.TEMPERATURE_FUNCTION = () => 1;

  const result = repeatTestSimulation(worldConfig, typesConfig, checkpoints, repeats);

  // console.log(`<- task ${id} finished in ${Date.now() - ts} ms`);

  return result;
}
