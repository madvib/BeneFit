import { test as base, expect, type Page } from '@playwright/test';

/** Test user credentials — must exist in the test database */
export const TEST_USER = {
  email: `e2e-test-${Date.now()}@example.com`,
  password: 'TestPassword123!',
  name: 'E2E Test User',
};

/** Reusable auth helpers */
export async function signup(page: Page, user = TEST_USER) {
  await page.goto('/signup');
  await page.getByLabel('Name').fill(user.name);
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password', { exact: true }).fill(user.password);
  await page.getByRole('button', { name: /sign up/i }).click();
}

export async function login(page: Page, user = TEST_USER) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: /sign in/i }).click();
}

/** Wait for navigation away from auth pages */
export async function waitForDashboard(page: Page) {
  await page.waitForURL(/\/(activities|today|plan|coach)/, { timeout: 10_000 });
}

/** Extended test fixture with auth state */
export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    await login(page);
    await waitForDashboard(page);
    await use(page);
  },
});

export { expect };
