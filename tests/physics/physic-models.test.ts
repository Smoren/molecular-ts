import { describe, expect, it } from '@jest/globals';
import type { TypesConfig, WorldConfig } from '../../src/lib/config/types';
import { createBaseWorldConfig } from '../../src/lib/config/world';
import { createTransparentTypesConfig } from '../../src/lib/config/atom-types';
import { createAtom } from '../../src/lib/utils/functions';
import { LinkManager } from '../../src/lib/utils/structs';
import { PhysicModelV1 } from '../../src/lib/physics/v1';
import { PhysicModelV2 } from '../../src/lib/physics/v2';

const VIEW_MODE = '2d';

function createWorldConfig(): WorldConfig {
  return createBaseWorldConfig();
}

function createTypesConfig(): TypesConfig {
  const config = createTransparentTypesConfig(2);
  config.RADIUS = [1, 2];
  config.GRAVITY[0][1] = -3;
  config.GRAVITY[1][0] = 0.5;
  config.LINK_GRAVITY[0][1] = 2;
  config.LINK_GRAVITY[1][0] = -4;
  return config;
}

function createLinkedPair(typesConfig: TypesConfig) {
  const links = new LinkManager();
  const lhs = createAtom(0, [100, 100]);
  const rhs = createAtom(1, [130, 100]);
  links.create(lhs, rhs);
  return { lhs, rhs, links };
}

describe.each([
  ['v1', () => PhysicModelV1],
  ['v2', () => PhysicModelV2],
])('physic model %s gravity force', (_name, getModel) => {
  it('uses GRAVITY for unlinked pairs', () => {
    const worldConfig = createWorldConfig();
    const typesConfig = createTypesConfig();
    const model = new (getModel())(worldConfig, typesConfig);
    const lhs = createAtom(0, [100, 100]);
    const rhs = createAtom(1, [130, 100]);
    const dist2 = 900;
    const massMultiplier = model.geometry.getMassMultiplier(lhs, rhs);

    const force = model.getGravityForce(lhs, rhs, dist2, 0);

    // GRAVITY_FORCE_MULTIPLIER = 1 в базовом конфиге
    expect(force).toBe(typesConfig.GRAVITY[0][1] * massMultiplier / dist2);
  });

  it('uses LINK_GRAVITY for linked pairs', () => {
    const worldConfig = createWorldConfig();
    const typesConfig = createTypesConfig();
    const model = new (getModel())(worldConfig, typesConfig);
    const { lhs, rhs } = createLinkedPair(typesConfig);
    const dist2 = 900;
    const massMultiplier = model.geometry.getMassMultiplier(lhs, rhs);

    const force = model.getGravityForce(lhs, rhs, dist2, 0);

    expect(force).toBe(typesConfig.LINK_GRAVITY[0][1] * massMultiplier / dist2);
  });
});

describe('physic model v1', () => {
  it('bounces when atoms overlap', () => {
    const worldConfig = createWorldConfig();
    const typesConfig = createTypesConfig();
    const model = new PhysicModelV1(worldConfig, typesConfig);
    const lhs = createAtom(0, [100, 100]);
    const rhs = createAtom(1, [101, 100]);
    const dist2 = 1;
    const massMultiplier = model.geometry.getMassMultiplier(lhs, rhs);

    const force = model.getGravityForce(lhs, rhs, dist2, 0);

    expect(force).toBe(-worldConfig.BOUNCE_FORCE_MULTIPLIER * massMultiplier / dist2);
  });

  it('link force is proportional to elastic factor', () => {
    const worldConfig = createWorldConfig();
    const typesConfig = createTypesConfig();
    const model = new PhysicModelV1(worldConfig, typesConfig);
    const { lhs, rhs } = createLinkedPair(typesConfig);
    const massMultiplier = model.geometry.getMassMultiplier(lhs, rhs);

    expect(model.getLinkForce(lhs, rhs, 900, 2)).toBe(
      worldConfig.LINK_FORCE_MULTIPLIER * massMultiplier * 2,
    );
  });

  it('bounds force is proportional to distance', () => {
    const worldConfig = createWorldConfig();
    const model = new PhysicModelV1(worldConfig, createTypesConfig());

    expect(model.getBoundsForce(40)).toBe(worldConfig.BOUNDS_FORCE_MULTIPLIER * 40);
  });
});

describe('physic model v2', () => {
  const BOUNCE_CORRECTION_FACTOR = 0.01;

  it('adds soft bounce on overlap', () => {
    const worldConfig = createWorldConfig();
    const typesConfig = createTypesConfig();
    const model = new PhysicModelV2(worldConfig, typesConfig);
    const { lhs, rhs } = createLinkedPair(typesConfig);
    const dist2 = 1;
    const massMultiplier = model.geometry.getMassMultiplier(lhs, rhs);
    const bounceDistance = model.geometry.getAtomsRadiusSum(lhs, rhs);

    const bounceForce = (bounceDistance - Math.sqrt(dist2))
      * -worldConfig.BOUNCE_FORCE_MULTIPLIER * BOUNCE_CORRECTION_FACTOR;
    const gravityForce = typesConfig.LINK_GRAVITY[0][1] / dist2;

    expect(model.getGravityForce(lhs, rhs, dist2, 0)).toBe(
      (gravityForce + bounceForce) * massMultiplier,
    );
  });

  it('link force uses bounce correction inside bounce distance', () => {
    const worldConfig = createWorldConfig();
    const typesConfig = createTypesConfig();
    const model = new PhysicModelV2(worldConfig, typesConfig);
    const { lhs, rhs } = createLinkedPair(typesConfig);
    const massMultiplier = model.geometry.getMassMultiplier(lhs, rhs);
    const bounceDistance = model.geometry.getAtomsRadiusSum(lhs, rhs);
    const dist2 = (bounceDistance / 2) ** 2;

    // Внутри зоны отскока упругость гасится пропорционально глубине проникновения
    const expectedFactor = 1 - (bounceDistance - Math.sqrt(dist2)) / bounceDistance;

    expect(model.getLinkForce(lhs, rhs, dist2, 3)).toBe(
      expectedFactor * worldConfig.LINK_FORCE_MULTIPLIER * massMultiplier,
    );
  });

  it('link force uses elastic factor outside bounce distance', () => {
    const worldConfig = createWorldConfig();
    const typesConfig = createTypesConfig();
    const model = new PhysicModelV2(worldConfig, typesConfig);
    const { lhs, rhs } = createLinkedPair(typesConfig);
    const massMultiplier = model.geometry.getMassMultiplier(lhs, rhs);

    expect(model.getLinkForce(lhs, rhs, 900, 3)).toBe(
      3 * worldConfig.LINK_FORCE_MULTIPLIER * massMultiplier,
    );
  });

  it('bounds force is proportional to distance', () => {
    const worldConfig = createWorldConfig();
    const model = new PhysicModelV2(worldConfig, createTypesConfig());

    expect(model.getBoundsForce(40)).toBe(worldConfig.BOUNDS_FORCE_MULTIPLIER * 40);
  });
});
