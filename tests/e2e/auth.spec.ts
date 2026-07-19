import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test('successful login as administrator', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login'); // Depending on ArenaMind routing

    // Fill credentials matching the DB mock
    await page.fill('input[type="email"]', 'admin@arenamind.com');
    await page.fill('input[type="password"]', 'password123');

    // Submit
    await page.click('button[type="submit"]');

    // Should redirect to dashboard after cinematic transition
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 15000 });
  });

  test('invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'wrong@email.com');
    await page.fill('input[type="password"]', 'wrongpass');
    await page.click('button[type="submit"]');

    // Should show error message
    // Just verifying it doesn't navigate away
    await expect(page).toHaveURL(/.*\/login/);
  });
});
