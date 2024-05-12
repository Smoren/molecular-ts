import { actionTest } from '@/scripts/actions/test';
import { createRouter } from '@/scripts/lib/helpers';

const router = createRouter();

router.add('test', actionTest);

router.run(process.argv.slice(2));
