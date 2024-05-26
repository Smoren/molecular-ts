import { createRouter } from '@/scripts/lib/helpers';
import { actionTestParallel } from '@/scripts/actions/test-parallel';
import { actionGeneticSearchByTypesConfig } from '@/scripts/actions/genetic-search-by-types-config';

const router = createRouter();

router.add('test-parallel', actionTestParallel);
router.add('genetic-search-by-types-config', actionGeneticSearchByTypesConfig);

router.run(process.argv);
