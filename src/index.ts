#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { 
  isPrimeForSmallInteger, 
  getNextPrime, 
  getPreviousPrime, 
  getPrimesInRange,
  primeFactorization,
  formatPrimeFactorization
} from './primeUtils.js';
import { isPrimeForBigInteger } from './millerRabin.js';

const isPrime = (n: number | bigint): boolean => {
  const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER; // 9,007,199,254,740,991
  
  // bigint型の場合はBigIntとして処理
  if (typeof n === 'bigint') {
    return isPrimeForBigInteger(n);
  }
  
  // numberで2^53以上の場合はBigIntとして処理
  if (n > MAX_SAFE_INTEGER) {
    const bigIntN = BigInt(n);
    return isPrimeForBigInteger(bigIntN);
  } else {
    return isPrimeForSmallInteger(n);
  }
};

const server = new Server(
  {
    name: 'prime-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'is_prime',
        description: 'Check if a given number is prime',
        inputSchema: {
          type: 'object',
          properties: {
            number: {
              type: ['number', 'bigint'],
              description: 'The number to check for primality',
            },
          },
          required: ['number'],
        },
      },
      {
        name: 'next_prime',
        description: 'Find the next prime number after a given number',
        inputSchema: {
          type: 'object',
          properties: {
            number: {
              type: 'number',
              description: 'The number to find the next prime after',
            },
          },
          required: ['number'],
        },
      },
      {
        name: 'previous_prime',
        description: 'Find the previous prime number before a given number',
        inputSchema: {
          type: 'object',
          properties: {
            number: {
              type: 'number',
              description: 'The number to find the previous prime before',
            },
          },
          required: ['number'],
        },
      },
      {
        name: 'primes_in_range',
        description: 'Find all prime numbers in a given range',
        inputSchema: {
          type: 'object',
          properties: {
            start: {
              type: 'number',
              description: 'The start of the range (inclusive)',
            },
            end: {
              type: 'number',
              description: 'The end of the range (inclusive)',
            },
          },
          required: ['start', 'end'],
        },
      },
      {
        name: 'prime_factorization',
        description: 'Perform prime factorization of a given number',
        inputSchema: {
          type: 'object',
          properties: {
            number: {
              type: 'number',
              description: 'The number to factorize into prime factors',
            },
          },
          required: ['number'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'is_prime': {
      const num = args?.number as number | bigint;
      
      const isPrimeResult = isPrime(num);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              num,
              isPrime: isPrimeResult
            }),
          },
        ],
      };
    }

    case 'next_prime': {
      const number = args?.number as number;
      if (typeof number !== 'number' || !Number.isInteger(number)) {
        throw new Error('Number must be an integer');
      }
      
      const nextPrime = getNextPrime(number, isPrime);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              originalNumber: number,
              nextPrime
            }),
          },
        ],
      };
    }

    case 'previous_prime': {
      const number = args?.number as number;
      if (typeof number !== 'number' || !Number.isInteger(number)) {
        throw new Error('Number must be an integer');
      }
      
      const previousPrime = getPreviousPrime(number, isPrime);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              originalNumber: number,
              previousPrime
            }),
          },
        ],
      };
    }

    case 'primes_in_range': {
      const start = args?.start as number;
      const end = args?.end as number;
      
      if (typeof start !== 'number' || typeof end !== 'number' || 
          !Number.isInteger(start) || !Number.isInteger(end)) {
        throw new Error('Start and end must be integers');
      }
      
      if (start > end) {
        throw new Error('Start must be less than or equal to end');
      }
      
      const primes = getPrimesInRange(start, end, isPrime);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              range: { start, end },
              primes,
              count: primes.length
            }),
          },
        ],
      };
    }

    case 'prime_factorization': {
      const number = args?.number as number;
      
      if (typeof number !== 'number' || !Number.isInteger(number)) {
        throw new Error('Number must be an integer');
      }
      
      if (number < 1) {
        throw new Error('Number must be positive');
      }
      
      const factors = primeFactorization(number);
      const formatted = formatPrimeFactorization(factors);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              number,
              factors,
              formatted
            }),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

const runServer = async (): Promise<void> => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Prime MCP Server running on stdio');
};

runServer().catch(console.error);
