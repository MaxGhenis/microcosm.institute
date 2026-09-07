// Offline regression: executes the production script unchanged. Every response
// below is an invented fixture, never evidence of an actual published release.
// Usage: node scripts/check_release_fallback.mjs
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const source = readFileSync(new URL('releases.js', root), 'utf8');
const html = readFileSync(new URL('index.html', root), 'utf8');
const hf = 'https://huggingface.co/datasets/policyengine/populace-us/resolve/main/';
const endpoints = [
  hf + 'latest.json',
  'https://raw.githubusercontent.com/PolicyEngine/policyengine.py/main/src/policyengine/data/bundle/manifest.json',
  'https://huggingface.co/api/datasets/policyengine/populace-us/refs',
];
const rowIds = ['release-row-latest', 'release-row-certified', 'release-row-local'];
const checks = [];
const check = (name, action) => {
  action();
  checks.push(name);
};

function documentFromHTML() {
  const nodes = new Map();
  for (const id of rowIds) {
    const match = html.match(new RegExp(`<div\\b([^>]*\\bid="${id}"[^>]*)>([\\s\\S]*?)<\\/div>`));
    assert.ok(match, `actual HTML contains ${id}`);
    const slots = {};
    for (const name of ['id', 'meta']) {
      const slot = match[2].match(new RegExp(`<span\\b[^>]*\\bdata-slot="${name}"[^>]*>([\\s\\S]*?)<\\/span>`));
      assert.ok(slot, `actual HTML contains ${id} ${name} slot`);
      slots[name] = { textContent: slot[1] };
    }
    nodes.set(id, {
      hidden: /(?:^|\s)hidden(?:\s|=|$)/.test(match[1]),
      querySelector(selector) {
        const name = selector.match(/^\[data-slot="(id|meta)"\]$/)?.[1];
        assert.ok(name, `unexpected production DOM selector: ${selector}`);
        return slots[name];
      },
      slots,
    });
  }
  const note = html.match(/<p\b([^>]*\bid="release-local-note"[^>]*)>/);
  assert.ok(note, 'actual HTML contains the local release note');
  nodes.set('release-local-note', { hidden: /(?:^|\s)hidden(?:\s|=|$)/.test(note[1]) });
  return { getElementById: (id) => nodes.get(id) ?? null };
}

function assertHidden(document) {
  for (const id of rowIds) {
    const row = document.getElementById(id);
    assert.equal(row.hidden, true, `${id} stays hidden`);
    assert.equal(row.slots.id.textContent, '', `${id} has no release ID`);
    assert.equal(row.slots.meta.textContent, '', `${id} has no release metadata`);
  }
  assert.equal(document.getElementById('release-local-note').hidden, true, 'local note stays hidden');
}

async function execute(responseFor) {
  const document = documentFromHTML();
  const attempted = [];
  const settled = [];
  const context = vm.createContext({
    document,
    fetch: async (url) => {
      attempted.push(url);
      try {
        await Promise.resolve();
        return await responseFor(url);
      } finally {
        settled.push(url);
      }
    },
  });
  // The last expression is the actual async IIFE: await its completion, not a
  // guessed delay or the completion of only the first network request.
  const completion = vm.runInContext(source, context, { filename: 'releases.js', timeout: 1000 });
  assert.equal(typeof completion?.then, 'function', 'production script returns its async IIFE');
  await completion;
  assert.deepEqual(settled, attempted, 'every attempted request has settled');
  return { document, attempted, settled };
}

check('actual HTML defaults to hidden rows, empty slots and hidden note', () => assertHidden(documentFromHTML()));
for (const mode of ['fetch rejection', 'HTTP 503', 'invalid JSON']) {
  const run = await execute(async () => {
    if (mode === 'fetch rejection') throw new TypeError('Invented unavailable-network fixture');
    return {
      ok: mode !== 'HTTP 503', status: 503,
      json: async () => { throw new SyntaxError('Invented invalid-JSON fixture'); },
    };
  });
  check(`${mode}: all three top-level attempts finish`, () => assert.deepEqual(run.attempted, endpoints));
  check(`${mode}: no release or local note is fabricated`, () => assertHidden(run.document));
}

const localId = 'invented-fixture-acs-local-20000102T000000Z';
const localDir = hf + `releases/${localId}/`;
const fixtures = new Map([
  [endpoints[0], { release_id: 'invented-fixture-latest', updated_at: '2000-01-01', paths: { build_manifest: 'invented-fixture-build.json' } }],
  [hf + 'invented-fixture-build.json', { created_at: '2000-01-01', dataset: { default: { n_exported_households: 7, final_loss: 0.125 } }, gates: { calibration: { fraction_within_10pct: 0.5 } } }],
  [endpoints[1], { bundle_version: 'fixture-only', data_releases: { us: { build_id: 'invented-fixture-certified', certification: { certified_for_model_version: 'fixture-only' } } } }],
  [endpoints[2], { tags: [{ name: 'invented-fixture-acs-local-20000101T000000Z' }, { name: localId }] }],
  [localDir + 'release_manifest.json', { build: { built_at: '2000-01-02' } }],
  [localDir + 'gate_summary.json', { gates: { calibration: { n_targets: 3, fraction_within_10pct: 1 } } }],
  [localDir + 'calibration_diagnostics.json', { target_surface: { n_records: 9 } }],
]);
const positive = await execute(async (url) => {
  assert.ok(fixtures.has(url), `positive control requested an unknown fixture: ${url}`);
  return { ok: true, json: async () => fixtures.get(url) };
});
check('invented positive control consumes all seven fixture responses', () => assert.deepEqual(positive.attempted, [...fixtures.keys()]));
const expected = [
  ['invented-fixture-latest', '2000-01-01 · 7 households · calibration loss 0.125 · 50% of targets within 10%'],
  ['invented-fixture-certified', 'policyengine.py fixture-only · policyengine-us fixture-only'],
  [localId, '2000-01-02 · 9 households · 3 targets · 100% of targets within 10%'],
];
for (const [index, id] of rowIds.entries()) {
  check(`invented positive control displays ${id}`, () => {
    const row = positive.document.getElementById(id);
    assert.equal(row.hidden, false);
    assert.equal(row.slots.id.textContent, expected[index][0]);
    assert.equal(row.slots.meta.textContent, expected[index][1]);
  });
}
check('invented positive control displays the local note', () => assert.equal(positive.document.getElementById('release-local-note').hidden, false));
check('fallback assertion rejects displayed fixture releases', () => assert.throws(() => assertHidden(positive.document), assert.AssertionError));

console.log(JSON.stringify({
  status: 'passed', scope: 'Offline invented-fixture regression; no external API or browser acceptance',
  unchanged_production_script: 'releases.js',
  production_sha256: createHash('sha256').update(source).digest('hex'),
  html_sha256: createHash('sha256').update(html).digest('hex'),
  checks,
}, null, 2));
