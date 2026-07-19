import { test, expect } from '@playwright/test';

test.describe('Dashboard Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@arenamind.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 15000 });
  });

  test('dashboard renders active match data', async ({ page }) => {
    // Check if the dashboard rendered successfully

    // Check if the dashboard rendered successfully
    await expect(page.locator('text=FIFA Operations Command')).toBeVisible();

    // Ensure the navigation works
    await page.click('a[href="/dashboard/incidents"]');
    await expect(page).toHaveURL(/.*\/dashboard\/incidents/);
  });
});
