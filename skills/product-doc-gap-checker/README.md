# product-doc-gap-checker

> Audits existing product manual HTML for missing content, incomplete sections, placeholder gaps, and missing i18n keys.

## Purpose

Scans an existing product manual HTML file and identifies gaps: missing sections, placeholder content, incomplete data, and untranslated strings. Produces a structured gap report for `@product-manual` to act on.

## When to Use

- `@product-manual` when revisiting/updating existing manuals
- `/update-product-manual` prompt
- Pre-release documentation audit

## Checks Performed

- **10 Section Checks (A–J)** — Minimum content criteria per section
- **Structure Checks** — Valid HTML, navigation links, section ordering
- **Data Freshness** — Version numbers, dates, feature lists
- **Translation Coverage** — Missing i18n keys, hardcoded strings

## Tools Used

`grep`, `sed`, file analysis

## Used By

- `@product-manual` agent
- `/update-product-manual` prompt
