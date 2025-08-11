# Prime MCP Server

素数に関連した機能を提供するMCP (Model Context Protocol) サーバーです。

## 機能

このMCPサーバーは以下のツールを提供します：

- `is_prime`: 指定した数値が素数かどうかを判定
- `next_prime`: 指定した数値より大きい最小の素数を取得
- `previous_prime`: 指定した数値より小さい最大の素数を取得
- `primes_in_range`: 指定した範囲内のすべての素数を取得
- `prime_factorization`: 指定した数値の素因数分解を実行

## 使用例

### 素数判定
```json
{
  "tool": "is_prime",
  "arguments": {
    "number": 17
  }
}
```

戻り値:
```json
{"number":17,"isPrime":true}
```

### 次の素数を取得
```json
{
  "tool": "next_prime",
  "arguments": {
    "number": 10
  }
}
```

戻り値:
```json
{"originalNumber":10,"nextPrime":11}
```

### 前の素数を取得
```json
{
  "tool": "previous_prime",
  "arguments": {
    "number": 10
  }
}
```

戻り値:
```json
{"originalNumber":10,"previousPrime":7}
```

### 範囲内の素数を取得
```json
{
  "tool": "primes_in_range",
  "arguments": {
    "start": 1,
    "end": 20
  }
}
```

戻り値:
```json
{"range":{"start":1,"end":20},"primes":[2,3,5,7,11,13,17,19],"count":8}
```

### 素因数分解
```json
{
  "tool": "prime_factorization",
  "arguments": {
    "number": 60
  }
}
```

戻り値:
```json
{"number":60,"factors":[{"prime":2,"exponent":2},{"prime":3,"exponent":1},{"prime":5,"exponent":1}],"formatted":"2^2 × 3 × 5"}
```

## 実装の詳細

### 素数判定のアルゴリズム

数値の大きさに応じて異なるアルゴリズムを使用：

- **MAX_SAFE_INTEGER (2^53-1) 以下の数**: 試し割り法
- **MAX_SAFE_INTEGER 超の数**: Miller-Rabin判定法

Miller-Rabin判定法では基数 [2,3,5,7,11,13,17,19,23,29,31,37] を使用しており、2^64以下の数に対しては決定的に素数判定が可能です。

2^64 (18,446,744,073,709,551,616) 以上の数に対しては確率的になるため、稀ですが誤判定の可能性があります。

また、そもそもLLMがそのような大きな数を扱えない可能性もあります。

## セットアップ

1. 依存関係をインストール:
```bash
npm install
```

2. TypeScriptをコンパイル:
```bash
npm run build
```

3. サーバーを実行:
```bash
npm start
```

## 開発

開発時は以下のコマンドでTypeScriptファイルを直接実行できます：

```bash
npm run dev
```
