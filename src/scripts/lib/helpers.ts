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
