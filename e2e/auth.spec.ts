import { test, expect } from '@playwright/test';
import { signup, login, waitForDashboard, TEST_USER } from './fixtures';

test.describe('Authentication', () => {
  test('landing page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/bene/i);
  });

  test('login page renders form', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('signup page renders form', async ({ page }) => {
    await page.goto('/signup');

    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible();
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('nonexistent@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Should stay on login page and show error
    await expect(page.getByText(/invalid|incorrect|error|failed/i)).toBeVisible({ timeout: 5_000 });
  });

  test('signup creates account and redirects to dashboard', async ({ page }) => {
    const uniqueUser = {
      ...TEST_USER,
      email: `e2e-signup-${Date.now()}@example.com`,
    };

    await signup(page, uniqueUser);
    await waitForDashboard(page);

    // Should be on a protected route
    expect(page.url()).toMatch(/\/(activities|today|plan)/);
  });

  test('login with valid credentials redirects to dashboard', async ({ page }) => {
    // First signup to ensure user exists
    const uniqueUser = {
      ...TEST_USER,
      email: `e2e-login-${Date.now()}@example.com`,
    };

    await signup(page, uniqueUser);
    await waitForDashboard(page);

    // Logout
    await page.goto('/?from=logout');

    // Now login
    await login(page, uniqueUser);
    await waitForDashboard(page);

    expect(page.url()).toMatch(/\/(activities|today|plan)/);
  });

  test('unauthenticated user cannot access protected routes', async ({ page }) => {
    await page.goto('/user/activities');

    // Should redirect to login or show unauthorized
    await page.waitForURL(/\/(login|signup|\?)/, { timeout: 5_000 }).catch(() => {
      // Some apps show content with auth modals instead of redirecting
    });

    // Either redirected to login or the page shows auth prompt
    const url = page.url();
    const hasAuthPrompt = await page.getByText(/sign in|log in|unauthorized/i).isVisible().catch(() => false);

    expect(url.includes('login') || url.includes('signup') || hasAuthPrompt).toBeTruthy();
  });
});
