import { test, expect } from '@playwright/test';

test.describe('Bloomex Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://bloomex.ca');
  });

  test('S-01: Homepage Load', async ({ page }) => {
    // Check logo
    await expect(page.locator('img[alt="Bloomex Logo"]')).toBeVisible();
    
    // Check main menu
    const menuItems = ['Flowers', 'Gift Baskets', 'Sympathy'];
    for (const item of menuItems) {
      await expect(page.getByRole('link', { name: item })).toBeVisible();
    }
  });

  test('S-02: Language Switch', async ({ page }) => {
    await page.click('button:has-text("FR")');
    await expect(page).toHaveURL(/\/fr/);
    await expect(page.getByText('Panier')).toBeVisible(); // French for "Cart"
  });

  test('S-03: Add to Cart', async ({ page }) => {
    await page.click('text="Roses"');
    await page.click('button:has-text("Add to Cart")');
    await expect(page.locator('.mini-cart-count')).toHaveText('1');
  });

  test('S-04: Checkout as Registered User', async ({ page }) => {
    // Login
    await page.click('text="Login"');
    await page.fill('#email', 'user@example.com');
    await page.fill('#password', 'securepass123');
    await page.click('button:has-text("Sign In")');

    // Checkout
    await page.click('text="Proceed to Checkout"');
    await page.fill('#card-number', '4242424242424242');
    await page.click('button:has-text("Place Order")');
    await expect(page.getByText('Thank you for your order')).toBeVisible();
  });
});