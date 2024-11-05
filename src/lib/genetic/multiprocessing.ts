import type { SimulationTaskConfig } from "../types/genetic";
import { repeatTestSimulationComplexGrade } from "./grade";

export const simulationComplexGradeTaskMultiprocessing = async ([
  id,
  worldConfig,
  typesConfig,
  checkpoints,
  repeats,
]: SimulationTaskConfig): Promise<number[]> => {
  worldConfig.TEMPERATURE_FUNCTION = () => 1;

  const dirName = __dirname.replace('/node_modules/multiprocess-pool/dist', '/src');
  const { repeatTestSimulationComplexGrade } = await import(`${dirName}/lib/genetic/grade`);

  return repeatTestSimulationComplexGrade(worldConfig, typesConfig, checkpoints, repeats);
}

export const simulationComplexGradeTaskSingle = async ([
  id,
  worldConfig,
  typesConfig,
  checkpoints,
  repeats,
]: SimulationTaskConfig): Promise<number[]> => {
  worldConfig.TEMPERATURE_FUNCTION = () => 1;
  return repeatTestSimulationComplexGrade(worldConfig, typesConfig, checkpoints, repeats);
}
