import { MAX_GENERATED_BYTES, assertPositiveInteger, assertSafeInteger } from './validation';

const GET_RANDOM_VALUES_QUOTA = 65_536;
const UINT32_RANGE = 0x1_0000_0000;

function getCrypto(): Crypto {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('Web Crypto API is not available');
  }

  return globalThis.crypto;
}

function randomUint32(): number {
  const value = new Uint32Array(1);
  getCrypto().getRandomValues(value);
  return value[0] ?? 0;
}

export function generateBytes(byteLength: number): Uint8Array {
  assertPositiveInteger(byteLength, 'byteLength');

  if (byteLength > MAX_GENERATED_BYTES) {
    throw new Error(`byteLength must be at most ${MAX_GENERATED_BYTES}`);
  }

  const bytes = new Uint8Array(byteLength);
  const cryptoSource = getCrypto();

  for (let offset = 0; offset < byteLength; offset += GET_RANDOM_VALUES_QUOTA) {
    const chunk = bytes.subarray(offset, offset + GET_RANDOM_VALUES_QUOTA);
    cryptoSource.getRandomValues(chunk);
  }

  return bytes;
}

export function getRandomInt(maxExclusive: number): number {
  assertSafeInteger(maxExclusive, 'maxExclusive');

  if (maxExclusive < 2 || maxExclusive > UINT32_RANGE) {
    throw new Error('maxExclusive must be between 2 and 4294967296');
  }

  const limit = Math.floor(UINT32_RANGE / maxExclusive) * maxExclusive;

  while (true) {
    const value = randomUint32();
    if (value < limit) {
      return value % maxExclusive;
    }
  }
}

export function shuffle<T>(items: readonly T[]): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = getRandomInt(index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex] as T, shuffled[index] as T];
  }

  return shuffled;
}
