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
  };

  // Watch list
  readonly watchList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator('h1', { hasText: 'Tradewishes' });
    this.main = page.locator('main');
    this.footer = page.locator('footer');

    // Form
    this.form = {
      ISINInput: page.getByPlaceholder('Enter ISIN'),
      addButton: page.locator('button', { hasText: 'Add to Watchlist' }),
    }

    // Get by data-testid="watch-list"
    this.watchList = page.locator('[data-testid="watch-list"]');
  }

  async goto() {
    await this.page.goto('http://localhost:7878');
  }
}
