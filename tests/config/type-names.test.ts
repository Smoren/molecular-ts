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
});

describe('color picker hex', () => {
  it('roundtrips rgb and hex', () => {
    expect(rgbToHex([170, 45, 16])).toBe('#aa2d10');
    expect(hexToRgb('#aa2d10')).toEqual([170, 45, 16]);
  });
});
