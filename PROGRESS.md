# Progress: source-measurement methods notes (2026-09-05)

Branch `us-source-measurement-methods-20260905`, base f7e8057 (origin/master 820f9bf plus approved source-metadata notes 6a19ab3). Scope: methods notes and paper-facing context only. No push, deploy, dynamics/, PDF or historical-result edits.

## State
- Local implementation complete; independent final review pending. The original Fable authored-prose run ended at a capacity limit before its final report. Root preserved its partial evidence summaries and completed the HTML, later-run evidence and verification.

## Done
- Read methods/index.html, papers/index.html, composition/paper.html and the four existing methods/*.json summaries.
- Read the nine root evidence files (ASEC v3 source preparation, student-controls author report, Chronicle SIPP documentation report/receipt/verification log, SIPP primary-document follow-up, SIPP aggregate source audit summary/full JSON, SIPP field-contract root audit).
- Re-hashed the Chronicle SIPP artifact (manifest, claims file, three retained PDFs) and the ASEC T1 checkpoint and current-money payload; all match their receipts.
- Verified the zero-origin enum and 33-field money contract in the integrated source at e3cd8f3a.

## Root completion, September 5
- Added five aggregate-only evidence summaries, including the completed source-preparation v4 and the later SIPP annual-measurement audit. Earlier v3 refusal and then-current student review are explicitly historical, with the successor linked.
- Updated methods notes for ASEC zero origins, restored student observations, SIPP periods, suppression, status flags, annual coverage and household consistency. Linked these notes from paper context without changing historical experiments or planned-paper status.
- Source v4 prepared 432,523 people / 226,139 tax units / 168,852 households in 163.17 seconds and 6.82 GiB peak RSS. No policy population, graph, fit or calibration ran in this preparation. All nine input files and earlier money bytes were preserved.
- Root evidence verification passed: five summaries reproduce from pinned receipts; all nine SIPP excerpts re-extract from original PDFs; retained T1 and money bytes match; the exact immutable money implementation declares 33 fields. Fixed the verifier's optional missing-export check by requiring its exact Git blob.
- Three changed HTML pages pass the link checker and diff check. Actual WebKit passed 17 checks at 390/1280 widths, including evidence links/facts, no horizontal overflow or page errors, and normal-motion source-text visibility. Root viewed mobile preparation and desktop SIPP screenshots. An initial harness privacy regex mistook the schema name source_household_id for record data; the corrected structured-key check passed, and the failed log remains preserved.
- Local preview: port 4403. No deployment or remote changes.

## Next
Independent exact-revision review; resolve actionable findings before integration or publication. Scientific source/consumer corrections, calibration and candidate acceptance continue separately.
