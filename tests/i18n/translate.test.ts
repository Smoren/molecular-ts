import { describe, expect, test } from '@jest/globals';
import { formatMessage, normalizeMessageKey } from '../../src/web/i18n/translate';

describe('i18n translate helpers', () => {
  test('collapses whitespace in keys', () => {
    expect(normalizeMessageKey('  Foo \n  bar  ')).toBe('Foo bar');
  });

  test('replaces numbered placeholders', () => {
    expect(formatMessage('Import error: {0}', ['boom'])).toBe('Import error: boom');
    expect(formatMessage('Progress: {0} / {1}', [3, 10])).toBe('Progress: 3 / 10');
  });
});
