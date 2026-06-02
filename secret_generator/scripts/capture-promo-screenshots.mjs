import { mkdir, readFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const baseUrl = 'http://127.0.0.1:5173';
const outputDir = new URL('../screenshots/', import.meta.url);
const viewport = { width: 1280, height: 720 };

async function setLocale(page, locale) {
  const selector = page.locator('header select');

  if ((await selector.count()) === 1) {
    await selector.selectOption(locale);
  }
}

async function openPage(page, path, locale) {
  await page.goto(`${baseUrl}${path}`);
  await page.waitForLoadState('domcontentloaded');
  await setLocale(page, locale);
  await page.evaluate(() => window.scrollTo(0, 0));
}

async function generate(page) {
  await page.getByTestId('generate-button').click();
  await page.getByTestId('secret-value').waitFor({ state: 'visible' });
}

async function screenshot(page, fileName, scrollY = 0) {
  const path = new URL(fileName, outputDir);
  await page.evaluate((y) => {
    window.scrollTo(0, y);
    document.documentElement.scrollTop = y;
    document.body.scrollTop = y;
  }, scrollY);
  await page.waitForTimeout(150);
  await page.screenshot({ path: path.pathname, fullPage: false });
  return path.pathname;
}

function readPngSize(buffer) {
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  locale: 'ja-JP',
  viewport,
});
const page = await context.newPage();

const outputs = [];

await openPage(page, '/generator/random-password', 'ja');
await generate(page);
outputs.push(await screenshot(page, 'promo-main-generator-ja.png', 310));

await openPage(page, '/security', 'ja');
outputs.push(await screenshot(page, 'promo-sub-security-ja.png'));

await openPage(page, '/generator/env-secret', 'ja');
await generate(page);
outputs.push(await screenshot(page, 'promo-sub-env-ja.png', 145));

await openPage(page, '/generator/jwt-hs256', 'en');
await generate(page);
outputs.push(await screenshot(page, 'promo-sub-generator-en.png', 145));

await browser.close();

const sizes = [];
for (const output of outputs) {
  sizes.push({ path: output, ...readPngSize(await readFile(output)) });
}

console.log(JSON.stringify(sizes, null, 2));
