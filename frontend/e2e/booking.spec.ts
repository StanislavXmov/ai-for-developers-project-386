import { test, expect } from '@playwright/test';

test.describe('Booking flow', () => {
  test('should complete full booking flow', async ({ page }) => {
    await page.goto('/create');

    await expect(page.getByRole('heading', { name: /create meeting/i })).toBeVisible();

    await page.getByText('Consultation', { exact: true }).click();

    await expect(page.getByRole('heading', { name: /select a date & time/i })).toBeVisible();

    const calendar = page.getByRole('grid', { name: /\w+ \d{4}/ });
    const availableDate = calendar.locator('button:not([disabled])').first();

    await expect(availableDate).toBeVisible();
    await availableDate.click();

    const firstSlot = page.getByRole('button', { name: /\d{1,2}:\d{2}/ }).first();
    await expect(firstSlot).toBeVisible();
    await firstSlot.click();

    await expect(page.getByText('Complete Your Booking')).toBeVisible();

    await page.fill('#name', 'John Doe');
    await page.fill('#email', 'john@example.com');

    await page.getByRole('button', { name: /confirm booking/i }).click();

    await expect(page.getByText('Booking Confirmed!')).toBeVisible();
    await expect(page.getByText(/confirmation sent to/i)).toBeVisible();
  });
});
