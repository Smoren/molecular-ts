import { createRouter } from '@/scripts/lib/helpers';
import { actionComplexGeneticSearch } from '@/scripts/actions/complex-genetic-search';
import { actionComplexRandomSearch } from "@/scripts/actions/complex-random-search";
import { actionComplexCalcSummary } from "@/scripts/actions/complex-calc-summary";

const router = createRouter();

router.add('complex-genetic-search', actionComplexGeneticSearch);
router.add('complex-random-search', actionComplexRandomSearch);
router.add('complex-calc-summary', actionComplexCalcSummary);

router.run(process.argv);
