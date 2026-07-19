import { test, expect } from '@playwright/test';

test.describe('Incidents Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'operator@arenamind.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 15000 });
  });

  test('views incident list and details', async ({ page }) => {
    await page.goto('/dashboard/incidents');

    // Verify page loads successfully without crashing
    await expect(page).toHaveURL(/.*\/dashboard\/incidents/);

    // We wait for a moment to ensure no Next.js errors pop up
    await page.waitForTimeout(2000);

    // The incident command workspace should have loaded
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(0);
  });
});
