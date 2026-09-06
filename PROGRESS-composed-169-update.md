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
Implementation in progress.

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

## Next
- Add a new `methods/index.html` table row + compact `methods/*.json` evidence
  file presenting the accepted 169hh drill (household/person counts, ASEC/ACS
  arm split, cold/warm kernel-call counts), matching the page's existing row
  style and disclaimers.
- Update `methods/sipp-housing-measurement-20260906.json`'s limits bullet to
  stop calling the combined-survey run "in progress" and instead state its
  accepted completion, while keeping the ASEC-income/SIPP-housing "not measured
  together" claim intact and unrelated.
- Add one linking sentence each to `composition/paper.html` and
  `papers/index.html`'s running evidence-status caveats.
- Run local static/link checks (no browser automation); build/serve on port
  4575 only after confirming it's free (do not touch 4574/4562).
- Write the final report to
  `/Users/maxghenis/architecture-reviews/microcosm-20260904/us-site-composed-169-update-REPORT.md`
  and `.json`.
