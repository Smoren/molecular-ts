import { Router } from '@/scripts/lib/router';

export const createRouter = () => {
  const router = new Router();

  router.onBeforeRun(() => {
    console.log('***********************');
    console.log('** COMMAND LINE TOOL **');
    console.log('***********************');
    console.log('');
  });

  return router;
}

export function addLeadingZeros(num: number, totalLength: number): string {
  return `${'0'.repeat(Math.max(0, totalLength - String(num).length))}${num}`;
}

// TODO move to IO
export function getGenerationResultFilePath(
  runId: number,
  generationIndex: number,
  bestId: number,
  bestScore: number,
  totalGenerations: number,
): string {
  const generationIndexStr = addLeadingZeros(generationIndex+1, String(totalGenerations).length);
  return `data/output/${runId}_generation_${generationIndexStr}_id_${bestId}_score_${Math.round(bestScore)}.json`;
}

export function getPopulationInputFilePath(fileName: string = 'population'): string {
  return `data/input/${fileName}.json`;
}

export function getPopulationOutputFilePath(fileName: string = 'population'): string {
  return `data/output/${fileName}.json`;
}
