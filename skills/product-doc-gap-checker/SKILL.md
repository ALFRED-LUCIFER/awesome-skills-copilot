---
name: product-doc-gap-checker
description: "Audits an existing product manual HTML for missing content, incomplete sections, placeholder gaps, and missing i18n keys. Reports a catalog of what needs to be added. Used by @product-manual when re-visiting or updating an existing manual. Use when: check manual completeness, find missing docs, audit documentation, gap analysis, manual review, update manual, add missing content."
---

# Manual Gap Checker Skill

Run this audit against any previously generated `*-manual.html` to produce a **gap report** listing exactly what content is missing, incomplete, or outdated.

---

## How to Use

```bash
# 1. Parse the existing HTML for sections and content density
HTML_FILE="path/to/{product}-{version}-manual.html"

# 2. Count placeholder boxes (unfilled content)
PLACEHOLDERS=$(grep -c "box-placeholder" "$HTML_FILE")

# 3. Count MISSING translation markers
MISSING_KEYS=$(grep -c "\[MISSING" "$HTML_FILE")

# 4. Count empty table bodies
EMPTY_TABLES=$(grep -c "<tbody>\s*</tbody>\|<tbody><!--" "$HTML_FILE")

# 5. Check each mandatory section exists and has min content
for SEC in sec-a sec-b sec-c sec-d sec-e sec-f sec-g sec-h sec-i; do
  LINES=$(sed -n "/<section id=\"$SEC\"/,/<\/section>/p" "$HTML_FILE" | wc -l)
  echo "$SEC: $LINES lines"
done
```

---

## Gap Catalog — Required Checks

The agent MUST check all items below and report status for each:

### Section Completeness

| Section | Minimum Criteria | How to Check |
|---------|-----------------|--------------|
| A · Purpose | Product name, purpose sentence, audience table (≥2 roles), ≥3 out-of-scope items | Count `<tr>` in audience table; count `<li>` in NOT-FOR list |
| B · Safe Use | ≥1 `.box-warning`, ≥3 misuse examples, product-type statement | Count warning boxes; count list items under misuse heading |
| C · System Overview | Role/permission table, ≥3 screens listed, domain feature list | Count table rows; count screen entries |
| D · First Steps | ≥4 `.step` elements, prerequisites list | Count `.step` divs |
| E · Workflows | ≥3 `<h3>` workflow headings, each with ≥3 steps | Count h3 + step divs per workflow |
| F · Troubleshooting | ≥5 `<tr>` in troubleshooting table (excl. header) | Count `<tr>` inside `#sec-f tbody` |
| G · Error Messages | ≥5 `<tr>` in error table, no invented IDs | Count rows; verify IDs match i18n source |
| H · CRA Security | Secure config checklist, update procedure, backup steps, security contact, SBOM reference | Check for presence of each subsection |
| I · Legal/OSS | Copyright line, ≥10 OSS packages listed | Count `<tr>` in OSS table |
| J · Icons Glossary | Icon → Meaning → Where table (optional — skip if no icon-heavy UI) | Count rows if section exists |

### Structure Checks

Before section content, verify the HTML skeleton itself:

- [ ] `<!DOCTYPE html>` declaration present
- [ ] `<html lang="...">` attribute set
- [ ] All 6 Org CSS variables defined (violet, gray-70, gray-30, blue, yellowgreen, darkgray)
- [ ] Header with violet background (`--myorg-violet`)
- [ ] Logo SVG inline (not `<!-- placeholder -->` or empty `<svg>`)
- [ ] Left navigation sidebar with anchor links to all sections
- [ ] Search input with `aria-label`
- [ ] Language switcher wired to `applyTranslations()`
- [ ] Print button present
- [ ] Footer with copyright
- [ ] No `.box-placeholder` on inline elements (`<dd>`, `<span>`) — only on `<div>`

### Data Freshness

| Check | How |
|-------|-----|
| i18n keys match current source | Compare `data-t` attributes in HTML vs current `src/i18n.tsx` keys |
| Route/screen list is current | Compare screens in HTML vs current `Router.tsx` paths |
| OSS list matches `package.json` | Compare listed packages vs current production deps |
| Version number is current | Compare metadata box version vs `package.json` version |

### Translation Coverage

| Check | How |
|-------|-----|
| All languages populated | Count keys per language in TRANSLATIONS object; flag any with 0 |
| No `[MISSING ...]` markers visible | grep for `\[MISSING` in rendered text nodes |
| New keys since last generation | Diff current i18n source keys vs keys in HTML TRANSLATIONS |

### Accessibility Gaps

| Check | How |
|-------|-----|
| All `<th>` have `scope="col"` | grep `<th>` without scope |
| All sections have `aria-labelledby` | grep `<section` without aria-labelledby |
| Interactive elements have `aria-label` | Check `<input>`, `<select>`, `<button>` for aria-label |
| Logo has alt text or `aria-label` | Check SVG wrapper for accessible name |

---

## Output Format

The agent MUST produce this structured gap report:

```markdown
## 📋 Manual Gap Report — {product-name} v{version}

**File:** `{filename}`
**Audit Date:** {date}
**Overall Status:** ✅ Complete | ⚠️ Gaps Found | ❌ Major Gaps

---

### Summary

| Metric | Count |
|--------|-------|
| Placeholder boxes remaining | {n} |
| Missing translation keys | {n} |
| Empty/insufficient sections | {n} |
| Stale data (outdated vs source) | {n} |
| Accessibility issues | {n} |

---

### Section-by-Section

| Section | Status | Gap Description | Action Required |
|---------|--------|-----------------|-----------------|
| A | ✅/⚠️/❌ | {description} | {what to add} |
| B | ✅/⚠️/❌ | {description} | {what to add} |
| ... | | | |

---

### Missing Data Catalog

Items that need to be sourced from the product team or codebase:

1. **[Section X]** — {specific missing item} — Source: {where to get it}
2. **[Section Y]** — {specific missing item} — Source: {where to get it}
...

---

### Stale Content (needs refresh)

| Item | In Manual | In Source | Action |
|------|-----------|-----------|--------|
| Version | 3.1 | 4.0 | Update metadata box |
| Route `/old-page` | Present | Removed | Delete from Section C |
| New route `/new-feature` | Missing | Present | Add to Section C |
| Package `lodash` | 4.17.20 | 4.17.21 | Update in Section I |
```

---

## Agent Behaviour After Gap Report

1. Present the gap report to the user.
2. Ask: _"Which gaps should I fill now? I can update the HTML with available data or mark remaining items as placeholders for the product team."_
3. For gaps that CAN be auto-filled (new routes, new i18n keys, updated OSS list): offer to patch immediately.
4. For gaps that CANNOT be auto-filled (business content, support dates, security contacts): list them as action items for the product owner.
5. After patching, re-run the audit to confirm improvements.

---

## Integration with @product-manual

The `@product-manual` agent should invoke this skill:
- **After initial generation** — as a self-check before delivering.
- **On re-invocation** — when user says "update manual" or "check what's missing".
- **After source code changes** — to detect stale content.

Trigger phrases: "check manual", "what's missing in the docs", "audit documentation", "update manual", "gap analysis", "refresh manual"
