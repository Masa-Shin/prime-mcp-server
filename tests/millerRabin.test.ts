import { describe, test, expect } from 'vitest';
import { modPow,
  millerRabinTest,
  isPrimeForBigInteger
} from '../src/millerRabin.js';

describe('modPow', () => {
  test('should compute modular exponentiation correctly', () => {
    expect(modPow(10n, 0n, 7n)).toBe(1n); // 10^0 mod 7 = 1 mod 7 = 1
    expect(modPow(2n, 3n, 5n)).toBe(3n); // 2^3 mod 5 = 8 mod 5 = 3
    expect(modPow(5n, 2n, 13n)).toBe(12n);
    expect(modPow(2n, 1227n, 17n)).toBe(8n);
    expect(modPow(1234n, 5678n, 9012n)).toBe(3652n);
  });
});

describe('millerRabinTest', () => {
  test('should return false for numbers < 2', () => {
    expect(millerRabinTest(-1n)).toBe(false);
    expect(millerRabinTest(0n)).toBe(false);
    expect(millerRabinTest(1n)).toBe(false);
  });
  test('should return true for 2 and 3', () => {
    expect(millerRabinTest(2n)).toBe(true);
    expect(millerRabinTest(3n)).toBe(true);
  });
  test('should identify known primes correctly', () => {
    const knownPrimes = [5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 97n, 101n];
    knownPrimes.forEach(prime => {
      expect(millerRabinTest(prime)).toBe(true);
    });
  });
  test('should identify known composites correctly', () => {
    const knownComposites = [9n, 15n, 21n, 25n, 27n, 33n, 35n, 39n, 49n, 51n];
    knownComposites.forEach(composite => {
      expect(millerRabinTest(composite)).toBe(false);
    });
  });
  test('should handle larger numbers deterministically', () => {
    // 1009 is prime
    expect(millerRabinTest(1009n)).toBe(true);
    // 1010 = 2 * 5 * 101 is composite
    expect(millerRabinTest(1010n)).toBe(false);
    // Test some larger known primes and composites
    expect(millerRabinTest(982451653n)).toBe(true); // Known prime
    expect(millerRabinTest(982451654n)).toBe(false); // Composite
  });
});

describe('isPrimeForBigInteger', () => {
  test('should use Miller-Rabin test', () => {
    expect(isPrimeForBigInteger(17n)).toBe(true);
    expect(isPrimeForBigInteger(18n)).toBe(false);
    expect(isPrimeForBigInteger(97n)).toBe(true);
    expect(isPrimeForBigInteger(99n)).toBe(false);
  });

  test('should handle large primes', () => {
    expect(isPrimeForBigInteger(982451653n)).toBe(true);
    expect(isPrimeForBigInteger(9824516541n)).toBe(false);
    expect(isPrimeForBigInteger(11133231134351111n)).toBe(true);
    expect(isPrimeForBigInteger(17015152867341257683967263429849n)).toBe(false); // 4124942771401957^2
    expect(isPrimeForBigInteger(1170151528673412576283396711263421n)).toBe(true);
  });
});
