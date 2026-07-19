import { test, expect } from '@playwright/test';

test.describe('Governance Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@arenamind.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 15000 });
  });

  test('views governance settings', async ({ page }) => {
    await page.goto('/dashboard/governance');

    // Expect the page to render without System Uninitialized error
    await expect(page.locator('text=System Uninitialized')).not.toBeVisible();

    // We assume the governance workspace renders successfully
    await expect(page).toHaveURL(/.*\/dashboard\/governance/);
    await page.waitForTimeout(2000);
  });
});
