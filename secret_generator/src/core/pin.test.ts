import { describe, expect, it } from 'vitest';
import { generatePin } from './pin';

describe('pin', () => {
  it('generates numeric PINs with the requested length', () => {
    const pin = generatePin({ length: 8, allowLeadingZero: true });

    expect(pin.value).toMatch(/^[0-9]{8}$/u);
    expect(pin.category).toBe('numeric-code');
  });

  it('can disallow leading zeroes', () => {
    for (let index = 0; index < 30; index += 1) {
      const pin = generatePin({ length: 4, allowLeadingZero: false });
      expect(pin.value[0]).not.toBe('0');
    }
  });

  it('rejects unsupported lengths', () => {
    expect(() => generatePin({ length: 5 as 4, allowLeadingZero: true })).toThrow(/length/u);
  });
});
