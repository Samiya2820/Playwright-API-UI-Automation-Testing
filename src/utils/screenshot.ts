import { Page } from '@playwright/test';
import path from 'node:path';

// Required deliverable: screenshots live in <project root>/verification.
// (Playwright's own test-results folder is wiped every run, so we don't use it.)
const VERIFICATION_DIR = path.resolve(__dirname, '../../verification');

// Full-page screenshots scroll down first to trigger lazy-loaded images, then 
// scroll back to the top before capturing.
async function loadLazyContent(page: Page): Promise<void> {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    window.scrollTo(0, 0);
  });
  await page
    .waitForFunction(() => Array.from(document.images).every((img) => img.complete), undefined, {
      timeout: 5_000,
    })
    .catch(() => {});
}

export async function saveScreenshot(
  page: Page,
  name: string,
  options: { fullPage?: boolean } = {},
): Promise<string> {
  const fullPage = options.fullPage ?? false;
  if (fullPage) await loadLazyContent(page);

  const filePath = path.join(VERIFICATION_DIR, `${name}.png`);
  // animations: 'disabled' freezes carousels/transitions: faster and repeatable captures.
  await page.screenshot({ path: filePath, fullPage, animations: 'disabled' });
  return filePath;
}
