import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home';


test.describe('The Tradewishes app', () => {
  test('it has app descriptions and titles', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await expect(homePage.header).toContainText("Tradewishes");
    await expect(homePage.main).toBeVisible();
    await expect(homePage.footer).toBeVisible();
  });

  test('As a user, I should be able to submit an ISIN and ...', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await expect(homePage.header).toContainText("Tradewishes");
    await expect(homePage.form.ISINInput).toBeVisible();
  });

  test.skip('... it should be added to my watch list.', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await expect(homePage.header).toContainText("Tradewishes");
  });
});
