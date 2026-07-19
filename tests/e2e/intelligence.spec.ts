import { test, expect } from '@playwright/test';

test.describe('Intelligence Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'analyst@arenamind.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 15000 });
  });

  test('views intelligence center', async ({ page }) => {
    await page.goto('/dashboard/intelligence');

    // Check if it loads
    await expect(page).toHaveURL(/.*\/dashboard\/intelligence/);
    await page.waitForTimeout(2000);
  });
});
