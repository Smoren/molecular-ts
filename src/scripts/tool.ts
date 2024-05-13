import { createRouter } from '@/scripts/lib/helpers';
import { actionTestSimulation } from '@/scripts/actions/test-simulation';
import { actionTestParallel } from "@/scripts/actions/test-parallel";
import { actionTestParallelSimulation } from "@/scripts/actions/test-simulation-parallel";

const router = createRouter();

router.add('test-simulation', actionTestSimulation);
router.add('test-parallel', actionTestParallel);
router.add('test-parallel-simulation', actionTestParallelSimulation);

router.run(process.argv);
