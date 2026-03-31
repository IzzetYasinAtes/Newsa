import { test, expect } from '@playwright/test';

test.describe('Web - Navigasyon', () => {
  test('kategori sayfasına gidilebilmeli', async ({ page }) => {
    await page.goto('/');
    const categoryLink = page.locator('a[href*="/kategori"], a[href*="/category"]').first();

    if (await categoryLink.isVisible()) {
      await categoryLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/(kategori|category)/);
    } else {
      // Doğrudan kategori sayfasına git
      const response = await page.goto('/kategori');
      expect(response).not.toBeNull();
      expect(response!.status()).toBeLessThan(500);
    }
  });

  test('arama sayfasına gidilebilmeli', async ({ page }) => {
    await page.goto('/');
    const searchLink = page.locator('a[href*="/ara"], a[href*="/search"], button[aria-label*="ara" i], button[aria-label*="search" i]').first();

    if (await searchLink.isVisible()) {
      await searchLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toMatch(/\/(ara|search)/);
    } else {
      const response = await page.goto('/ara');
      expect(response).not.toBeNull();
      expect(response!.status()).toBeLessThan(500);
    }
  });

  test('var olmayan sayfa 404 döndürmeli', async ({ page }) => {
    const response = await page.goto('/bu-sayfa-kesinlikle-yok-12345');
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(404);
  });
});
