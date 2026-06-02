export function calculateTokenEntropy(bits: number): number {
  if (!Number.isInteger(bits) || bits <= 0) {
    throw new Error('bits must be a positive integer');
  }

  return bits;
}

export function calculatePasswordEntropy(charsetSize: number, length: number): number {
  if (!Number.isInteger(charsetSize) || charsetSize < 2) {
    throw new Error('charsetSize must be at least 2');
  }

  if (!Number.isInteger(length) || length <= 0) {
    throw new Error('length must be a positive integer');
  }

  return length * Math.log2(charsetSize);
}

export function calculatePinEntropy(length: number): number {
  if (!Number.isInteger(length) || length <= 0) {
    throw new Error('length must be a positive integer');
  }

  return length * Math.log2(10);
}
