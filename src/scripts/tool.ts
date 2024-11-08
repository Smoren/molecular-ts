import { createRouter } from '@/scripts/lib/helpers';
import { actionReferenceSearch } from '@/scripts/actions/reference-search';
import { actionReferenceRandomSearch } from "@/scripts/actions/reference-random-search";
import { actionReferenceCalcSummary } from "@/scripts/actions/reference-calc-summary";
import { actionClustersGradeMaximize } from '@/scripts/actions/clusters-grade-maximize';

const router = createRouter();

// TODO: mass cross 2 configs search
router.add('reference-search', actionReferenceSearch);
router.add('reference-random-search', actionReferenceRandomSearch);
router.add('reference-calc-summary', actionReferenceCalcSummary);
router.add('clusters-grade-maximize', actionClustersGradeMaximize);

router.run(process.argv);
