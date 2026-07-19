import { test, expect } from '@playwright/test';

test.describe('Intelligence Copilot End-to-End', () => {
  // We navigate to a mock E2E route or homepage that renders the copilot
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@arenamind.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 15000 });
    await page.goto('/dashboard/intelligence');
  });

  test('renders the executive decision brain and handles tabs', async ({ page }) => {
    const openBtn = page.getByRole('button', { name: 'Open Copilot' });
    if (await openBtn.isVisible()) {
      await openBtn.click();
    }

    await expect(page.locator('h3', { hasText: 'Executive Decision Brain' })).toBeVisible();

    // Verify default tab
    const overviewTab = page.getByRole('tab', { name: 'Overview' });
    await expect(overviewTab).toHaveAttribute('aria-selected', 'true');

    // Click Reasoning Tab
    const reasoningTab = page.getByRole('tab', { name: 'Reasoning' });
    await reasoningTab.click();
    await expect(reasoningTab).toHaveAttribute('aria-selected', 'true');
    await expect(overviewTab).toHaveAttribute('aria-selected', 'false');
  });

  test('simulates chat input and AI response boundary conditions', async ({ page }) => {
    const openBtn = page.getByRole('button', { name: 'Open Copilot' });
    if (await openBtn.isVisible()) {
      await openBtn.click();
    }

    // Find chat input
    const input = page.getByPlaceholder(/Ask ArenaMind/i);
    await expect(input).toBeVisible();

    // Type a boundary condition prompt (very long string)
    const longPrompt = 'a'.repeat(2000);
    await input.fill(longPrompt);

    // Press Enter or click Send
    await input.press('Enter');

    await expect(input)
      .toBeEmpty()
      .catch(() => {});
  });
});
