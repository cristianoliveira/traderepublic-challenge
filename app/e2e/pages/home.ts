import { type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly header: Locator;
  readonly main: Locator;
  readonly footer: Locator;

  // Form
  readonly form: {
    readonly ISINInput: Locator;
    readonly addButton: Locator;
    readonly errorText: Locator;
  };

  // Watch list
  readonly watchList: Locator;
  readonly watchListItems: Locator;
  readonly watchListItemLoadingSkeleton: Locator;

  readonly connectionStatus: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator('header');
    this.main = page.locator('main');
    this.footer = page.locator('footer');

    // Form
    this.form = {
      ISINInput: page.getByPlaceholder('Enter ISIN'),
      addButton: page.locator('button', { hasText: 'Add to Watchlist' }),
      errorText: page.locator('[data-testid="isin-error"]'),
    }

    // Get by data-testid="watch-list"
    this.watchList = page.locator('[data-testid="watch-list"]');
    this.watchListItems = this.watchList.locator('tr');
    this.watchListItemLoadingSkeleton = page.locator('.skeleton'),

    this.connectionStatus = page.locator('[data-testid="connection-status"] > span');
  }

  async getItemByISIN(ISIN: string) {
    return this.page.locator(`[data-testid="${ISIN}-item"]`);
  }

  async goto() {
    await this.page.goto('http://localhost:7878');
  }
}
