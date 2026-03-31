import { test, expect } from '@playwright/test';

test.describe('Admin - Login Sayfası', () => {
  test('login sayfası başarıyla yüklenir', async ({ page }) => {
    const response = await page.goto('/login');
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);
  });

  test('email alanı mevcut olmalı', async ({ page }) => {
    await page.goto('/login');
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    await expect(emailInput).toBeVisible();
  });

  test('password alanı mevcut olmalı', async ({ page }) => {
    await page.goto('/login');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    await expect(passwordInput).toBeVisible();
  });

  test('boş form gönderildiğinde hata mesajı gösterilmeli', async ({ page }) => {
    await page.goto('/login');

    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await submitButton.click();

    // Tarayıcı validasyonu veya uygulama hata mesajı
    const hasValidationError =
      (await page.locator('[role="alert"], .error, [class*="error"], [data-testid="error"]').count()) > 0 ||
      (await page.locator('input:invalid').count()) > 0;

    expect(hasValidationError).toBe(true);
  });
});
