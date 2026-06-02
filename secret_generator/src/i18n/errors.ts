import type { TFunction } from './types';

const errorMatchers = [
  { match: 'Could not generate secret', key: 'errors.default' },
  { match: 'customSymbols must include', key: 'errors.customSymbols' },
  { match: 'printable ASCII symbols', key: 'errors.printableAscii' },
  { match: 'prefix may only contain', key: 'errors.prefix' },
  { match: 'environment variable name', key: 'errors.envKey' },
  { match: 'selected character types', key: 'errors.selectedTypes' },
  { match: 'at least one character type', key: 'errors.characterType' },
] as const;

export function localizeErrorMessage(message: string | null, t: TFunction): string | null {
  if (!message) {
    return null;
  }

  const match = errorMatchers.find((candidate) => message.includes(candidate.match));
  return match ? t(match.key) : message;
}
