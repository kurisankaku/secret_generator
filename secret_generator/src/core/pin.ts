import { calculatePinEntropy } from './entropy';
import { getRandomInt } from './random';
import type { GeneratedSecret } from './types';
import { assertOneOf } from './validation';

export type PinLength = 4 | 6 | 8 | 12;

export type GeneratePinOptions = {
  length: PinLength;
  allowLeadingZero: boolean;
  avoidRepeating?: boolean;
  avoidSequential?: boolean;
  label?: string;
  warnings?: string[];
};

const PIN_LENGTHS = [4, 6, 8, 12] as const;
const MAX_PIN_ATTEMPTS = 1_000;

function hasRepeatingOnly(value: string): boolean {
  return value.length > 1 && value.split('').every((digit) => digit === value[0]);
}

function isSequential(value: string): boolean {
  const digits = value.split('').map(Number);
  const ascending = digits.every((digit, index) => index === 0 || digit === digits[index - 1] + 1);
  const descending = digits.every((digit, index) => index === 0 || digit === digits[index - 1] - 1);

  return ascending || descending;
}

function generateCandidate(length: PinLength, allowLeadingZero: boolean): string {
  const digits: string[] = [];

  for (let index = 0; index < length; index += 1) {
    if (index === 0 && !allowLeadingZero) {
      digits.push(String(getRandomInt(9) + 1));
    } else {
      digits.push(String(getRandomInt(10)));
    }
  }

  return digits.join('');
}

export function generatePin(options: GeneratePinOptions): GeneratedSecret {
  assertOneOf(options.length, PIN_LENGTHS, 'length');

  for (let attempt = 0; attempt < MAX_PIN_ATTEMPTS; attempt += 1) {
    const value = generateCandidate(options.length, options.allowLeadingZero);
    const rejectedRepeating = options.avoidRepeating && hasRepeatingOnly(value);
    const rejectedSequential = options.avoidSequential && isSequential(value);

    if (!rejectedRepeating && !rejectedSequential) {
      return {
        value,
        label: options.label ?? 'PIN',
        category: 'numeric-code',
        bits: Math.floor(calculatePinEntropy(options.length)),
        estimatedEntropyBits: calculatePinEntropy(options.length),
        metadata: {
          length: options.length,
          allowLeadingZero: options.allowLeadingZero,
        },
        warnings: options.warnings,
      };
    }
  }

  throw new Error('could not generate a PIN with the selected constraints');
}
