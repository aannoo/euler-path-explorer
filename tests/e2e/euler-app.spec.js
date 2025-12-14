import { test, expect } from '@playwright/test';

test.describe('EULER App - Basic Functionality', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the app to be fully loaded
    await page.waitForSelector('#graph-layer', { state: 'visible', timeout: 10000 });
  });

  test('page loads successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/EULER/i);

    // Check main UI elements are present
    await expect(page.locator('#graph-layer')).toBeVisible();
    await expect(page.locator('#edges')).toBeVisible();
  });

  test('graph layer displays correctly', async ({ page }) => {
    // Verify graph layer exists and is visible
    const graphLayer = page.locator('#graph-layer');
    await expect(graphLayer).toBeVisible();

    // Check that graph container is rendered
    const graphContainer = page.locator('.graph-container');
    await expect(graphContainer).toBeVisible();
  });

  test('calculate euler button works', async ({ page }) => {
    // Enter a simple graph that has an Euler circuit
    const edgeInput = page.locator('#edges');
    await edgeInput.clear();
    await edgeInput.fill('[a,b],[b,c],[c,a]');

    // Click calculate button
    const calculateBtn = page.locator('#calculate');
    await expect(calculateBtn).toBeVisible();
    await calculateBtn.click();

    // Wait for results to appear
    await page.waitForSelector('#result:not(.hidden)', { timeout: 5000 });

    // Verify result title is shown
    const resultTitle = page.locator('#result-title');
    await expect(resultTitle).toBeVisible();
  });

  test('edge input accepts valid graph format', async ({ page }) => {
    const edgeInput = page.locator('#edges');

    // Test bracket format
    await edgeInput.clear();
    await edgeInput.fill('[a,b],[b,c],[c,d],[d,a]');

    // Input should contain the value
    await expect(edgeInput).toHaveValue('[a,b],[b,c],[c,d],[d,a]');
  });

  test('section headers are visible', async ({ page }) => {
    // Check INPUT section header
    const inputSection = page.locator('#input-section');
    await expect(inputSection).toBeVisible();

    // Check RESULTS section header
    const resultsSection = page.locator('#results-section');
    await expect(resultsSection).toBeVisible();

    // Check SAVED section header
    const savedSection = page.locator('#saved-section');
    await expect(savedSection).toBeVisible();
  });

  test('graph property toggles exist', async ({ page }) => {
    // Test directed toggle
    const directedToggle = page.locator('#directed-toggle');
    await expect(directedToggle).toBeVisible();

    // Test weighted toggle
    const weightedToggle = page.locator('#weighted-toggle');
    await expect(weightedToggle).toBeVisible();
  });

});

test.describe('EULER App - Graph Visualization', () => {

  test('graph renders after calculation', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#graph-layer', { state: 'visible', timeout: 10000 });

    // Enter graph data
    const edgeInput = page.locator('#edges');
    await edgeInput.clear();
    await edgeInput.fill('[a,b],[b,c],[c,a]');

    // Calculate to render graph
    const calculateBtn = page.locator('#calculate');
    await calculateBtn.click();

    // Wait for result
    await page.waitForSelector('#result:not(.hidden)', { timeout: 5000 });

    // Check graph layer is still visible with content
    const graphLayer = page.locator('#graph-layer');
    await expect(graphLayer).toBeVisible();

    // Check that canvas elements exist (Sigma.js renders to canvas)
    const canvases = page.locator('#graph-layer canvas');
    const count = await canvases.count();
    expect(count).toBeGreaterThan(0);
  });

});

test.describe('EULER App - Editor Modes', () => {

  test('can switch between text and visual editor modes', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#graph-layer', { state: 'visible', timeout: 10000 });

    // Text mode should be active by default
    const textModeBtn = page.locator('#text-mode-btn');
    await expect(textModeBtn).toHaveClass(/active/);

    // Click visual mode
    const visualModeBtn = page.locator('#visual-mode-btn');
    await visualModeBtn.click();

    // Visual mode should now be active
    await expect(visualModeBtn).toHaveClass(/active/);

    // Visual editor should be visible
    const visualEditor = page.locator('#visual-editor-mode');
    await expect(visualEditor).toBeVisible();
  });

});
