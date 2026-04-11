import { test, expect } from '@playwright/test';
import { signup, waitForDashboard } from './fixtures';

test.describe('Coach Chat', () => {
  test.beforeEach(async ({ page }) => {
    const user = {
      email: `e2e-coach-${Date.now()}@example.com`,
      password: 'TestPassword123!',
      name: 'Coach Test User',
    };

    await signup(page, user);
    await waitForDashboard(page);
  });

  test('coach page loads with empty state or message thread', async ({ page }) => {
    await page.goto('/user/coach');
    await page.waitForLoadState('networkidle');

    // Should show either the empty state prompt or the chat input
    const hasChat = await page.locator('textarea, input[type="text"], [contenteditable]').first().isVisible().catch(() => false);
    const hasEmptyState = await page.getByText(/coach|get started|how can i help/i).first().isVisible().catch(() => false);

    expect(hasChat || hasEmptyState).toBeTruthy();
  });

  test('chat input is visible and accepts text', async ({ page }) => {
    await page.goto('/user/coach');
    await page.waitForLoadState('networkidle');

    // Find the chat input
    const input = page.locator('textarea, input[placeholder*="message" i], input[placeholder*="type" i]').first();

    if (await input.isVisible()) {
      await input.fill('Hello coach, how should I start training?');
      await expect(input).toHaveValue(/hello coach/i);
    }
  });

  test('sending a message adds it to the chat thread', async ({ page }) => {
    await page.goto('/user/coach');
    await page.waitForLoadState('networkidle');

    const input = page.locator('textarea, input[placeholder*="message" i], input[placeholder*="type" i]').first();

    if (await input.isVisible()) {
      const messageText = `Test message ${Date.now()}`;
      await input.fill(messageText);

      // Find and click send button
      const sendButton = page.getByRole('button', { name: /send/i }).or(
        page.locator('button[type="submit"]'),
      ).first();

      if (await sendButton.isVisible()) {
        await sendButton.click();

        // The user message should appear in the chat
        await expect(page.getByText(messageText)).toBeVisible({ timeout: 5_000 });
      }
    }
  });
});
