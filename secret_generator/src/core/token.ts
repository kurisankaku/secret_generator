import { encodeSecret } from './encoding';
import { calculateTokenEntropy } from './entropy';
import { generateBytes } from './random';
import type { GeneratedSecret, SecretFormat } from './types';

export type GenerateTokenOptions = {
  bits: number;
  format: SecretFormat;
  prefix?: string;
  label?: string;
  category?: GeneratedSecret['category'];
  warnings?: string[];
};

export function generateToken(options: GenerateTokenOptions): GeneratedSecret {
  if (!Number.isInteger(options.bits) || options.bits <= 0 || options.bits % 8 !== 0) {
    throw new Error('bits must be a positive multiple of 8');
  }

  const bytes = options.bits / 8;
  const encoded = encodeSecret(generateBytes(bytes), options.format);
  const prefix = options.prefix ?? '';

  return {
    value: `${prefix}${encoded}`,
    label: options.label ?? 'Random token',
    category: options.category ?? 'token',
    bits: options.bits,
    bytes,
    format: options.format,
    estimatedEntropyBits: calculateTokenEntropy(options.bits),
    metadata: {
      prefixLength: prefix.length,
    },
    warnings: options.warnings,
  };
}
