export const isPrimeForSmallInteger = (n: number): boolean => {
  if (n < 2) return false;
  if (n === 2 || n === 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  
  // 6k ± 1 形式の数のみをチェック
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  
  return true;
};

export const getNextPrime = (n: number, isPrimeFn: (_candidate: number) => boolean): number => {
  let candidate = n + 1;
  while (!isPrimeFn(candidate)) {
    candidate++;
  }
  return candidate;
};

export const getPreviousPrime = (n: number, isPrimeFn: (_candidate: number) => boolean): number | null => {
  if (n <= 2) return null;
  let candidate = n - 1;
  while (candidate >= 2 && !isPrimeFn(candidate)) {
    candidate--;
  }
  return candidate >= 2 ? candidate : null;
};

export const getPrimesInRange = (start: number, end: number, isPrimeFn: (_candidate: number) => boolean): number[] => {
  const primes: number[] = [];
  for (let i = Math.max(2, start); i <= end; i++) {
    if (isPrimeFn(i)) {
      primes.push(i);
    }
  }
  return primes;
};

export interface PrimeFactor {
  prime: number;
  exponent: number;
}

export const primeFactorization = (n: number): PrimeFactor[] => {
  if (n < 2) {
    return [];
  }

  const factors: PrimeFactor[] = [];
  let remaining = n;

  // 2で割り切れる回数を数える
  if (remaining % 2 === 0) {
    let exponent = 0;
    while (remaining % 2 === 0) {
      remaining = remaining / 2;
      exponent++;
    }
    factors.push({ prime: 2, exponent });
  }

  // 3以上の奇数で試行除法
  for (let i = 3; i * i <= remaining; i += 2) {
    if (remaining % i === 0) {
      let exponent = 0;
      while (remaining % i === 0) {
        remaining = remaining / i;
        exponent++;
      }
      factors.push({ prime: i, exponent });
    }
  }

  // 残りが1より大きい場合、それは素数
  if (remaining > 1) {
    factors.push({ prime: remaining, exponent: 1 });
  }

  return factors;
};

export const formatPrimeFactorization = (factors: PrimeFactor[]): string => {
  if (factors.length === 0) {
    return '1';
  }

  return factors
    .map(factor => 
      factor.exponent === 1 
        ? factor.prime.toString()
        : `${factor.prime}^${factor.exponent}`
    )
    .join(' × ');
};