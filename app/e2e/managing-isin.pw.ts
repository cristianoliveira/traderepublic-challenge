import { test, expect, WebSocket, Page } from '@playwright/test';
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
      let resolver: any = null;
      let rejector: any = null;
      const awaitPromiseEvent = (expectedISIN: string) => {
        const timeoutInstance = setInterval(() => {
          if (rejector) rejector(new Error(`awaitPromiseEvent timed out waiting for ${expectedISIN}`));
        }, 20000);

        return new Promise((res, rej) => {
          rejector = rej;
          resolver = (evt: any) => {
            if (evt.isin === expectedISIN) {
              rejector = null;
              clearInterval(timeoutInstance);
              console.debug("resolving for", expectedISIN);
              res(true);
            }
          };

        });
      }

      page.on('websocket', (ws) => {
        ws.on("framereceived", (event) => {
          if (resolver) resolver(JSON.parse(event.payload as string));
        });
      });

      const homePage = new HomePage(page);
      await homePage.goto();

      await expect(homePage.header).toContainText("Tradewishes");
      await expect(homePage.form.ISINInput).toBeVisible();

      await expect(homePage.connectionStatus).toContainText("Live");

      await homePage.form.ISINInput.fill("US0378331005");
      await expect(homePage.form.ISINInput).toHaveValue("US0378331005");
      await homePage.form.addButton.click();

      await expect(homePage.watchList).toContainText("US0378331005");
      expect(await awaitPromiseEvent("US0378331005")).toBe(true);

      await homePage.form.ISINInput.fill("US38259P5089");
      await expect(homePage.form.ISINInput).toHaveValue("US38259P5089");
      await homePage.form.addButton.click();

      await expect(homePage.watchListItems).toHaveCount(2);
      await expect(homePage.watchList).toContainText("US38259P5089");

      expect(await awaitPromiseEvent('US38259P5089')).toBe(true);
    });

  test('As a user, I should be able to unsubscribe from a stock' +
    ' that’s in my watch list so that I can focus on the stocks I’m interested in.',
    async ({ page }) => {
      let resolver: any = null;
      let rejector: any = null;
      const awaitPromiseEvent = (expectedISIN: string) => {
        const timeoutInstance = setInterval(() => {
          if (rejector) rejector(new Error(`awaitPromiseEvent timed out waiting for ${expectedISIN}`));
        }, 20000);

        return new Promise((res, rej) => {
          rejector = rej;
          resolver = (evt: any) => {
            if (evt.isin === expectedISIN) {
              rejector = null;
              clearInterval(timeoutInstance);
              console.debug("resolving for", expectedISIN);
              res(true);
            }
          };

        });
      }

      page.on('websocket', (ws) => {
        ws.on("framereceived", (event) => {
          if (resolver) resolver(JSON.parse(event.payload as string));
        });
      });

      const homePage = new HomePage(page);
      await homePage.goto();

      await expect(homePage.header).toContainText("Tradewishes");
      await expect(homePage.form.ISINInput).toBeVisible();

      await expect(homePage.connectionStatus).toContainText("Live");

      await homePage.form.ISINInput.fill("US0378331005");
      await expect(homePage.form.ISINInput).toHaveValue("US0378331005");
      await homePage.form.addButton.click();

      await expect(homePage.watchList).toContainText("US0378331005");
      expect(await awaitPromiseEvent("US0378331005")).toBe(true);

      await homePage.form.ISINInput.fill("US38259P5089");
      await expect(homePage.form.ISINInput).toHaveValue("US38259P5089");
      await homePage.form.addButton.click();

      await expect(homePage.watchListItems).toHaveCount(2);
      await expect(homePage.watchList).toContainText("US38259P5089");

      expect(await awaitPromiseEvent('US38259P5089')).toBe(true);

      const itemToBeRemoved = await homePage.getItemByISIN("US0378331005")
      expect(itemToBeRemoved).not.toBeUndefined();

      await itemToBeRemoved.locator('button').click();
      await expect(homePage.watchListItems).toHaveCount(1);
    });

  test('As a user, I should be notified if the websocket disconnects and the data'+
       ' is not up to date so that I know that the price is not accurate.',
    async ({ page }) => {
      page.on('websocket', (ws) => {
        ws.on("framereceived", (event) => {
          console.log('@@@@@@ event.payload: ', event.payload);
          const type = JSON.parse(event.payload as string).type;
        });
      });

      const homePage = new HomePage(page);
      await homePage.goto();

      await expect(homePage.header).toContainText("Tradewishes");
      await expect(homePage.form.ISINInput).toBeVisible();

      await expect(homePage.connectionStatus).toContainText("Live");
      // FIXME: How to simulate a disconnection?
    });
});
