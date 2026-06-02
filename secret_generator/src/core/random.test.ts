import { describe, expect, it } from 'vitest';
import { generateBytes, getRandomInt, shuffle } from './random';

describe('random', () => {
  it('generates the requested number of bytes', () => {
    expect(generateBytes(32)).toHaveLength(32);
  });

  it('rejects invalid byte lengths', () => {
    expect(() => generateBytes(0)).toThrow(/positive integer/u);
    expect(() => generateBytes(1.5)).toThrow(/positive integer/u);
    expect(() => generateBytes(1025)).toThrow(/at most/u);
  });

  it('returns an unbiased-range integer', () => {
    for (let index = 0; index < 100; index += 1) {
      const value = getRandomInt(10);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(10);
    }
  });

  it('shuffles without mutating the input', () => {
    const input = [1, 2, 3, 4, 5];
    const output = shuffle(input);

    expect(input).toEqual([1, 2, 3, 4, 5]);
    expect(output.sort()).toEqual(input);
  });
});
