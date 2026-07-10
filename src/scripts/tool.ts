import { createRouter } from '@/scripts/lib/helpers';
import { actionClustersGradeMaximize } from '@/scripts/actions/clusters-grade-maximize';
import { actionClustersGradeMaximizeCrossed } from "@/scripts/actions/clusters-grade-maximize-crossed";
import { actionPopulate } from "@/scripts/actions/populate";

const router = createRouter();

// TODO: mass cross 2 configs search
router.add('clusters-grade-maximize', actionClustersGradeMaximize);
router.add('clusters-grade-maximize-crossed', actionClustersGradeMaximizeCrossed);
router.add('populate', actionPopulate);

router.run(process.argv);
