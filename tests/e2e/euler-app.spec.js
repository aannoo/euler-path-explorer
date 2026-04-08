import { test, expect } from '@playwright/test';

const triangleEdges = '[a,b],[b,c],[c,a]';

async function openApp(page) {
  await page.addInitScript(() => {
    window.localStorage.clear();
  });

  await page.goto('/');
  await page.waitForSelector('#graph-layer', { state: 'visible', timeout: 10000 });
  await expect(page.locator('#weighted-toggle')).toHaveClass(/inactive/, { timeout: 10000 });
  await expect(page.locator('#page-loader')).toHaveClass(/fade-out/, { timeout: 10000 });
}

async function expectDesktopNotification(page, text) {
  await expect(page.locator('#desktop-notification-banner .notification-text')).toContainText(text, {
    timeout: 10000
  });
}

async function revealSaveControls(page) {
  const saveButton = page.locator('#save');
  await saveButton.evaluate((element) => {
    element.scrollIntoView({ block: 'center', behavior: 'instant' });
  });
  await expect(saveButton).toBeVisible();
}

async function calculateTriangleGraph(page) {
  await page.locator('#edges').clear();
  await page.locator('#edges').fill(triangleEdges);
  await page.locator('#calculate').click();
  await page.waitForSelector('#result:not(.hidden)', { timeout: 10000 });
}

test.describe('EULER App - Core Flows', () => {
  test.beforeEach(async ({ page }) => {
    await openApp(page);
  });

  test('loads the main graph workspace', async ({ page }) => {
    await expect(page).toHaveTitle(/EULER/i);
    await expect(page.locator('#graph-layer')).toBeVisible();
    await expect(page.locator('.graph-container')).toBeVisible();
    await expect(page.locator('#edges')).toBeVisible();
    await expect(page.locator('#calculate')).toBeVisible();
  });

  test('calculates and renders a basic Euler circuit', async ({ page }) => {
    await page.locator('#edges').clear();
    await page.locator('#edges').fill(triangleEdges);

    await page.locator('#calculate').click();

    await page.waitForSelector('#result:not(.hidden)', { timeout: 10000 });
    await expect(page.locator('#result-title')).toHaveText('Euler Circuit Found');
    await expect(page.locator('#result-path')).toContainText('Path:');
    await expect(page.locator('#controls')).not.toHaveClass(/hidden/);

    const canvases = page.locator('#graph-layer canvas');
    await expect(canvases.first()).toBeVisible();
  });

  test('shows an error notification when trying to calculate without edges', async ({ page }) => {
    await page.locator('#edges').clear();

    await page.locator('#calculate').click();

    await expectDesktopNotification(page, 'Please enter edges');
    await expect(page.locator('#result')).toHaveClass(/hidden/);
  });

  test('weighted toggle changes the calculation flow to Chinese Postman', async ({ page }) => {
    await page.locator('#weighted-toggle').click();

    await expect(page.locator('#weighted-toggle')).toHaveClass(/active/);
    await expect(page.locator('#weighted')).toHaveValue('true');
    await expect(page.locator('#weighted-hint')).not.toHaveClass(/hidden/);

    await page.locator('#edges').clear();
    await page.locator('#edges').fill('[a,b,2],[b,c,3],[c,a,4]');
    await page.locator('#calculate').click();

    await page.waitForSelector('#result:not(.hidden)', { timeout: 10000 });
    await expect(page.locator('#result-title')).toHaveText('Chinese Postman Tour');
    await expect(page.locator('#result-summary')).toContainText('Total weight: 9');
  });
});

test.describe('EULER App - Saved Graph Flows', () => {
  test.beforeEach(async ({ page }) => {
    await openApp(page);
  });

  test('saves a graph and can reload it from the saved list', async ({ page }) => {
    await calculateTriangleGraph(page);
    await revealSaveControls(page);
    await page.locator('#save').click();
    await expectDesktopNotification(page, 'Graph saved as');

    const savedItem = page.locator('.saved-graph-item:not(.example-item)').first();
    await expect(savedItem).toBeVisible();
    await expect(savedItem.locator('.saved-graph-details')).toContainText(triangleEdges);
    await expect(savedItem).toHaveClass(/active/);

    await page.locator('#edges').fill('[x,y],[y,z]');
    await savedItem.click();
    await savedItem.click();

    await expect(page.locator('#edges')).toHaveValue(triangleEdges);
    await expect(savedItem).toHaveClass(/active/);
  });

  test('duplicates and deletes a saved graph through the saved-graphs actions', async ({ page }) => {
    await calculateTriangleGraph(page);
    await revealSaveControls(page);
    await page.locator('#save').click();
    await expectDesktopNotification(page, 'Graph saved as');

    const savedItems = page.locator('.saved-graph-item:not(.example-item)');
    await expect(savedItems).toHaveCount(1);

    const originalItem = savedItems.first();
    await expect(originalItem).toHaveClass(/active/);
    await originalItem.locator('.duplicate-btn').click();

    await expectDesktopNotification(page, 'Created duplicate');
    await expect(savedItems).toHaveCount(2);

    const duplicateItem = page.locator('.saved-graph-item:not(.example-item)', { hasText: 'copy' }).first();
    await expect(duplicateItem).toHaveClass(/active/);
    await duplicateItem.locator('.remove-btn').click();
    await expect(duplicateItem.locator('.confirmation-message')).toContainText('Are you sure');
    await duplicateItem.locator('.confirm-delete-btn').click();

    await expectDesktopNotification(page, 'Graph deleted');
    await expect(savedItems).toHaveCount(1);
  });
});

test.describe('EULER App - Example And Editor Flows', () => {
  test.beforeEach(async ({ page }) => {
    await openApp(page);
  });

  test('loads a built-in example graph into the app', async ({ page }) => {
    const weightedExample = page.locator('.saved-graph-item.example-item', { hasText: 'Weighted Example' }).first();
    await weightedExample.click();

    await expectDesktopNotification(page, 'Loaded example "Weighted Example"');
    await expect(page.locator('#edges')).toHaveValue('[a,b,2],[b,c,3],[c,d,1],[d,a,4]');
    await expect(page.locator('#weighted')).toHaveValue('true');
  });

  test('switches into visual editor mode and shows parsed edges', async ({ page }) => {
    await page.locator('#edges').clear();
    await page.locator('#edges').fill(triangleEdges);

    await page.locator('#visual-mode-btn').click();

    await expect(page.locator('#visual-mode-btn')).toHaveClass(/active/);
    await expect(page.locator('#visual-editor-mode')).toHaveClass(/active/);
    await expect(page.locator('#edge-list .edge-item')).toHaveCount(3);
  });
});
