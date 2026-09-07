// Headless WebKit only, using an already installed Playwright module.
// Required env: MICROCOSM_SITE_QA_URL (explicit loopback URL on a new port),
// MICROCOSM_SITE_QA_OUTPUT_DIR (new directory; its parent must exist),
// MICROCOSM_PLAYWRIGHT_MODULE (absolute path to the installed module).
// The caller owns the local server. This script never starts or stops listeners.
// Offline classification checks: node scripts/check_site_webkit.mjs --check-classification
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { isAbsolute, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const endpoints = [
  'https://huggingface.co/datasets/policyengine/populace-us/resolve/main/latest.json',
  'https://raw.githubusercontent.com/PolicyEngine/policyengine.py/main/src/policyengine/data/bundle/manifest.json',
  'https://huggingface.co/api/datasets/policyengine/populace-us/refs',
];
// The controlled scenario aborts exactly these three entry points. Ordinary
// requests can also reach JSON manifests below the same fixed HF release root.
const releaseEndpoints = new Set(endpoints);
function isReleaseAPI(url) {
  return releaseEndpoints.has(url) || /^https:\/\/huggingface\.co\/datasets\/policyengine\/populace-us\/resolve\/main\/(?:[A-Za-z0-9_-][A-Za-z0-9._-]*\/)*[A-Za-z0-9_-][A-Za-z0-9._-]*\.json$/.test(url);
}
function knownReleasePageError(error) {
  // WebKit sometimes renders https:// as "https: /" in this exact CORS error.
  const normalized = String(error).replace(/https:\s*\/\s*\/?/g, 'https://');
  const url = normalized.match(/^Fetch API cannot load (https:\/\/\S+) due to access control checks\.?$/)?.[1];
  return url && isReleaseAPI(url) ? url : null;
}
if (process.argv.includes('--check-classification')) {
  const hf = 'https://huggingface.co/datasets/policyengine/populace-us/resolve/main/';
  const accepted = [
    ...endpoints, hf + 'build_manifest.json',
    ...['build_manifest', 'release_manifest', 'gate_summary', 'calibration_diagnostics'].map((name) => hf + `releases/invented-fixture-20000101/${name}.json`),
  ];
  const rejected = [
    hf + 'releases/invented-fixture/data.h5', hf + '../private.json',
    hf + 'releases/%2e%2e/private.json', hf + 'latest.json?arbitrary=1',
    hf.replace('populace-us', 'another-dataset') + 'latest.json',
    hf.replace('huggingface.co/', 'huggingface.co.example/') + 'latest.json',
    'http://127.0.0.1:4608/methods/fixture.json',
    endpoints[1].replace('manifest.json', 'other.json'),
    endpoints[2] + '/unrelated',
  ];
  for (const url of accepted) {
    assert.equal(isReleaseAPI(url), true, url);
    assert.equal(knownReleasePageError(`Fetch API cannot load ${url} due to access control checks.`), url);
  }
  for (const url of rejected) {
    assert.equal(isReleaseAPI(url), false, url);
    assert.equal(knownReleasePageError(`Fetch API cannot load ${url} due to access control checks.`), null);
  }
  assert.equal(knownReleasePageError(`Fetch API cannot load ${endpoints[1].replace('https://', 'https: /')} due to access control checks.`), endpoints[1]);
  assert.equal(knownReleasePageError(`TypeError in release rendering: ${endpoints[0]}`), null);
  assert.equal(knownReleasePageError('ReferenceError: releaseRow is not defined'), null);
  console.log(JSON.stringify({ status: 'passed', scope: 'Offline invented URL/error classification checks', assertions: 2 * (accepted.length + rejected.length) + 3 }, null, 2));
  process.exit(0);
}

const root = fileURLToPath(new URL('../', import.meta.url));
const required = (name) => {
  assert.ok(process.env[name], `${name} must be explicitly supplied`);
  return process.env[name];
};
const baseURL = new URL(required('MICROCOSM_SITE_QA_URL'));
assert.ok(baseURL.protocol === 'http:' && ['127.0.0.1', 'localhost', '[::1]'].includes(baseURL.hostname), 'QA URL must be HTTP loopback');
assert.ok(baseURL.port && !['4596', '4607'].includes(baseURL.port), 'use a distinct explicit port; preserve previews 4596 and 4607');
assert.ok(baseURL.pathname === '/' && !baseURL.search && !baseURL.hash && !baseURL.username && !baseURL.password, 'QA URL must be an origin');
const base = baseURL.origin;
const output = required('MICROCOSM_SITE_QA_OUTPUT_DIR');
const modulePath = required('MICROCOSM_PLAYWRIGHT_MODULE');
assert.ok(isAbsolute(output) && isAbsolute(modulePath), 'output and installed module paths must be absolute');
// Exclusive creation deliberately refuses previous failed QA and captures.
mkdirSync(output);

const rowIds = ['release-row-latest', 'release-row-certified', 'release-row-local'];
const pages = [
  ['/', 'index.html'], ['/methods/', 'methods/index.html'],
  ['/composition/paper', 'composition/paper.html'],
  ['/calibration/paper', 'calibration/paper.html'],
  ['/support/', 'support/index.html'], ['/support/paper', 'support/paper.html'],
  ['/papers/', 'papers/index.html'],
];
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const result = {
  status: 'started', browser: 'headless WebKit', base,
  scope: 'Local seven-page rendering and controlled unavailable-release-API fallback; external API success is not certified',
  checks: [], page_errors: [], failed_requests: [], bad_responses: [],
  external_limitations: [], controlled_external_failures: [], screenshots: [], tested_files: {},
};
const check = (name, ok, details) => {
  result.checks.push({ name, ok, ...(details === undefined ? {} : { details }) });
  assert.ok(ok, name);
};
function verifyBytes(filename, bytes) {
  const expected = sha256(readFileSync(join(root, filename)));
  const actual = sha256(bytes);
  check(`served bytes match ${filename}`, actual === expected, { expected, actual });
  result.tested_files[filename] = actual;
}

function observe(page, scenario) {
  const external = scenario === 'controlled unavailable release APIs'
    ? result.controlled_external_failures : result.external_limitations;
  page.on('pageerror', (error) => {
    const text = String(error.message || error);
    const url = knownReleasePageError(text);
    if (url) external.push({ scenario, kind: 'release API access control failure', url, error: text });
    else result.page_errors.push({ scenario, page: page.url(), error: text });
  });
  page.on('requestfailed', (request) => {
    const item = { scenario, url: request.url(), error: request.failure()?.errorText };
    if (isReleaseAPI(item.url)) external.push({ ...item, kind: 'release API request failure' });
    else result.failed_requests.push(item);
  });
  page.on('response', (response) => {
    if (response.status() < 400) return;
    const item = { scenario, url: response.url(), status: response.status() };
    if (isReleaseAPI(item.url)) external.push({ ...item, kind: 'release API HTTP failure' });
    else result.bad_responses.push(item);
  });
}

let browser;
try {
  result.source_head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  result.source_tree = execFileSync('git', ['rev-parse', 'HEAD^{tree}'], { cwd: root, encoding: 'utf8' }).trim();
  result.runner_sha256 = sha256(readFileSync(fileURLToPath(import.meta.url)));
  result.source_status = execFileSync('git', ['status', '--porcelain=v1', '--untracked-files=all'], { cwd: root, encoding: 'utf8' });
  result.source_clean = result.source_status === '';
  check('source worktree is clean before browser launch', result.source_clean, result.source_status);
  const { webkit } = createRequire(import.meta.url)(modulePath);
  browser = await webkit.launch({ headless: true });
  result.browser_version = browser.version();
  for (const width of [390, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    observe(page, `ordinary ${width}`);
    const evidenceLinks = new Set();
    for (const [path, filename] of pages) {
      const response = await page.goto(base + path, { waitUntil: 'load', timeout: 20000 });
      check(`${width} ${path} HTTP`, response.ok(), response.status());
      verifyBytes(filename, await response.body());
      await page.evaluate(() => document.fonts.ready);
      check(`${width} ${path} overflow`, await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1));
      check(`${width} ${path} heading`, await page.locator('h1').isVisible());
      const fonts = await page.evaluate(() => ({
        localStylesheet: [...document.styleSheets].some((sheet) => sheet.href === location.origin + '/vendor/fonts/microcosm-fonts.css'),
        loaded: [...document.fonts].filter((font) => font.status === 'loaded').map((font) => font.family),
        failed: [...document.fonts].filter((font) => font.status === 'error').map((font) => font.family),
      }));
      check(`${width} ${path} local fonts`, fonts.localStylesheet && fonts.loaded.length > 0 && fonts.failed.length === 0, fonts);
      for (const href of await page.locator('a[href]').evaluateAll((links) => links.map((link) => link.href))) {
        const url = new URL(href);
        if (url.origin === base && url.pathname.endsWith('.json')) evidenceLinks.add(url.href);
      }
    }
    for (const href of evidenceLinks) {
      const response = await context.request.get(href);
      check(`${width} JSON ${new URL(href).pathname} HTTP`, response.ok(), response.status());
      const bytes = await response.body();
      const value = JSON.parse(bytes.toString('utf8'));
      check(`${width} JSON ${new URL(href).pathname} object`, value !== null && typeof value === 'object' && !Array.isArray(value));
      verifyBytes(decodeURIComponent(new URL(href).pathname).slice(1), bytes);
    }
    await page.goto(base + '/methods/', { waitUntil: 'load' });
    for (const id of ['us-development-progress', 'combined-clone-export', 'puf-monetary-agi', 'puf-price-restatement', 'survey-demographic-lineage', 'sipp-annual-panel', 'sipp-annual-panel-genuine']) {
      const node = page.locator('#' + id);
      check(`${width} methods ${id} unique`, await node.count() === 1);
      await node.scrollIntoViewIfNeeded();
      check(`${width} methods ${id} visible`, await node.isVisible());
    }
    for (const [path, selector, label] of [
      ['/methods/#us-development-progress', '#us-development-progress', 'progress'],
      ['/support/', 'figure.diagram-figure:has(#support-flow-title)', 'support-flow'],
    ]) {
      await page.goto(base + path, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const node = page.locator(selector);
      check(`${width} screenshot ${label} unique`, await node.count() === 1);
      await node.scrollIntoViewIfNeeded();
      const filename = `${label}-${width}.png`;
      await node.screenshot({ path: join(output, filename) });
      result.screenshots.push({ file: filename, sha256: sha256(readFileSync(join(output, filename))) });
    }
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const aborted = [];
  await context.route((url) => releaseEndpoints.has(url.href), async (route) => {
    aborted.push(route.request().url());
    await route.abort('failed');
  });
  await context.addInitScript((known) => {
    const original = window.fetch.bind(window);
    window.__releaseQA = { attempted: [], settled: [] };
    window.fetch = (...args) => {
      const url = typeof args[0] === 'string' ? args[0] : args[0].url;
      if (!known.includes(url)) return original(...args);
      window.__releaseQA.attempted.push(url);
      return original(...args).finally(() => window.__releaseQA.settled.push(url));
    };
  }, endpoints);
  const page = await context.newPage();
  observe(page, 'controlled unavailable release APIs');
  const response = await page.goto(base + '/', { waitUntil: 'load', timeout: 20000 });
  check('controlled unavailable APIs: homepage HTTP', response.ok());
  verifyBytes('index.html', await response.body());
  const scriptResponse = await context.request.get(base + '/releases.js');
  check('controlled unavailable APIs: production release script HTTP', scriptResponse.ok());
  verifyBytes('releases.js', await scriptResponse.body());
  await page.waitForFunction((known) => known.every((url) => window.__releaseQA.settled.includes(url)), endpoints, { timeout: 15000 });
  // All three fetches are sequential in releases.js. A subsequent task runs
  // after the final rejection/catch microtasks, so the async IIFE has finished.
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 0)));
  const attempts = await page.evaluate(() => window.__releaseQA);
  check('controlled unavailable APIs: exact three endpoints aborted', JSON.stringify(aborted) === JSON.stringify(endpoints), aborted);
  check('controlled unavailable APIs: all three attempts settled', JSON.stringify(attempts.attempted) === JSON.stringify(endpoints) && JSON.stringify(attempts.settled) === JSON.stringify(endpoints), attempts);
  for (const id of rowIds) {
    const row = page.locator('#' + id);
    check(`controlled unavailable APIs: ${id} unique`, await row.count() === 1);
    const state = await row.evaluate((node) => ({ hidden: node.hidden, id: node.querySelector('[data-slot="id"]').textContent, meta: node.querySelector('[data-slot="meta"]').textContent }));
    check(`controlled unavailable APIs: ${id} remains hidden and empty`, state.hidden && state.id === '' && state.meta === '' && !await row.isVisible(), state);
  }
  const note = page.locator('#release-local-note');
  check('controlled unavailable APIs: note remains hidden', await note.count() === 1 && await note.evaluate((node) => node.hidden) && !await note.isVisible());
  await context.close();
  check('no unexpected page errors', result.page_errors.length === 0, result.page_errors);
  check('no unexpected failed requests', result.failed_requests.length === 0, result.failed_requests);
  check('no unexpected HTTP failures', result.bad_responses.length === 0, result.bad_responses);
  result.status = result.external_limitations.length ? 'passed_with_external_limitations' : 'passed';
} catch (error) {
  result.status = 'failed';
  result.error = String(error.stack || error);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  writeFileSync(join(output, 'webkit-result.json'), JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify(result, null, 2));
}
