import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { spawn } from 'child_process';
import { ChildProcess } from 'child_process';

describe('MCP Prime Server Integration Tests', () => {
  let server: ChildProcess;

  const sendRequest = (method: string, params: any = {}): Promise<any> => {
    const request = {
      jsonrpc: '2.0',
      id: Date.now(),
      method,
      params
    };

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timeout')), 5000);

      server.stdout!.once('data', (data) => {
        clearTimeout(timeout);
        try {
          const response = JSON.parse(data.toString());
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });

      server.stdin!.write(JSON.stringify(request) + '\n');
    });
  };

  beforeEach(async () => {
    server = spawn('node', ['dist/index.js'], { stdio: ['pipe', 'pipe', 'inherit'] });
    
    // Initialize server
    await sendRequest('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: { tools: {} },
      clientInfo: { name: 'jest-test', version: '1.0.0' }
    });
  });

  afterEach(() => {
    if (server) {
      server.kill();
    }
  });

  test('should list all 5 tools', async () => {
    const result = await sendRequest('tools/list');
    
    expect(result.result.tools).toHaveLength(5);
    const toolNames = result.result.tools.map((t: any) => t.name);
    expect(toolNames).toContain('is_prime');
    expect(toolNames).toContain('next_prime');
    expect(toolNames).toContain('previous_prime');
    expect(toolNames).toContain('primes_in_range');
    expect(toolNames).toContain('prime_factorization');
  });

  test('should correctly identify prime numbers', async () => {
    const result = await sendRequest('tools/call', {
      name: 'is_prime',
      arguments: { number: 17 }
    });

    const data = JSON.parse(result.result.content[0].text);
    expect(data).toEqual({ number: 17, isPrime: true });
  });

  test('should correctly identify composite numbers', async () => {
    const result = await sendRequest('tools/call', {
      name: 'is_prime',
      arguments: { number: 15 }
    });

    const data = JSON.parse(result.result.content[0].text);
    expect(data).toEqual({ number: 15, isPrime: false });
  });

  test('should find next prime correctly', async () => {
    const result = await sendRequest('tools/call', {
      name: 'next_prime',
      arguments: { number: 10 }
    });

    const data = JSON.parse(result.result.content[0].text);
    expect(data).toEqual({ originalNumber: 10, nextPrime: 11 });
  });

  test('should find previous prime correctly', async () => {
    const result = await sendRequest('tools/call', {
      name: 'previous_prime',
      arguments: { number: 10 }
    });

    const data = JSON.parse(result.result.content[0].text);
    expect(data).toEqual({ originalNumber: 10, previousPrime: 7 });
  });

  test('should find primes in range correctly', async () => {
    const result = await sendRequest('tools/call', {
      name: 'primes_in_range',
      arguments: { start: 1, end: 20 }
    });

    const data = JSON.parse(result.result.content[0].text);
    const expectedPrimes = [2, 3, 5, 7, 11, 13, 17, 19];
    expect(data).toEqual({
      range: { start: 1, end: 20 },
      primes: expectedPrimes,
      count: expectedPrimes.length
    });
  });

  test('should perform prime factorization correctly', async () => {
    const result = await sendRequest('tools/call', {
      name: 'prime_factorization',
      arguments: { number: 12 }
    });

    const data = JSON.parse(result.result.content[0].text);
    expect(data.number).toBe(12);
    expect(Array.isArray(data.factors)).toBe(true);
    expect(typeof data.formatted).toBe('string');
    expect(data.factors.length).toBeGreaterThan(0);
  });

  test('should handle BigInt strings for is_prime', async () => {
    const result = await sendRequest('tools/call', {
      name: 'is_prime',
      arguments: { number: '17015152867341257683967263429849' }
    });

    const data = JSON.parse(result.result.content[0].text);
    expect(data.number).toBe('17015152867341257683967263429849');
    expect(typeof data.isPrime).toBe('boolean');
  });
});