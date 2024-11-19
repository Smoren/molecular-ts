import type { Population } from "genetic-search";
import type { SimulationGenome } from "@/lib/genetic/types";

export type RemoteApiConfig = {
  url: string | undefined;
  token: string | undefined;
}

export type SendStateRequestData = {
  typesCount: number;
  dateTime: string;
  runId: number;
  population: Population<SimulationGenome>;
  cache: Record<number, unknown>;
}

export type SendGenomeRequestData = {
  typesCount: number;
  dateTime: string;
  runId: number;
  generation: number;
  score: number;
  genome: SimulationGenome;
}
