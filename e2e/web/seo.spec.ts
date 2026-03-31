import { test, expect } from '@playwright/test';

test.describe('Web - SEO Kontrolleri', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('meta title mevcut olmalı', async ({ page }) => {
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('meta description mevcut olmalı', async ({ page }) => {
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /.+/);
  });

  test('Open Graph title mevcut olmalı', async ({ page }) => {
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /.+/);
  });

  test('Open Graph description mevcut olmalı', async ({ page }) => {
    const ogDescription = page.locator('meta[property="og:description"]');
    await expect(ogDescription).toHaveAttribute('content', /.+/);
  });

  test('Open Graph type mevcut olmalı', async ({ page }) => {
    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveAttribute('content', /.+/);
  });

  test('canonical URL mevcut olmalı', async ({ page }) => {
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /.+/);
  });
});
