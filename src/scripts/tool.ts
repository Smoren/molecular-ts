import { createRouter } from '@/scripts/lib/helpers';
import { actionTestParallel } from '@/scripts/actions/test-parallel';
import { actionGeneticSearchByTypesConfig } from '@/scripts/actions/genetic-search-by-types-config';
import { actionRandomSearchByTypesConfig } from "@/scripts/actions/random-search-by-types-config";

const router = createRouter();

router.add('test-parallel', actionTestParallel);
router.add('genetic-search-by-types-config', actionGeneticSearchByTypesConfig);
router.add('random-search-by-types-config', actionRandomSearchByTypesConfig);

router.run(process.argv);
