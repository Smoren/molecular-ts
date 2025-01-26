import type { RandomTypesConfig, TypesConfig, WorldConfig } from "../config/types";
import { Runner } from "../simulation/runner";
import { Simulation } from "../simulation/simulation";
import { createPhysicModel } from "../utils/functions";
import { create2dRandomDistribution } from "../config/atoms";
import { createDummyDrawer } from "../drawer/dummy";
import type { BaseGenome, Population } from "genetic-search";

export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function createHeadless2dSimulationRunner(worldConfig: WorldConfig, typesConfig: TypesConfig): Runner {
  const sim = new Simulation({
    viewMode: '2d',
    worldConfig: worldConfig,
    typesConfig: typesConfig,
    physicModel: createPhysicModel(worldConfig, typesConfig),
    atomsFactory: create2dRandomDistribution,
    drawer: createDummyDrawer(),
  });

  return new Runner(sim);
}

export function setTypesCountToRandomizeConfigCollection(configs: RandomTypesConfig[], typesCount: number): RandomTypesConfig[] {
  return configs.map((config) => {
    config.TYPES_COUNT = typesCount;
    return config;
  });
}

export class StorageManager<T> {
  private _data: T[];

  constructor(data: T[]) {
    this._data = data;
  }

  update({ filter, update }: {
    filter: (genome: T) => boolean;
    update: (genome: T) => void;
  }): number {
    let updatedCount = 0;
    for (const genome of this._data) {
      if (filter(genome)) {
        update(genome);
        ++updatedCount;
      }
    }
    return updatedCount;
  }

  remove({ filter, sort, maxCount }: {
    filter: (genome: T) => boolean;
    sort?: (lhs: T, rhs: T) => number;
    maxCount?: number;
  }): number {
    const buf = [...this._data];

    if (sort) {
      buf.sort(sort);
    }

    this._data.length = 0;
    let removedCount = 0;

    for (const genome of buf) {
      if (filter(genome)) {
        ++removedCount;

        if (maxCount !== undefined && removedCount >= maxCount) {
          break;
        }
      } else {
        this._data.push(genome);
      }
    }

    return removedCount;
  }
}
