import { ArgsParser } from "@/scripts/lib/router";
import type { SimulationGenome } from "@/lib/genetic/types";
import {
  writeJsonFile,
  getRandomizeConfigCollection,
  getSourcePopulation,
} from "@/scripts/lib/genetic/io";
import { IdGenerator } from "genetic-search";
import { RandomPopulateStrategy, SourceMutationPopulateStrategy } from "@/lib/genetic/strategies";

export const actionPopulate = async (...args: string[]) => {
  const ts = Date.now();
  const runId = Math.floor(Math.random()*1000);

  try {
    const argsParser = new ArgsParser(args);
    const argsMap = parseArgs(argsParser);
    const {
      populationSize,
      probabilities,
      sourceFileName,
      randomizeConfigCollectionFileName,
      randomRate,
    } = argsMap;
    console.log(`[START] populate (process_id = ${runId})`);
    console.log('[INPUT PARAMS]', argsMap);

    const idGenerator = new IdGenerator<SimulationGenome>();
    const sourcePopulation = getSourcePopulation(sourceFileName, idGenerator);
    const typesCollection = sourcePopulation.map((source) => source.typesConfig);

    const typesCount = typesCollection[0]?.FREQUENCIES.length ?? 0;
    const randomizeConfigCollection = getRandomizeConfigCollection(randomizeConfigCollectionFileName, typesCount);

    console.log('[COMPUTED PARAMS]', { typesCount });

    const newPopulationSize = populationSize-sourcePopulation.length;
    const randomPopulationSize = Math.round(newPopulationSize*randomRate);
    const mutatedPopulationSize = newPopulationSize - randomPopulationSize;

    const sourceMutationStrategy = new SourceMutationPopulateStrategy(typesCollection, randomizeConfigCollection, probabilities);
    const randomStrategy = new RandomPopulateStrategy(randomizeConfigCollection);

    const mutatedPopulation = sourceMutationStrategy.populate(mutatedPopulationSize, idGenerator);
    const randomPopulation = randomStrategy.populate(randomPopulationSize, idGenerator);

    const totalPopulation = [...sourcePopulation, ...mutatedPopulation, ...randomPopulation];
    const fileName = 'data/output/population.json';
    writeJsonFile(fileName, totalPopulation);

    console.log('[RESULT FILE]', fileName);
  } catch (e) {
    console.error('[ERROR]', (e as Error).message);
  }

  console.log(`[FINISH] in ${Date.now() - ts} ms`);
}

function parseArgs(argsParser: ArgsParser) {
  const populationSize = argsParser.getInt('populationSize', 200);
  const rawProbabilities = argsParser.getNullableString('probabilities');
  const sourceFileName = argsParser.getString('sourceFileName', 'default-source-genome-config');
  const randomizeConfigCollectionFileName = argsParser.getString('randomizeConfigCollectionFileName', 'default-randomize-config-populate-collection');
  const probabilities = rawProbabilities !== undefined ? JSON.parse(rawProbabilities) : [0.01, 0.03, 0.05, 0.1, 0.2, 0.3, 0.5];
  const randomRate = argsParser.getFloat('randomRate', 0);

  return {
    populationSize,
    sourceFileName,
    randomizeConfigCollectionFileName,
    randomRate,
    probabilities,
  };
}
