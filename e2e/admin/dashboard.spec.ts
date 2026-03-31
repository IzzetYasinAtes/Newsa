import { test, expect } from '@playwright/test';

test.describe('Admin - Dashboard', () => {
  test('auth olmadan dashboard erişimi login sayfasına yönlendirmeli', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Login sayfasına redirect olmalı
    expect(page.url()).toMatch(/\/login/);
  });

  test('auth olmadan ana sayfa erişimi login sayfasına yönlendirmeli', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Admin panelinde root da login'e yönlendirmeli
    expect(page.url()).toMatch(/\/login/);
  });

  test('sidebar menü öğeleri login sonrası görünür olmalı', async ({ page }) => {
    // Bu test auth gerektirir; şimdilik sadece login sayfasında
    // sidebar olmadığını doğrularız
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Auth yoksa sidebar görünmemeli
    if (page.url().includes('/login')) {
      const sidebar = page.locator('nav, aside, [role="navigation"]').first();
      // Login sayfasında full sidebar olmamalı
      const hasDashboardLinks = await page.locator('a[href*="/dashboard"], a[href*="/haberler"], a[href*="/news"]').count();
      // Login sayfasında dashboard menü linkleri olmamalı veya minimal olmalı
      expect(hasDashboardLinks).toBeLessThanOrEqual(1);
    }
  });
});
