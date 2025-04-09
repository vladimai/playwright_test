import { test, expect } from '@playwright/test';

test.describe('Bloomex Regression Tests', () => {
  test('R-01: Order Total Calculation', async ({ page }) => {
    await page.goto('/product/123');
    await page.click('button:has-text("Add to Cart")');
    
    // Apply promo
    await page.fill('#promo-code', 'SUMMER20');
    await page.click('button:has-text("Apply")');
    
    // Verify totals
    const subtotal = await page.locator('.subtotal').innerText();
    const discount = await page.locator('.discount').innerText();
    const total = await page.locator('.total').innerText();
    
    expect(parseFloat(total)).toEqual(
      parseFloat(subtotal) - parseFloat(discount)
    );
  });

  test('R-02: Delivery Date Validation', async ({ page }) => {
    await page.goto('/checkout');
    
    // Try invalid date
    await page.fill('#delivery-date', '2023-12-32');
    await page.click('text="Continue"');
    await expect(page.getByText('Invalid date')).toBeVisible();
  });

  test('R-03: Address Management', async ({ page }) => {
    // Add new address
    await page.click('text="Add Address"');
    await page.fill('#street', '123 Main St');
    await page.selectOption('#country', 'Canada');
    await page.click('button:has-text("Save")');
    
    // Verify
    await expect(page.getByText('123 Main St')).toBeVisible();
  });

  test('R-04: Abandoned Cart Recovery', async ({ page }) => {
    // Add to cart and leave
    await page.click('button:has-text("Add to Cart")');
    
    // Wait 20 mins (mock)
    await page.waitForTimeout(1200000);
    
    // Check email
    // ... (integration with email API needed)
  });
});