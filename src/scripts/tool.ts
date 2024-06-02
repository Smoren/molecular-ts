import { createRouter } from '@/scripts/lib/helpers';
import { actionGeneticSearch } from '@/scripts/actions/genetic-search';
import { actionGeneticClarify } from "@/scripts/actions/genetic-clarify";
import { actionCalcSummary } from "@/scripts/actions/calc-summary";

const router = createRouter();

router.add('genetic-search', actionGeneticSearch);
router.add('genetic-clarify', actionGeneticClarify);
router.add('calc-summary', actionCalcSummary);

router.run(process.argv);
