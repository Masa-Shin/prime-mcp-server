// 累乗のmod (base^exponent mod. modulus) を効率的に計算する
export const modPow = (base: bigint, exponent: bigint, modulus: bigint): bigint => {
  let result = 1n;
  base = base % modulus;
  
  while (exponent > 0n) {
    if (exponent % 2n === 1n) {
      result = (result * base) % modulus;
    }
    exponent = exponent / 2n;
    base = (base * base) % modulus;
  }
  
  return result;
};

// 範囲内のランダムなbigintを生成
export const // この関数は決定的Miller-Rabinテストでは使用されなくなった
// 互換性のために残しているが、非推奨
randomBigInt = (min: bigint, max: bigint): bigint => {
  const range = max - min;
  const bits = range.toString(2).length;
  let result: bigint;
  
  do {
    result = BigInt('0b' + Array(bits).fill(0).map(() => Math.round(Math.random())).join(''));
  } while (result > range);
  
  return min + result;
};;

// Miller-Rabin 素数テスト (確率的アルゴリズム)
export const // 2^64未満の数に対して決定的なMiller-Rabin判定を行う
// 基数2,3,5,7,11,13,17,19,23,29,31,37で判定する
// 決定的Miller-Rabin素数判定法
// 2^64未満の数に対して、特定の基数セット [2,3,5,7,11,13,17,19,23,29,31,37] を使用することで
// 確実に判定できることが証明されている
millerRabinTest = (n: bigint): boolean => {
  if (n < 2n) return false;
  if (n === 2n || n === 3n) return true;
  if (n % 2n === 0n) return false;

  // 2^64未満の数に対して決定的な基数のセット
  const deterministicBases = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];

  // n-1 = d * 2^r の形に分解
  let d = n - 1n;
  let r = 0;
  while (d % 2n === 0n) {
    d = d / 2n;
    r++;
  }

  // 各決定的基数でテストを実行
  for (const a of deterministicBases) {
    // aがnより大きい場合はスキップ
    if (a >= n) continue;
    
    let x = modPow(a, d, n);
    
    if (x === 1n || x === n - 1n) continue;
    
    let composite = true;
    for (let j = 0; j < r - 1; j++) {
      x = modPow(x, 2n, n);
      if (x === n - 1n) {
        composite = false;
        break;
      }
    }
    
    if (composite) return false;
  }
  
  return true;
};;

export const isPrimeForBigInteger = (n: bigint): boolean => {
  return millerRabinTest(n);
};
