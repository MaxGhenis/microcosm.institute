# Progress: composed ASEC+ACS 169-household drill — site update (2026-09-06)

Branch `microcosm-site-composed-169-update-20260906`, cut from the accepted parent
`us-505-sipp-site-root-20260906` at 8e93a6e8946de41d474d258b713a5846f3902f9d, which
already contains `origin/master` (ec1a11551ed5f11e3ad7b3d33f3bab5455781faa) as a
verified ancestor (`git merge-base --is-ancestor origin/master HEAD` passed before
branching). No merge was needed to include the maintained base. The parent worktree
(`microcosm-site-505-sipp-root-20260906`) is untouched; all 18 pre-existing worktrees
were confirmed still present after creating this one (19 total).

The repository already carries a `PROGRESS.md` and several lane logs from earlier
branches. This lane keeps its own file rather than overwriting theirs (an initial
accidental overwrite of the shared `PROGRESS.md` was caught and reverted with
`git checkout -- PROGRESS.md` before any commit).

Scope: local, bounded site/paper update reflecting the accepted combined ASEC+ACS
169-household engineering drill. No nested agents, no deployment, push, remote merge
or publication. No calibration, representative-quality, national/CD-quality, transfer
fit, release or launch claim. No design/product scope expansion.

Root acceptance evidence (compact files only, never the 11 MB run receipt):
- `/Users/maxghenis/architecture-reviews/microcosm-20260904/us-composed-169hh-completion-root-acceptance.md`
- `/Users/maxghenis/architecture-reviews/microcosm-20260904/us-composed-169hh-completion-root-acceptance.json`
- Run receipt (referenced only, never opened): `/Users/maxghenis/PolicyEngine/_buildo-runtime/out/us-graph-launch-20260905/composed-asec-acs-169hh-84e7a011-v1/run-receipt.json`, sha256 `99d0335641effc8352dce63e6bddb8904733ddc431f4e1bf7e4244fb39943021`

Key accepted facts to present: 169 households = 16 ASEC + 153 ACS, 383 people,
9 cold kernel calls, 9 fresh warm cache hits / 0 kernel calls, cold and warm
checkpoints byte-identical (sha256 `96d1be7f1a9028f0779934f7f693bf3542f1ecfbe99427750f04201bead6b283`).

## State
Local implementation complete and verified. Independent exact-revision review pending.
Nothing pushed, deployed, merged remotely or published.

## Done
- Inspected parent worktree: branch, clean status, HEAD 8e93a6e, AGENTS file search
  (none found at repo root or in `.claude/`), README and PROGRESS files read.
- Fetched `origin`; default remote branch is `master`. Confirmed `origin/master`
  (ec1a115) is an ancestor of the parent's HEAD — the maintained base is already
  included, no additional merge required.
- Created this child worktree/branch directly from 8e93a6e.
- Read the two compact root-acceptance artifacts (`.md` + `.json`, ~4 KB each).
  Did not open the 11 MB run receipt.
- Located the only site text describing this drill as "in progress":
  `methods/sipp-housing-measurement-20260906.json` limits array, added in the
  parent's last commit (8e93a6e): "a separate combined-survey run is in progress."
  This is distinct from the (still-pending, unrelated) claim that the five-node
  ASEC income graph and the four bound SIPP housing modules have not been
  measured together — that remains true and unchanged.
- Confirmed the existing "survey multispine first, then PUF clones" architecture
  language (`index.html`, `support/index.html`) is a forward-looking design
  description, unrelated to this drill's status, and must not be touched.
- Confirmed `support/index.html`'s "ACS channel is planned / not yet integrated"
  describes the production *support* synthesis pipeline (a different subsystem
  from this graph-engineering drill) — left untouched per "no design/product
  scope expansion."
- Confirmed the existing 505-household ASEC-only rows (`reported-income-505hh`,
  `sized-505-display` in `methods/index.html`) must stay separate and not be
  relabeled as "combined" — left untouched, and the new content explicitly
  distinguishes itself from them.
- Accidentally overwrote the shared `PROGRESS.md` with `Write`; caught immediately
  via `git status`/`git diff --stat`, reverted with `git checkout -- PROGRESS.md`
  before any commit, and moved this log to its own file.
- Added `methods/us-composed-169hh-asec-acs-drill-20260906.json`, a compact
  evidence file (32 top-level keys) generated only from the two compact root
  artifacts, matching the site's existing per-row evidence-file convention.
  It carries entity/arm counts, checkpoint digests, execution measurements and
  the same disclaimers as the root acceptance, and states explicitly that no
  PUF clone and no prior-year wage lookback are attached.
- Added one `methods/index.html` table row, `#composed-asec-acs-169hh`, in the
  same position/style as neighboring rows (after `#sized-505-display`), stating
  169 households (16 ASEC, 153 ACS), 383 people, 9 cold kernel calls, 9 fresh
  warm cache hits, 0 warm kernel calls, and explicitly distinguishing this pool
  from the separate 505-household ASEC-only evidence.
- Rewrote the one stale "in progress" limits bullet in
  `methods/sipp-housing-measurement-20260906.json` to state the drill's
  acceptance while restoring the original, still-accurate claim that the ASEC
  income graph and SIPP housing modules have not been measured together (that
  claim is unrelated to this drill and was not weakened or removed).
- Added one linking sentence each to `composition/paper.html` and
  `papers/index.html`'s running evidence-status caveat paragraphs, referencing
  `#composed-asec-acs-169hh`; neither paper's plan-stage/TODO status changed.
- Left untouched: `support/index.html`'s "ACS channel is planned" architecture
  language, the "survey multispine first, then PUF clones" diagrams, the
  505-household rows, and all SIPP/PUF source-only scope statements.
- Verification: all touched/added JSON parses (`python3 -m json.tool`);
  `python3 -m html.parser` parses all three touched HTML files cleanly;
  `scripts/check_site_links.py` passes with zero failures on the four changed
  pages, and a full-site run (all 27 HTML pages) shows the same pre-existing
  failures (one missing PDF in `dynamics/web`, several missing LaTeX-generated
  fragment anchors in `firms/web` and `sparsity/web`) as the unmodified parent
  commit — confirmed identical by running the same checker against the parent
  worktree at 8e93a6e, so no new failures were introduced.
- Confirmed ports 4574 and 4562 were already in use by other sessions (left
  untouched) and 4575 was free. Served the new worktree on 127.0.0.1:4575 with
  `python3 -m http.server`, fetched all five changed/added URLs (all HTTP 200),
  round-tripped the new JSON's key figures via `urllib`/`json` to re-confirm
  169/16/153/383/9/9/0 against the served copy, then killed the server and
  confirmed the port was free again.
- Committed the content change as `de809e1` on top of the progress-log commit
  `dbb829c`. Verified the exact recorded message with `git log -1 --format=%B`
  and confirmed a clean working tree afterward. No commit hooks fired (only
  `.sample` hooks exist in this repo's `.git/hooks`, confirming hooks are
  disabled here).
- Re-confirmed after the content commit: parent worktree still at 8e93a6e with
  a clean tree, and `git worktree list` still shows all 18 pre-existing
  worktrees plus this one (19 total) — nothing else was touched.

## Next
- Write the final report to
  `/Users/maxghenis/architecture-reviews/microcosm-20260904/us-site-composed-169-update-REPORT.md`
  and `.json`.
- This lane's local verification is complete; independent exact-revision
  review, any push/deploy/merge, and root acceptance of this lane remain
  separate and out of scope here.
