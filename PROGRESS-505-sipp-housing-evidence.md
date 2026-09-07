> Historical author record for head 67f42a6d, September 6, 2026. The successor local branch incorporates this work and corrects the independent review findings on voucher allocation, exclusion weight evidence and zero-rent scope; it also records contrary person-month receipt evidence and fixes duplicate MathJax loading. The author run counts below describe the earlier revision. Subsequent root checks passed 174 browser assertions, 30 correction checks and four mobile/desktop equation-render checks. This note does not claim publication or national/CD validation.

# Progress: 505-household evidence display and December housing measurement (2026-09-06)

Branch `us-505-sipp-evidence-site-20260906`, cut from the frozen accepted parent 7bac45d (`us-reference-composition-site-root-20260906`). Scope: methods notes, two aggregate evidence files and three paper status sentences. No push, deploy, publication, dynamics/, PDF or historical-result edits. The parent worktree stays at 7bac45d and is not touched.

The repository already carries a `PROGRESS.md` and two lane logs from earlier branches. This lane keeps its own file rather than overwriting theirs.

## State
Local implementation complete and verified. Independent exact-revision review pending. Nothing is pushed, deployed or published.

## Done
- Inspected the parent worktree: branch `us-reference-composition-site-root-20260906`, clean tree, HEAD 7bac45da80b44007beaf3ab13451db3b144fe428. Fetched `origin`; the repository's default remote branch is `master`, not `main`. Created this child worktree at 7bac45da and confirmed the parent is unchanged.
- Read the four root-accepted evidence files and the artifacts beneath them rather than the acceptance summaries alone: the 505-household export, output verification, root export binding, operator declaration, finalized preflight and WebKit receipt; and the housing projection's run information, diagnostics and marker observation.
- Re-hashed the four SIPP housing outputs at their recorded location. All four SHA-256 digests match the accepted review.
- Checked the three partitions arithmetically before writing anything: tenure classes, the exclusive exclusion order and the assistance classes each sum to 17,646 December residences, the voucher evidence states sum to 17,646, admitted rent quality sums to 4,348, and the summed mean-member weights by exclusion reproduce the 140,488,890.62 household total.
- Added `methods/us-sized-505-evidence-display-20260906.json` and `methods/sipp-housing-measurement-20260906.json`, both generated directly from the artifacts so no figure is hand-transcribed. They carry aggregate counts, digests, execution measurements and false release flags, and no local path, host detail, source row, identifier or model payload.
- Added one implementation row, `#sized-505-display`, and one survey-definitions subsection, `#sipp-housing-measurement`, with two tables in the page's existing `coverage-table` markup: the exclusive exclusion order over 17,646 residences and the four topcode marker fields. Added one row to the adapter-readiness table.
- Linked both anchors from `composition/paper.html` and the housing anchor from `support/paper.html`, where the rent-before-assistance contract is already discussed.

## Decisions
- The acceptance file's recorded render URL is a localhost address, and the deployed dashboard's `/pipeline` page is a static explainer that ignores the `candidate` and `manifest_sha256` parameters. Fetching it confirmed it renders none of the sized profile's figures. The row therefore links the site's existing relative `/calibration/dashboard/microcosm` path and states plainly that the deployment does not carry this candidate. No localhost URL and no candidate deep link appears on the site.
- The prose does not call the SIPP housing work a graph or count its modules as nodes, because the run is standard-library Decimal arithmetic bound to four modules, not a declared node graph. It states instead that the five-node reported-income graph and the four bound housing modules have not been measured together and that no combined run exists. The JSON records `asec_income_graph_nodes`, `bound_sipp_housing_modules` and `combined_asec_income_and_sipp_housing_measurement_has_run: false`.
- The earlier genuine 1% composition evidence and every other pre-existing row are untouched. The methods diff against 7bac45d is purely additive: 49 insertions, 0 deletions, and every base line is still present verbatim. Five of the added lines were later normalized from `&rsquo;`/`&ldquo;` entities to the page's own straight-apostrophe and curly-double-quote convention; no pre-existing line was touched. The two paper pages each gain text inside one existing line.

## Corrections after adversarial review

A verification pass over the drafted change confirmed four defects against the artifacts, all now fixed:

- The first32 rung observed 264 marker records, not 132. The artifact reports 132 rent and 132 utility marker records separately, two fields per person for 66 people. The prose quoted one group as the total, and the evidence file carried it under a key that said "per field", where per field is 66. Both now state 264 with the two groups named.
- "Currently eligible" appeared nowhere in any artifact, and on a page whose next sentence says every step is a source state rather than a judgement about a household, it read as a program-eligibility finding. The class is now named as the artifacts and the evidence file name it: 4,348 residences admitted as unassisted renters.
- "Report zero rent" and "report zero utilities" asserted respondent provenance that the same sentence then denied, and 291 of the 4,348 admitted rent amounts are imputed. Both now say the residences carry a zero amount.
- "The only weight in this file" widened the artifact's own scope. The run read 29 of the file's 5,200 columns, so the sentence now says the only weight this projection carries.

## Verification
- A cross-check script re-derives 91 displayed figures from the root artifacts and fails if any numeric token in the added HTML is unaccounted for. 91/91 pass, zero unaccounted tokens. It also re-checks that the first32 marker total is four fields times 66 people.
- The link checker passes on all three changed pages. Both new JSON files parse.
- Actual WebKit at 390 and 1280 passed 178 checks: both new anchors, every displayed figure, both tables and their row counts, the adapter row, fragment landings clear of the sticky header, no horizontal overflow, the paper-page anchors navigating to the methods anchors, both JSON files served with every release flag false and no local path, and the absence of any localhost URL or candidate deep link. Screenshots are saved beside the other site captures.
- `/support/paper.html` emits one page error, "TypeError: Attempted to assign to readonly property.", at the base commit 7bac45d as well. It is pre-existing and unrelated to this change; the render assertion requires that this lane introduce no new error.
- Local preview: ports 4571 and 4572, both stopped after the render. No deployment or remote changes.

## Next
Independent exact-revision review. A price bridge from December 2022 to the 2024 target period, a counterfactual gross housing charge, an admitted fit weight, a combined measurement and any calibrated candidate all remain outside this change.
