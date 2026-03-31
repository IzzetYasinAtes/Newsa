import { test, expect } from '@playwright/test';

test.describe('Web - Anasayfa', () => {
  test('sayfa başarıyla yüklenir (200)', async ({ page }) => {
    const response = await page.goto('/');
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);
  });

  test('header görünür olmalı', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('footer görünür olmalı', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('ana başlık veya logo mevcut olmalı', async ({ page }) => {
    await page.goto('/');
    const logoOrTitle = page.locator('header').locator('a, img, h1').first();
    await expect(logoOrTitle).toBeVisible();
  });
});
