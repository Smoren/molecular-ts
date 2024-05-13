import { createRouter } from '@/scripts/lib/helpers';
import { actionTestSimulation } from '@/scripts/actions/test-simulation';
import { actionTestParallel } from "@/scripts/actions/test-parallel";
import { actionTestSimulationParallel } from "@/scripts/actions/test-simulation-parallel";

const router = createRouter();

router.add('test-simulation', actionTestSimulation);
router.add('test-parallel', actionTestParallel);
router.add('test-simulation-parallel', actionTestSimulationParallel);

router.run(process.argv);
