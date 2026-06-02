import { describe, expect, it } from 'vitest';
import {
  ALL_SYMBOLS,
  AMBIGUOUS,
  SAFE_SYMBOLS,
  generatePassword,
  getPasswordCharacterSets,
  normalizeCustomSymbols,
} from './password';

const baseOptions = {
  length: 32,
  uppercase: true,
  lowercase: true,
  digits: true,
  symbols: true,
  symbolMode: 'safe-symbols' as const,
  excludeAmbiguous: false,
  requireEachSelectedType: true,
};

describe('password', () => {
  it('generates a password with the requested length', () => {
    expect(generatePassword(baseOptions).value).toHaveLength(32);
  });

  it('requires each selected character type when configured', () => {
    const value = generatePassword(baseOptions).value;

    expect(/[A-Z]/u.test(value)).toBe(true);
    expect(/[a-z]/u.test(value)).toBe(true);
    expect(/[0-9]/u.test(value)).toBe(true);
    expect(Array.from(value).some((character) => SAFE_SYMBOLS.includes(character))).toBe(true);
  });

  it('uses only safe symbols in safe-symbols mode', () => {
    const value = generatePassword({ ...baseOptions, uppercase: false, lowercase: false, digits: false }).value;

    expect(Array.from(value).every((character) => SAFE_SYMBOLS.includes(character))).toBe(true);
  });

  it('uses all symbols in all-symbols mode', () => {
    const value = generatePassword({
      ...baseOptions,
      uppercase: false,
      lowercase: false,
      digits: false,
      symbolMode: 'all-symbols',
    }).value;

    expect(Array.from(value).every((character) => ALL_SYMBOLS.includes(character))).toBe(true);
  });

  it('deduplicates custom symbols and rejects empty input', () => {
    expect(normalizeCustomSymbols('!!__..')).toBe('!_.');
    expect(() => normalizeCustomSymbols('')).toThrow(/customSymbols/u);
  });

  it('excludes ambiguous characters', () => {
    const sets = getPasswordCharacterSets({ ...baseOptions, excludeAmbiguous: true });
    const combined = sets.map((set) => set.characters).join('');

    expect(Array.from(AMBIGUOUS).every((character) => !combined.includes(character))).toBe(true);
  });

  it('rejects impossible required character type constraints', () => {
    expect(() => generatePassword({ ...baseOptions, length: 3 })).toThrow(/selected character types/u);
  });
});
