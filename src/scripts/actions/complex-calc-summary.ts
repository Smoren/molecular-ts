import { ArgsParser } from "@/scripts/lib/router";
import {
  getTypesConfig,
  getWorldConfig,
  getSimulationMainConfig,
  writeJsonFile,
} from "@/scripts/lib/genetic/io";
import { convertSummaryMatrixRowToObject } from "@/lib/genetic/helpers";
import { repeatRunSimulationForComplexGrade } from '@/lib/genetic/grade';

export const actionComplexCalcSummary = async (...args: string[]) => {
  const ts = Date.now();

  try {
    const argsParser = new ArgsParser(args);
    const argsMap = parseArgs(argsParser);
    const {
      geneticMainConfigFileName,
      worldConfigFileName,
      referenceConfigFileName,
    } = argsMap;
    console.log(`[START] calc simulation summary action`);
    console.log('[INPUT PARAMS]', argsMap);

    const mainConfig = getSimulationMainConfig(geneticMainConfigFileName);
    const worldConfig = getWorldConfig(worldConfigFileName, mainConfig.initial);
    const referenceConfig = getTypesConfig(referenceConfigFileName);
    const typesCount = referenceConfig.FREQUENCIES.length;

    const summaryMatrixRow = repeatRunSimulationForComplexGrade(
      worldConfig,
      referenceConfig,
      mainConfig.runner.checkpoints,
      mainConfig.runner.repeats,
    );

    const summaryMatrixRowObject = convertSummaryMatrixRowToObject(summaryMatrixRow, typesCount);

    console.log('[RESULT]', summaryMatrixRowObject);
    writeJsonFile(`data/output/simulation-summary-object.json`, summaryMatrixRowObject);
  } catch (e) {
    console.error('[ERROR]', (e as Error).message);
  }

  console.log(`[FINISH] in ${Date.now() - ts} ms`);
}

function parseArgs(argsParser: ArgsParser) {
  const geneticMainConfigFileName = argsParser.getString('mainConfigFileName', 'default-simulation-main-config');
  const worldConfigFileName = argsParser.getString('worldConfigFileName', 'default-genetic-world-config');
  const referenceConfigFileName = argsParser.getString('referenceConfigFileName', 'default-genetic-reference-config');

  return {
    geneticMainConfigFileName,
    worldConfigFileName,
    referenceConfigFileName,
  };
}
