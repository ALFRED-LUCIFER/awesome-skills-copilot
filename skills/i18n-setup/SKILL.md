---
name: i18n-setup
description: 'Internationalization scaffolding — react-intl, i18next, vue-i18n, .resx, gettext setup with extraction, translation workflow, and pluralization patterns'
---

# Internationalization Setup Skill

Set up internationalization (i18n) for any frontend or backend project.

## When to Use

- Adding multi-language support to a project
- Setting up translation extraction workflow
- Configuring locale switching and formatting (dates, numbers, currencies)
- Migrating hardcoded strings to translation keys

## Rules

1. Extract ALL user-facing strings — never hardcode text in components
2. Use ICU message format for pluralization and variables
3. Translation keys: hierarchical, descriptive (e.g., `user.profile.editButton`)
4. Default language (fallback) MUST always be complete — never missing keys
5. Date/number/currency formatting via Intl API or i18n library — never manual formatting
6. RTL support: use logical CSS properties (margin-inline-start vs margin-left)
7. Translation files: one per locale, JSON or YAML (e.g., en.json, de.json, fr.json)
8. Include context comments for translators (especially for short strings)

## Steps

1. Detect framework and choose i18n library (react-intl, i18next, vue-i18n, .resx, gettext)
2. Install and configure the i18n provider at app root
3. Create locale files directory structure: `locales/{lang}.json`
4. Extract existing hardcoded strings into the default locale file
5. Replace hardcoded strings with translation function calls (`t('key')`, `<FormattedMessage>`, etc.)
6. Configure locale detection (browser language, URL prefix, cookie)
7. Add locale switcher component
8. Set up extraction script to find untranslated strings

## Reference

See `./templates/` for per-framework i18n setup configurations.
