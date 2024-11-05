import { createRouter } from '@/scripts/lib/helpers';
import { actionComplexGeneticSearch } from '@/scripts/actions/complex-genetic-search';
import { actionComplexRandomSearch } from "@/scripts/actions/complex-random-search";
import { actionComplexCalcSummary } from "@/scripts/actions/complex-calc-summary";
import { actionClusterGradeMaximize } from '@/scripts/actions/cluster-grade-maximize';

const router = createRouter();

// TODO: mass cross 2 configs search
router.add('complex-genetic-search', actionComplexGeneticSearch);
router.add('complex-random-search', actionComplexRandomSearch);
router.add('complex-calc-summary', actionComplexCalcSummary);
router.add('cluster-grade-maximize', actionClusterGradeMaximize);

router.run(process.argv);
