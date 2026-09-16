import { describe, expect, it } from '@jest/globals';
import type { TypesConfig, WorldConfig } from '../../src/lib/config/types';
import { createBaseWorldConfig } from '../../src/lib/config/world';
import { createTransparentTypesConfig } from '../../src/lib/config/atom-types';
import { createAtom } from '../../src/lib/utils/functions';
import { LinkManager, RulesHelper } from '../../src/lib/utils/structs';
import { SummaryManager } from '../../src/lib/analysis/summary';
import { InteractionManager } from '../../src/lib/simulation/interaction';
import { PhysicModelV1 } from '../../src/lib/physics/v1';
import { PhysicModelV2 } from '../../src/lib/physics/v2';

const VIEW_MODE = '2d';

function createWorldConfig(): WorldConfig {
  return createBaseWorldConfig();
}

function createTypesConfig(): TypesConfig {
  const config = createTransparentTypesConfig(2);
  config.LINK_FACTOR_GRAVITY[0][1] = [0.5, -0.5];
  config.LINK_GRAVITY[0][1] = 2;
  config.GRAVITY[0][1] = -3;
  return config;
}

function createInteractionManager(
  worldConfig: WorldConfig,
  typesConfig: TypesConfig,
): InteractionManager {
  const links = new LinkManager();
  return new InteractionManager(
    VIEW_MODE,
    worldConfig,
    typesConfig,
    links,
    new PhysicModelV1(worldConfig, typesConfig),
    new RulesHelper(worldConfig, typesConfig),
    new SummaryManager(typesConfig.FREQUENCIES.length),
  );
}

describe('link gravity delta', () => {
  it('resets deltas to zero on clear', () => {
    const worldConfig = createWorldConfig();
    const typesConfig = createTypesConfig();
    const interactionManager = createInteractionManager(worldConfig, typesConfig);
    const atom = createAtom(1, [0, 0]);

    interactionManager.updateLinkGravityDelta(atom, createAtom(0, [1, 0]));
    interactionManager.clearLinkGravityDelta(atom);

    expect(atom.linkGravityDeltas).toEqual([0, 0]);
  });

  it('accumulates deltas additively from multiple neighbors', () => {
    const worldConfig = createWorldConfig();
    const typesConfig = createTypesConfig();
    const interactionManager = createInteractionManager(worldConfig, typesConfig);
    const lhs = createAtom(1, [0, 0]);
    const rhs = createAtom(0, [1, 0]);

    interactionManager.clearLinkGravityDelta(lhs);
    // Два соседа типа 0: каждый добавляет [0.5, -0.5] к дельтам атома типа 1
    interactionManager.updateLinkGravityDelta(lhs, rhs);
    interactionManager.updateLinkGravityDelta(lhs, rhs);

    expect(lhs.linkGravityDeltas).toEqual([1, -1]);
    expect(interactionManager.getLinkGravityDelta(lhs, rhs)).toBe(1);
  });

  it('applies delta to link gravity of linked pairs in PhysicModelV1', () => {
    const worldConfig = createWorldConfig();
    const typesConfig = createTypesConfig();
    const links = new LinkManager();
    const lhs = createAtom(0, [0, 0]);
    const rhs = createAtom(1, [1, 0]);
    links.create(lhs, rhs);

    const model = new PhysicModelV1(worldConfig, typesConfig);
    // dist2 больше суммы радиусов атомов в квадрате, чтобы не попадать в bounce-ветку
    const dist2 = 400;
    const massMultiplier = model.geometry.getMassMultiplier(lhs, rhs);
    const expected = worldConfig.GRAVITY_FORCE_MULTIPLIER
      * (typesConfig.LINK_GRAVITY[0][1] + 0.5)
      * massMultiplier / dist2;

    expect(model.getGravityForce(lhs, rhs, dist2, 0, 0.5)).toBe(expected);
  });

  it('applies delta to link gravity of linked pairs in PhysicModelV2', () => {
    const worldConfig = createWorldConfig();
    const typesConfig = createTypesConfig();
    const links = new LinkManager();
    const lhs = createAtom(0, [0, 0]);
    const rhs = createAtom(1, [1, 0]);
    links.create(lhs, rhs);

    const model = new PhysicModelV2(worldConfig, typesConfig);
    const dist2 = 400;
    const massMultiplier = model.geometry.getMassMultiplier(lhs, rhs);
    const expected = worldConfig.GRAVITY_FORCE_MULTIPLIER
      * (typesConfig.LINK_GRAVITY[0][1] + 0.5)
      / dist2
      * massMultiplier;

    expect(model.getGravityForce(lhs, rhs, dist2, 0, 0.5)).toBe(expected);
  });

  it('ignores link gravity delta for unlinked pairs', () => {
    const worldConfig = createWorldConfig();
    const typesConfig = createTypesConfig();
    const lhs = createAtom(0, [0, 0]);
    const rhs = createAtom(1, [1, 0]);

    const model = new PhysicModelV1(worldConfig, typesConfig);
    const dist2 = 400;
    const massMultiplier = model.geometry.getMassMultiplier(lhs, rhs);
    const expected = worldConfig.GRAVITY_FORCE_MULTIPLIER
      * typesConfig.GRAVITY[0][1]
      * massMultiplier / dist2;

    expect(model.getGravityForce(lhs, rhs, dist2, 0, 0.5)).toBe(expected);
  });

  it('applies gravity delta to unlinked pairs', () => {
    const worldConfig = createWorldConfig();
    const typesConfig = createTypesConfig();
    const lhs = createAtom(0, [0, 0]);
    const rhs = createAtom(1, [1, 0]);

    const model = new PhysicModelV1(worldConfig, typesConfig);
    const dist2 = 400;
    const massMultiplier = model.geometry.getMassMultiplier(lhs, rhs);
    const expected = worldConfig.GRAVITY_FORCE_MULTIPLIER
      * (typesConfig.GRAVITY[0][1] + 0.7)
      * massMultiplier / dist2;

    expect(model.getGravityForce(lhs, rhs, dist2, 0.7, 0)).toBe(expected);
  });

  it('ignores gravity delta for linked pairs', () => {
    const worldConfig = createWorldConfig();
    const typesConfig = createTypesConfig();
    const links = new LinkManager();
    const lhs = createAtom(0, [0, 0]);
    const rhs = createAtom(1, [1, 0]);
    links.create(lhs, rhs);

    const model = new PhysicModelV1(worldConfig, typesConfig);
    const dist2 = 400;
    const massMultiplier = model.geometry.getMassMultiplier(lhs, rhs);
    const expected = worldConfig.GRAVITY_FORCE_MULTIPLIER
      * typesConfig.LINK_GRAVITY[0][1]
      * massMultiplier / dist2;

    expect(model.getGravityForce(lhs, rhs, dist2, 0.7, 0)).toBe(expected);
  });
});
