# Progress: reference coverage and integration evidence (2026-09-06)

Branch `us-reference-composition-site-20260906`, cut from `origin/master` 83fdbed and fast-forwarded to the frozen accepted parent 425a6be (`us-source-fit-evidence-20260906`). Scope: methods notes, one aggregate evidence file and paper status passages only. No push, deploy, publication, dynamics/, PDF or historical-result edits. The parent worktree stays at 425a6be and is not touched.

## State
Setup complete. Root artifacts read and cross-checked; prose and evidence file pending.

## Done
- Fetched `origin/master` (83fdbed) and confirmed it is an ancestor of the frozen parent 425a6be, so the child fast-forwarded cleanly with no merge commit.
- Read the three accepted root artifacts and their underlying receipts rather than the acceptance summaries alone: the district reference-completeness projection, the direct national ACS reference capture and the reference/income code-integration acceptance.
- Confirmed the seven controlled population margins are the seven at-large districts (Alaska, Delaware, the District of Columbia, North Dakota, South Dakota, Vermont and Wyoming), all carrying the same `-555555555` sentinel on `S0101_C01_001`, and that they are one set of seven counted under both projected blocks rather than fourteen cells.
- Confirmed the projection indexed the reserved `B19001` and `B25003` families for structure only and read no reserved cell, and that its own output declares national reference cells unavailable from district sums.
- Confirmed the integration run receipt declares "invented fixtures only; no genuine references, source microdata or model calculations", and that its 174 tests come from five named test files at head 194a54f6.
- Read the household-income module at that head and confirmed both stated lessons in its own source: `asec_HTOTVAL`'s printed universe is All Households, so a consumer must bind an independently carried housing-universe mask, and neither arm sums components because the carried ACS roster holds six of the publisher's eight income types.

## Next
Add the aggregate evidence file, the two methods rows and the paper status sentences; then run the link checker, the figure cross-check and a WebKit render at 390 and 1280.
