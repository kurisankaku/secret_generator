import { expect, test } from '@playwright/test';

test('generates without sending post-load network requests or storing the secret', async ({ page }) => {
  await page.goto('/generator/jwt-hs256');
  await page.waitForLoadState('networkidle');

  const requests: string[] = [];
  page.on('request', (request) => {
    requests.push(request.url());
  });

  await page.getByTestId('generate-button').click();
  const secret = (await page.getByTestId('secret-value').textContent()) ?? '';

  expect(secret).toHaveLength(43);
  expect(requests).toEqual([]);

  const storageSnapshot = await page.evaluate(() => ({
    local: { ...localStorage },
    session: { ...sessionStorage },
    cookie: document.cookie,
    href: location.href,
  }));

  expect(JSON.stringify(storageSnapshot.local)).not.toContain(secret);
  expect(JSON.stringify(storageSnapshot.session)).not.toContain(secret);
  expect(storageSnapshot.cookie).not.toContain(secret);
  expect(storageSnapshot.href).not.toContain(secret);
});

test('works on a mobile viewport', async ({ page }) => {
  await page.goto('/generator/database-password');
  await page.getByTestId('generate-button').click();

  await expect(page.getByTestId('secret-value')).toBeVisible();
});
