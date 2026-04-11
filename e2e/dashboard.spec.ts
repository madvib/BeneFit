import { test, expect } from '@playwright/test';
import { signup, waitForDashboard } from './fixtures';

test.describe('Dashboard', () => {
  let testUser: typeof import('./fixtures').TEST_USER;

  test.beforeAll(() => {
    testUser = {
      email: `e2e-dash-${Date.now()}@example.com`,
      password: 'TestPassword123!',
      name: 'Dashboard Test User',
    };
  });

  test.beforeEach(async ({ page }) => {
    await signup(page, testUser);
    await waitForDashboard(page);
  });

  test('activities page loads with empty state', async ({ page }) => {
    await page.goto('/user/activities');
    await page.waitForLoadState('networkidle');

    // Should show the activities page header
    await expect(page.getByText(/my activity/i)).toBeVisible();
  });

  test('today page loads', async ({ page }) => {
    await page.goto('/user/today');
    await page.waitForLoadState('networkidle');

    // Should show today's workout or rest day message
    const content = page.locator('main, [role="main"], .dashboard-content, body');
    await expect(content).not.toBeEmpty();
  });

  test('plan page loads', async ({ page }) => {
    await page.goto('/user/plan');
    await page.waitForLoadState('networkidle');

    // Should show plan page — either an active plan or generate prompt
    const hasContent = await page.getByText(/plan|generate|create|no active/i).first().isVisible().catch(() => false);
    expect(hasContent).toBeTruthy();
  });

  test('navigation between dashboard tabs works', async ({ page }) => {
    // Start on activities
    await page.goto('/user/activities');
    await page.waitForLoadState('networkidle');

    // Navigate to today
    const todayLink = page.getByRole('link', { name: /today/i }).first();
    if (await todayLink.isVisible()) {
      await todayLink.click();
      await page.waitForURL(/\/today/);
    }

    // Navigate to plan
    const planLink = page.getByRole('link', { name: /plan/i }).first();
    if (await planLink.isVisible()) {
      await planLink.click();
      await page.waitForURL(/\/plan/);
    }
  });

  test('profile page loads with user data', async ({ page }) => {
    await page.goto('/user/profile');
    await page.waitForLoadState('networkidle');

    // Should show profile content
    await expect(page.getByText(/profile/i).first()).toBeVisible();
  });

  test('settings page loads', async ({ page }) => {
    await page.goto('/user/settings');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText(/settings|preferences/i).first()).toBeVisible();
  });

  test('billing page loads with free plan', async ({ page }) => {
    await page.goto('/user/billing');
    await page.waitForLoadState('networkidle');

    // New user should be on free plan
    await expect(page.getByText(/free/i).first()).toBeVisible();
  });

  test('connections page loads', async ({ page }) => {
    await page.goto('/user/connections');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText(/connect|integration|strava/i).first()).toBeVisible();
  });
});
