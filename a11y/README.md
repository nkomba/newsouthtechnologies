# Accessibility compliance tooling

This folder makes Section 508 / WCAG 2.1 AA compliance **continuous and verifiable**
instead of a one-time manual review.

## One-time setup

```bash
npm run setup     # installs dependencies + the headless Chromium browser
```

(Equivalent to `npm install && npx playwright install chromium`.)

## Commands

| Command | What it does |
| --- | --- |
| `npm run a11y` | Runs axe-core against **every published page** in headless Chromium, checking the `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, and `section508` rule sets. Prints a pass/fail summary and writes `a11y/report/axe-report.json`. Exits non-zero if any violation is found (so it can gate a commit or CI build). |
| `npm run a11y:sync` | Regenerates the accessibility statement everywhere from the single source of truth (`a11y/statement.config.json`). |
| `npm run a11y:check` | Verifies every page/template is in sync with the config **without writing** — fails if anything drifted. Good for CI. |

## Single source of truth

`a11y/statement.config.json` holds the canonical facts (standards, conformance
level, evaluation date, last-updated date, contact emails, response time, URLs).

Edit that file, then run `npm run a11y:sync`. The build script propagates the
values into:

- `accessibility.html` — the volatile fields, via inline markers
  (`<!--A11Y:evaluationDate-->…<!--/A11Y:evaluationDate-->`).
- Every document template in `documents/Templates/*.html` — the accessibility
  notice block, between `<!-- A11Y:notice:start -->` / `<!-- A11Y:notice:end -->`.

Never hand-edit the generated regions; they are overwritten on every sync.

## Recommended workflow

1. Make content or component changes.
2. `npm run a11y:sync` if you touched anything in the statement/config.
3. `npm run a11y` before committing; fix any reported violations.
4. In CI, run `npm run a11y:check` and `npm run a11y` as required checks.

The generated `a11y/report/axe-report.json` is a dated, per-page audit artifact
suitable for procurement reviewers.
