import { test, expect } from '@playwright/test';

test.describe('API - Health & CORS', () => {
  test('health endpoint 200 döndürmeli', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('status');
  });

  test('CORS headers mevcut olmalı', async ({ request }) => {
    const response = await request.get('/api/health');
    const headers = response.headers();

    // En az bir CORS header mevcut olmalı
    const hasCorsHeaders =
      'access-control-allow-origin' in headers ||
      'access-control-allow-methods' in headers ||
      'access-control-allow-headers' in headers;

    expect(hasCorsHeaders).toBe(true);
  });

  test('OPTIONS preflight isteği başarılı olmalı', async ({ request }) => {
    const response = await request.fetch('/api/health', {
      method: 'OPTIONS',
    });

    // 200 veya 204 kabul edilir
    expect([200, 204]).toContain(response.status());
  });
});
