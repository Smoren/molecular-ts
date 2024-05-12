import { Router } from '@/scripts/lib/router';
import { actionTest } from '@/scripts/actions/test';

const router = new Router();

router.onBeforeRun(() => {
  console.log('');
  console.log('***********************');
  console.log('** COMMAND LINE TOOL **');
  console.log('***********************');
  console.log('');
})

router.add('test', actionTest);

router.run(process.argv.slice(2));
