import { repeatTestSimulation } from "./helpers";
import type { SimulationTaskConfig } from "../types/genetic";

export const simulationTaskMultiprocessing = async ([
  id,
  worldConfig,
  typesConfig,
  checkpoints,
  repeats,
]: SimulationTaskConfig): Promise<number[]> => {
  worldConfig.TEMPERATURE_FUNCTION = () => 1;

  const dirName = __dirname.replace('/node_modules/multiprocess-pool/dist', '/src');
  const { repeatTestSimulation } = await import(`${dirName}/lib/genetic/helpers`);

  return repeatTestSimulation(worldConfig, typesConfig, checkpoints, repeats);
}

export const simulationTaskSingle = async ([
  id,
  worldConfig,
  typesConfig,
  checkpoints,
  repeats,
]: SimulationTaskConfig): Promise<number[]> => {
  worldConfig.TEMPERATURE_FUNCTION = () => 1;
  return repeatTestSimulation(worldConfig, typesConfig, checkpoints, repeats);
}
