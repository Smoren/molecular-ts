import { MODE } from '@/lib/config/initial';
import { startSimulation } from "./choice";

const DIMENSIONS = 3;
const CURRENT_MODE = MODE.CONST_TYPES;

startSimulation(DIMENSIONS, CURRENT_MODE)
