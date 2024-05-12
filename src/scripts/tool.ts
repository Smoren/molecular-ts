import { actionTestSimulation } from '@/scripts/actions/test-simulation';
import { createRouter } from '@/scripts/lib/helpers';
import { actionTestParallel } from "@/scripts/actions/test-parallel";

const router = createRouter();

router.add('test-simulation', actionTestSimulation);
router.add('test-parallel', actionTestParallel);

router.run(process.argv.slice(2));
