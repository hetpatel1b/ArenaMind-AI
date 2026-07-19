import { test, expect } from '@playwright/test';

test.describe('End-to-End User Journeys', () => {
  test('Operator full session journey', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'operator@arenamind.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // 2. Dashboard loads
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 15000 });
    await expect(page.locator('text=FIFA Operations Command')).toBeVisible();

    // 3. Navigate to Incidents
    await page.goto('/dashboard/incidents');
    await expect(page).toHaveURL(/.*\/dashboard\/incidents/);
    await page.waitForTimeout(2000);

    // 4. Logout
    await page.goto('/dashboard/settings');
    const logoutBtn = page.getByText('Logout', { exact: false }).first();
    if ((await logoutBtn.count()) > 0) {
      await logoutBtn.click();
      await expect(page).toHaveURL(/.*\/login/, { timeout: 10000 });
    }
  });
});
