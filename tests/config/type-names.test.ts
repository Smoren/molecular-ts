import { describe, expect, it } from '@jest/globals';
import {
  createDefaultTypeNames,
  createDefaultTypesConfig,
  defaultTypeName,
  ensureTypeNames,
  pickUnusedTypeName,
} from '../../src/lib/config/atom-types';
import { convertTypesConfigForBackwardCompatibility } from '../../src/web/utils/backward';
import { hexToRgb, rgbToHex } from '../../src/web/components/config-editor/utils';

describe('type names', () => {
  it('uses spreadsheet-style default names', () => {
    expect(defaultTypeName(0)).toBe('A');
    expect(defaultTypeName(25)).toBe('Z');
    expect(defaultTypeName(26)).toBe('AA');
    expect(createDefaultTypeNames(3)).toEqual(['A', 'B', 'C']);
  });

  it('fills missing names and keeps custom ones', () => {
    expect(ensureTypeNames(undefined, 2)).toEqual(['A', 'B']);
    expect(ensureTypeNames(['C', '  ', 'O'], 3)).toEqual(['C', 'B', 'O']);
  });

  it('picks the next unused default name', () => {
    expect(pickUnusedTypeName(['A', 'C'])).toBe('B');
  });

  it('adds default names on import when the field is missing', () => {
    const raw = createDefaultTypesConfig();
    delete (raw as { NAMES?: string[] }).NAMES;

    const imported = convertTypesConfigForBackwardCompatibility(raw);
    expect(imported.NAMES).toEqual(['A', 'B', 'C', 'D', 'E']);
    expect(imported.LINK_GRAVITY).toEqual(raw.LINK_GRAVITY);
  });

  it('keeps names from a share payload', () => {
    const raw = createDefaultTypesConfig();
    raw.NAMES = ['C', 'H', 'O', 'N', 'X'];

    const imported = convertTypesConfigForBackwardCompatibility(raw);
    expect(imported.NAMES).toEqual(['C', 'H', 'O', 'N', 'X']);
  });

  it('fills link gravity tensor with zeros on import when the field is missing', () => {
    const raw = createDefaultTypesConfig();
    const expected = raw.LINK_FACTOR_GRAVITY;
    delete (raw as { LINK_FACTOR_GRAVITY?: number[][][] }).LINK_FACTOR_GRAVITY;

    const imported = convertTypesConfigForBackwardCompatibility(raw);
    expect(imported.LINK_FACTOR_GRAVITY).toEqual(expected);
    expect(imported.LINK_FACTOR_GRAVITY.every(
      (matrix) => matrix.every((row) => row.every((value) => value === 0)),
    )).toBe(true);
  });

  it('fills all missing fields with neutral defaults on import', () => {
    const raw = createDefaultTypesConfig();
    const typesCount = raw.FREQUENCIES.length;
    const numericKeys = [
      'RADIUS',
      'FREQUENCIES',
      'LINKS',
      'GRAVITY',
      'LINK_GRAVITY',
      'TYPE_LINKS',
      'TYPE_LINK_WEIGHTS',
      'LINK_FACTOR_DISTANCE',
      'LINK_FACTOR_ELASTIC',
      'LINK_FACTOR_GRAVITY',
      'GRAVITY_FACTOR',
    ] as const;
    for (const key of numericKeys) {
      delete (raw as Record<string, unknown>)[key];
    }

    const imported = convertTypesConfigForBackwardCompatibility(raw);

    expect(imported.RADIUS).toEqual(new Array(typesCount).fill(1));
    expect(imported.FREQUENCIES).toEqual(new Array(typesCount).fill(1));
    expect(imported.LINKS).toEqual(new Array(typesCount).fill(0));
    expect(imported.GRAVITY.every((row) => row.every((x) => x === 0))).toBe(true);
    expect(imported.LINK_GRAVITY.every((row) => row.every((x) => x === 0))).toBe(true);
    expect(imported.TYPE_LINKS.every((row) => row.every((x) => x === 0))).toBe(true);
    expect(imported.TYPE_LINK_WEIGHTS.every((row) => row.every((x) => x === 1))).toBe(true);
    expect(imported.LINK_FACTOR_DISTANCE.every((m) => m.every((r) => r.every((x) => x === 1)))).toBe(true);
    expect(imported.LINK_FACTOR_ELASTIC.every((m) => m.every((r) => r.every((x) => x === 1)))).toBe(true);
    expect(imported.LINK_FACTOR_GRAVITY.every((m) => m.every((r) => r.every((x) => x === 0)))).toBe(true);
    expect(imported.GRAVITY_FACTOR.every((m) => m.every((r) => r.every((x) => x === 0)))).toBe(true);
  });
});

describe('color picker hex', () => {
  it('roundtrips rgb and hex', () => {
    expect(rgbToHex([170, 45, 16])).toBe('#aa2d10');
    expect(hexToRgb('#aa2d10')).toEqual([170, 45, 16]);
  });
});
