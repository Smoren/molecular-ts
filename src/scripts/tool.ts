import { createRouter } from '@/scripts/lib/helpers';
import { actionReferenceSearch } from '@/scripts/actions/reference-search';
import { actionReferenceRandomSearch } from "@/scripts/actions/reference-random-search";
import { actionReferenceCalcSummary } from "@/scripts/actions/reference-calc-summary";
import { actionClustersGradeMaximize } from '@/scripts/actions/clusters-grade-maximize';
import { actionPopulate } from "@/scripts/actions/populate";
import { actionTestRunSingle } from "@/scripts/actions/test-run-single";
import { actionTestRunMultiprocess } from "@/scripts/actions/test-run-multiprocess";
import { actionTestMultiprocess } from "@/scripts/actions/test-multiprocess";
import { actionTestRunMultiprocessNew } from "@/scripts/actions/test-run-multiprocess-new";

const router = createRouter();

// TODO: mass cross 2 configs search
router.add('reference-search', actionReferenceSearch);
router.add('reference-random-search', actionReferenceRandomSearch);
router.add('reference-calc-summary', actionReferenceCalcSummary);
router.add('clusters-grade-maximize', actionClustersGradeMaximize);
router.add('populate', actionPopulate);
router.add('test-run-single', actionTestRunSingle);
router.add('test-run-multiprocess', actionTestRunMultiprocess);
router.add('test-run-multiprocess-new', actionTestRunMultiprocessNew);
router.add('test-multiprocess', actionTestMultiprocess);

router.run(process.argv);
