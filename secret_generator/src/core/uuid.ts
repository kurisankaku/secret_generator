import { encodeHex } from './encoding';
import { generateBytes } from './random';
import type { GeneratedSecret } from './types';

const UUID_V4_PATTERN = /^([0-9a-f]{8})-([0-9a-f]{4})-4([0-9a-f]{3})-([89ab][0-9a-f]{3})-([0-9a-f]{12})$/u;

function fallbackUuidV4(): string {
  const bytes = generateBytes(16);
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40;
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;

  const hex = encodeHex(bytes);

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join('-');
}

export function generateUuidV4(): GeneratedSecret {
  const value =
    typeof globalThis.crypto?.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : fallbackUuidV4();

  if (!UUID_V4_PATTERN.test(value)) {
    throw new Error('generated UUID did not match UUID v4 format');
  }

  return {
    value,
    label: 'UUID v4',
    category: 'random',
    bits: 122,
    estimatedEntropyBits: 122,
    format: 'hex',
    metadata: {
      version: 4,
    },
    warnings: [
      'UUID v4 is useful as an identifier. For strong shared secrets, prefer a 256-bit token.',
    ],
  };
}
