# Progress: reference coverage and integration evidence (2026-09-06)

Branch `us-reference-composition-site-20260906`, cut from `origin/master` 83fdbed and fast-forwarded to the frozen accepted parent 425a6be (`us-source-fit-evidence-20260906`). Scope: methods notes, one aggregate evidence file and paper status passages only. No push, deploy, publication, dynamics/, PDF or historical-result edits. The parent worktree stays at 425a6be and is not touched.

## State
Local implementation complete and verified. Independent exact-revision review pending. Nothing is published or deployed.

## Done
- Fetched `origin/master` (83fdbed) and confirmed it is an ancestor of the frozen parent 425a6be, so the child fast-forwarded cleanly with no merge commit.
- Read the three accepted root artifacts and their underlying receipts rather than the acceptance summaries alone: the district reference-completeness projection, the direct national ACS reference capture and the reference/income code-integration acceptance.
- Confirmed the seven controlled population margins are the seven at-large districts (Alaska, Delaware, the District of Columbia, North Dakota, South Dakota, Vermont and Wyoming), all carrying the same `-555555555` sentinel on `S0101_C01_001`, and that they are one set of seven counted under both projected blocks rather than fourteen cells. The row says so.
- Confirmed the projection indexed the reserved `B19001` and `B25003` families for structure only and read no reserved cell, and that its own output declares national reference cells unavailable from district sums.
- Confirmed the integration run receipt declares "invented fixtures only; no genuine references, source microdata or model calculations", and that its 174 tests come from five named test files at head 194a54f6.
- Read the household-income module at that head and confirmed both stated lessons in its own source: `asec_HTOTVAL`'s printed universe is All Households, so a consumer must bind an independently carried housing-universe mask, and neither arm sums components because the carried ACS person roster holds six of the publisher's eight income types.
- Added `methods/us-reference-composition-integration-20260906.json`, generated directly from the root artifacts so no figure is hand-transcribed. It carries counts, digests, elapsed time, peak bytes and the false release flags. It carries no reference estimate or margin, no reserved-family value, no module roster, no local path and no credential.
- Added two methods rows, `#cd-reference-coverage` and `#reference-income-integration`, moved the hero date to September 6, added one launch-boundary sentence to the release-evidence row and one sentence to the geographic-scope section. The source-to-reference chain appears as plain sentences; no diagram was added, since the page carries no figures and dashed pending nodes would invite reading unbuilt work as executed.
- Linked both anchors from `composition/paper.html` and `papers/index.html`, and the integration anchor from `calibration/paper.html`. `evaluation/paper.html` is unchanged, because no candidate was scored.
- All existing rows, ACS rent, SIPP, PUF, 505-household and 15-household content, citations and JSON links are byte-identical; the diff touches four existing lines only.

## Verification
- Link checker passes on all five pages. The new JSON parses.
- A cross-check script re-derives all 37 displayed figures from the three root JSONs, the reference inventory, the integration run receipt and the household-income module source; 37/37 pass. Two early failures were the checker's own line-wrap assumptions, corrected in the checker, not in the pages.
- Actual WebKit render at 390 and 1280 passed 65 checks: both rows and their limitation sentences, the launch-boundary and geography sentences, the preserved SIPP/PUF/505-household facts, fragment landing clear of the sticky header, no horizontal overflow, the JSON served with every release flag false and no reference value, the paper links, and zero page errors. Screenshots and receipts are saved beside the other site captures; an earlier failing run's log is preserved.
- Local preview: port 4534, stopped after the render. No deployment or remote changes.

## Next
Independent exact-revision review. A genuine composed population, calibration, national and district validation and pruned release checks remain outside this change.
