import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright'; // 1
import { HomePage } from './pages/home';

test.describe('checking accessibility', () => {
  test('must not have any automatically detectable accessibility issues', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); // 4

    expect(accessibilityScanResults.violations).toEqual([]); // 5
  });
});
