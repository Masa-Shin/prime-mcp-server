import { describe, test, expect } from 'vitest';
import { 
  isPrimeForSmallInteger,
  getNextPrime,
  getPreviousPrime,
  getPrimesInRange,
  primeFactorization,
  formatPrimeFactorization
} from '../src/primeUtils.js';

describe('isPrimeForSmallInteger', () => {
  test('should return false for numbers less than 2', () => {
    expect(isPrimeForSmallInteger(-1)).toBe(false);
    expect(isPrimeForSmallInteger(0)).toBe(false);
    expect(isPrimeForSmallInteger(1)).toBe(false);
  });

  test('should return true for prime numbers', () => {
    expect(isPrimeForSmallInteger(2)).toBe(true);
    expect(isPrimeForSmallInteger(3)).toBe(true);
    expect(isPrimeForSmallInteger(5)).toBe(true);
    expect(isPrimeForSmallInteger(7)).toBe(true);
    expect(isPrimeForSmallInteger(11)).toBe(true);
    expect(isPrimeForSmallInteger(13)).toBe(true);
    expect(isPrimeForSmallInteger(17)).toBe(true);
    expect(isPrimeForSmallInteger(19)).toBe(true);
    expect(isPrimeForSmallInteger(97)).toBe(true);
  });

  test('should return false for composite numbers', () => {
    expect(isPrimeForSmallInteger(4)).toBe(false);
    expect(isPrimeForSmallInteger(6)).toBe(false);
    expect(isPrimeForSmallInteger(8)).toBe(false);
    expect(isPrimeForSmallInteger(9)).toBe(false);
    expect(isPrimeForSmallInteger(10)).toBe(false);
    expect(isPrimeForSmallInteger(15)).toBe(false);
    expect(isPrimeForSmallInteger(25)).toBe(false);
    expect(isPrimeForSmallInteger(100)).toBe(false);
  });
});

describe('getNextPrime', () => {
  const mockIsPrime = (n: number): boolean => isPrimeForSmallInteger(n);

  test('should find the next prime number', () => {
    expect(getNextPrime(1, mockIsPrime)).toBe(2);
    expect(getNextPrime(2, mockIsPrime)).toBe(3);
    expect(getNextPrime(3, mockIsPrime)).toBe(5);
    expect(getNextPrime(10, mockIsPrime)).toBe(11);
    expect(getNextPrime(14, mockIsPrime)).toBe(17);
  });
});

describe('getPreviousPrime', () => {
  const mockIsPrime = (n: number): boolean => isPrimeForSmallInteger(n);

  test('should return null for numbers <= 2', () => {
    expect(getPreviousPrime(1, mockIsPrime)).toBe(null);
    expect(getPreviousPrime(2, mockIsPrime)).toBe(null);
  });

  test('should find the previous prime number', () => {
    expect(getPreviousPrime(3, mockIsPrime)).toBe(2);
    expect(getPreviousPrime(10, mockIsPrime)).toBe(7);
    expect(getPreviousPrime(20, mockIsPrime)).toBe(19);
    expect(getPreviousPrime(14, mockIsPrime)).toBe(13);
  });
});

describe('getPrimesInRange', () => {
  const mockIsPrime = (n: number): boolean => isPrimeForSmallInteger(n);

  test('should find all primes in range', () => {
    expect(getPrimesInRange(1, 10, mockIsPrime)).toEqual([2, 3, 5, 7]);
    expect(getPrimesInRange(10, 20, mockIsPrime)).toEqual([11, 13, 17, 19]);
    expect(getPrimesInRange(2, 2, mockIsPrime)).toEqual([2]);
  });

  test('should return empty array when no primes in range', () => {
    expect(getPrimesInRange(24, 28, mockIsPrime)).toEqual([]);
    expect(getPrimesInRange(1, 1, mockIsPrime)).toEqual([]);
  });
});

describe('primeFactorization', () => {
  test('should return empty array for numbers < 2', () => {
    expect(primeFactorization(0)).toEqual([]);
    expect(primeFactorization(1)).toEqual([]);
    expect(primeFactorization(-5)).toEqual([]);
  });

  test('should factorize prime numbers', () => {
    expect(primeFactorization(2)).toEqual([{ prime: 2, exponent: 1 }]);
    expect(primeFactorization(3)).toEqual([{ prime: 3, exponent: 1 }]);
    expect(primeFactorization(17)).toEqual([{ prime: 17, exponent: 1 }]);
  });

  test('should factorize composite numbers', () => {
    expect(primeFactorization(4)).toEqual([{ prime: 2, exponent: 2 }]);
    expect(primeFactorization(6)).toEqual([
      { prime: 2, exponent: 1 },
      { prime: 3, exponent: 1 }
    ]);
    expect(primeFactorization(12)).toEqual([
      { prime: 2, exponent: 2 },
      { prime: 3, exponent: 1 }
    ]);
    expect(primeFactorization(60)).toEqual([
      { prime: 2, exponent: 2 },
      { prime: 3, exponent: 1 },
      { prime: 5, exponent: 1 }
    ]);
  });

  test('should handle perfect squares', () => {
    expect(primeFactorization(9)).toEqual([{ prime: 3, exponent: 2 }]);
    expect(primeFactorization(25)).toEqual([{ prime: 5, exponent: 2 }]);
    expect(primeFactorization(100)).toEqual([
      { prime: 2, exponent: 2 },
      { prime: 5, exponent: 2 }
    ]);
  });

  test('should handle larger numbers', () => {
    expect(primeFactorization(1000)).toEqual([
      { prime: 2, exponent: 3 },
      { prime: 5, exponent: 3 }
    ]);
  });
});

describe('formatPrimeFactorization', () => {
  test('should format empty factorization', () => {
    expect(formatPrimeFactorization([])).toBe('1');
  });

  test('should format single prime factor', () => {
    expect(formatPrimeFactorization([{ prime: 7, exponent: 1 }])).toBe('7');
    expect(formatPrimeFactorization([{ prime: 2, exponent: 3 }])).toBe('2^3');
  });

  test('should format multiple prime factors', () => {
    expect(formatPrimeFactorization([
      { prime: 2, exponent: 2 },
      { prime: 3, exponent: 1 },
      { prime: 5, exponent: 1 }
    ])).toBe('2^2 × 3 × 5');
  });

  test('should handle mixed exponents', () => {
    expect(formatPrimeFactorization([
      { prime: 2, exponent: 1 },
      { prime: 3, exponent: 2 },
      { prime: 7, exponent: 1 }
    ])).toBe('2 × 3^2 × 7');
  });
});