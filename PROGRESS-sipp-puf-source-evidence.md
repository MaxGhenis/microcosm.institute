# Progress — SIPP and PUF source evidence on the site

## State
Fresh child worktree `microcosm-site-sipp-puf-evidence-20260905`, branch
`us-sipp-puf-source-evidence-site-20260905`, created from
`d7cef4bc55f49417e0d6b4e2b2a01014f58f7279` so the dependent site history
(source metadata → source measurement → current-income graph → housing graph)
is preserved. The base branch was not rebased or reset.

## Done
- Read the three root output reviews and their JSON companions in
  `~/architecture-reviews/microcosm-20260904`.

## Next
- Verify the named aggregate `coverage.json` digest.
- Add one aggregate evidence JSON under `/methods`.
- Add a source-coverage table and narrative to `/methods#sipp-definitions`.
- Note the source-only status on the composition paper page.
- Run `scripts/check_site_links.py` and record the report.

## Scope limits held throughout
Source-design-weight coverage only. No calibration fit, target sums, period
mapping, growth factors, imputation, donor admission, representativeness or
release eligibility. No original data, projection payloads, captured main or
demographics rows, source key rows, local filesystem paths or model
calculations enter the site.
