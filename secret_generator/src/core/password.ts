import { calculatePasswordEntropy } from './entropy';
import { getRandomInt, shuffle } from './random';
import type { GeneratedSecret } from './types';
import { MAX_PASSWORD_LENGTH, assertPositiveInteger } from './validation';

export type SymbolMode = 'none' | 'safe-symbols' | 'all-symbols' | 'custom-symbols';

export type GeneratePasswordOptions = {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  digits: boolean;
  symbols: boolean;
  symbolMode: SymbolMode;
  customSymbols?: string;
  excludeAmbiguous: boolean;
  requireEachSelectedType: boolean;
  label?: string;
  category?: GeneratedSecret['category'];
  warnings?: string[];
};

export type PasswordCharacterSet = {
  id: 'uppercase' | 'lowercase' | 'digits' | 'symbols';
  characters: string;
};

export const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
export const DIGITS = '0123456789';
export const SAFE_SYMBOLS = '!$^*-_.';
export const ALL_SYMBOLS = '!@#$%^&*()-_=+[]{};:,.?/';
export const AMBIGUOUS = 'O0Il1S5B8Z2';

const ASCII_PRINTABLE_SYMBOLS = new Set(
  Array.from('!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'),
);

function withoutAmbiguous(characters: string): string {
  return Array.from(characters)
    .filter((character) => !AMBIGUOUS.includes(character))
    .join('');
}

function uniqueCharacters(value: string): string {
  return Array.from(new Set(Array.from(value))).join('');
}

export function normalizeCustomSymbols(customSymbols?: string): string {
  const symbols = uniqueCharacters(customSymbols ?? '');

  if (symbols.length === 0) {
    throw new Error('customSymbols must include at least one symbol');
  }

  for (const symbol of symbols) {
    if (!ASCII_PRINTABLE_SYMBOLS.has(symbol)) {
      throw new Error('customSymbols may only contain printable ASCII symbols');
    }
  }

  return symbols;
}

function getSymbolCharacters(options: GeneratePasswordOptions): string {
  if (!options.symbols || options.symbolMode === 'none') {
    return '';
  }

  if (options.symbolMode === 'custom-symbols') {
    return normalizeCustomSymbols(options.customSymbols);
  }

  return options.symbolMode === 'safe-symbols' ? SAFE_SYMBOLS : ALL_SYMBOLS;
}

export function getPasswordCharacterSets(options: GeneratePasswordOptions): PasswordCharacterSet[] {
  const transform = options.excludeAmbiguous ? withoutAmbiguous : (characters: string) => characters;
  const sets: PasswordCharacterSet[] = [];

  if (options.uppercase) {
    sets.push({ id: 'uppercase', characters: transform(UPPERCASE) });
  }

  if (options.lowercase) {
    sets.push({ id: 'lowercase', characters: transform(LOWERCASE) });
  }

  if (options.digits) {
    sets.push({ id: 'digits', characters: transform(DIGITS) });
  }

  const symbols = getSymbolCharacters(options);
  if (symbols.length > 0) {
    sets.push({ id: 'symbols', characters: symbols });
  }

  const usableSets = sets.filter((set) => set.characters.length > 0);
  if (usableSets.length === 0) {
    throw new Error('at least one character type must be selected');
  }

  return usableSets;
}

function pickCharacter(characters: string): string {
  return characters[getRandomInt(characters.length)] ?? characters[0] ?? '';
}

export function generatePassword(options: GeneratePasswordOptions): GeneratedSecret {
  assertPositiveInteger(options.length, 'length');

  if (options.length > MAX_PASSWORD_LENGTH) {
    throw new Error(`length must be at most ${MAX_PASSWORD_LENGTH}`);
  }

  const sets = getPasswordCharacterSets(options);

  if (options.requireEachSelectedType && options.length < sets.length) {
    throw new Error('length must be at least the number of selected character types');
  }

  const characters: string[] = [];
  const combinedCharacters = sets.map((set) => set.characters).join('');

  if (options.requireEachSelectedType) {
    for (const set of sets) {
      characters.push(pickCharacter(set.characters));
    }
  }

  while (characters.length < options.length) {
    characters.push(pickCharacter(combinedCharacters));
  }

  const value = shuffle(characters).join('');
  const charsetSize = uniqueCharacters(combinedCharacters).length;

  return {
    value,
    label: options.label ?? 'Random password',
    category: options.category ?? 'password',
    bits: Math.floor(calculatePasswordEntropy(charsetSize, options.length)),
    estimatedEntropyBits: calculatePasswordEntropy(charsetSize, options.length),
    metadata: {
      length: options.length,
      charsetSize,
      requiredTypes: options.requireEachSelectedType,
    },
    warnings: options.warnings,
  };
}
