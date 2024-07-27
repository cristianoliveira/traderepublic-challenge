import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home';

import { ERRORS } from '../src/hooks/useWatchList';


test.describe('The Tradewishes app', () => {
  test('it has app descriptions and titles', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await expect(homePage.header).toContainText("Tradewishes");
    await expect(homePage.main).toBeVisible();
    await expect(homePage.footer).toBeVisible();
  });

  test('As a user, I should be able to submit an ISIN' +
    ' and it should be added to my watch list.', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      await expect(homePage.header).toContainText("Tradewishes");
      await expect(homePage.form.ISINInput).toBeVisible();

      await homePage.form.ISINInput.fill("US0378331005");
      await expect(homePage.form.ISINInput).toHaveValue("US0378331005");
      await homePage.form.addButton.click();

      await homePage.form.ISINInput.fill("US38259P5089");
      await expect(homePage.form.ISINInput).toHaveValue("US38259P5089");
      await homePage.form.addButton.click();
      // TODO: clean up the form after submission
      await expect(homePage.form.ISINInput).toHaveValue("");

      await expect(homePage.watchListItems).toHaveCount(2);
      await expect(homePage.watchList).toContainText("US0378331005");
      await expect(homePage.watchList).toContainText("US38259P5089");
    });

  test('As a user, I should not be able to subscribe to the same ISIN twice' +
    ' so that I don’t get confused by seeing multiple versions of the same stock.', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      await expect(homePage.header).toContainText("Tradewishes");
      await expect(homePage.form.ISINInput).toBeVisible();

      await homePage.form.ISINInput.fill("US0378331005");
      await homePage.form.addButton.click();

      await homePage.form.ISINInput.fill("US0378331005");
      await homePage.form.addButton.click();
      // TODO: clean up the form after submission
      await expect(homePage.form.ISINInput).toHaveValue("");

      await expect(homePage.watchListItems).toHaveCount(1);
      await expect(homePage.watchList).toContainText("US0378331005");

      await expect(homePage.form.errorText).toContainText(ERRORS.duplicated);
    });

  // TODO: move to its own test file feature live-stream stock performance
  test('As a user, I should not be able to subscribe to an empty or invalid ISIN.', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await expect(homePage.header).toContainText("Tradewishes");
    await expect(homePage.form.ISINInput).toBeVisible();

    await homePage.form.ISINInput.fill("");
    await homePage.form.addButton.click();

    await expect(homePage.watchListItems).toHaveCount(0);
    await expect(homePage.form.errorText).toContainText(ERRORS.empty);

    await homePage.form.ISINInput.fill("US037833");
    await homePage.form.addButton.click();
    await expect(homePage.form.errorText).toContainText(ERRORS.invalid);

    await homePage.form.ISINInput.fill("US0378331006");
    await homePage.form.addButton.click();
    await expect(homePage.form.errorText).toContainText(ERRORS.invalid);

    await expect(homePage.watchListItems).toHaveCount(0);
  });


  test('As a user, I should be able to view a list of my subscribed stocks' +
    ' displaying the latest stock price received from the WebSocket connection' +
    ' so that I can keep track of multiple stocks at the same time.', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      await expect(homePage.header).toContainText("Tradewishes");
      await expect(homePage.form.ISINInput).toBeVisible();

      await homePage.form.ISINInput.fill("US0378331005");
      await expect(homePage.form.ISINInput).toHaveValue("US0378331005");
      await homePage.form.addButton.click();

      await homePage.form.ISINInput.fill("US38259P5089");
      await expect(homePage.form.ISINInput).toHaveValue("US38259P5089");
      await homePage.form.addButton.click();

      await expect(homePage.watchListItems).toHaveCount(2);
      await expect(homePage.watchList).toContainText("US0378331005");
      await expect(homePage.watchList).toContainText("US38259P5089");
    });
});
