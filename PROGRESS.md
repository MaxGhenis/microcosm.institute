# Progress: source-measurement methods notes (2026-09-05)

Branch `us-source-measurement-methods-20260905`, base f7e8057 (origin/master 820f9bf plus approved source-metadata notes 6a19ab3). Scope: methods notes and paper-facing context only. No push, deploy, dynamics/, PDF or historical-result edits.

## State
- In progress.

## Done
- Read methods/index.html, papers/index.html, composition/paper.html and the four existing methods/*.json summaries.
- Read the nine root evidence files (ASEC v3 source preparation, student-controls author report, Chronicle SIPP documentation report/receipt/verification log, SIPP primary-document follow-up, SIPP aggregate source audit summary/full JSON, SIPP field-contract root audit).
- Re-hashed the Chronicle SIPP artifact (manifest, claims file, three retained PDFs) and the ASEC T1 checkpoint and current-money payload; all match their receipts.
- Verified the zero-origin enum and 33-field money contract in the integrated source at e3cd8f3a.

## Next
1. Generate aggregate-only evidence JSON summaries under methods/ from the original artifacts (generator and verifier kept in the review directory, not the site).
2. Update methods/index.html: ASEC zero-origin distinction, SIPP survey-definition examples, Chronicle SIPP evidence, aggregate audit attribution, release-status limits.
3. Light paper-facing note updates (methods paper-context section, papers index caveat).
4. Run the link checker and static checks; adversarial claim verification against evidence.
5. Commit, verify the commit message, write the author report.
