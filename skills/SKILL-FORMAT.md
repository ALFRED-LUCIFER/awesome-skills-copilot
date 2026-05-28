---
name: SKILL-FORMAT
description: 'Mandatory format standard for all SKILL.md files — enforces token-efficient structure. Every skill in this repo MUST comply.'
---

# SKILL.md Format Standard

All skills must follow this compressed format to minimize token consumption.

## Structure (in order)

```
1. YAML frontmatter (name + description)
2. # Title (one line)
3. ## When to Use (3-5 bullet points max)
4. ## Rules (numbered, max 10, one line each)
5. ## Steps (numbered, 1-2 sentences each, max 8 steps)
6. ## Reference (optional — link to ./examples.md or ./templates/)
```

## Constraints

- **Max 150 lines** total (including frontmatter)
- **Max ~400 tokens** at full load
- **No prose paragraphs** — bullets and numbered lists only
- **No inline code blocks >5 lines** — move to `./examples.md`
- **No worked examples in SKILL.md** — move to `./examples.md`
- **No full templates in SKILL.md** — move to `./templates/{name}.ext`
- **No repeated rules** — state once, reference if needed elsewhere
- **No "Why" or "Background" sections** — the description field covers this

## Sibling Files

| File | Purpose | Loaded |
|------|---------|--------|
| `SKILL.md` | Rules + steps only | Always (by agent) |
| `examples.md` | Worked examples, before/after | On-demand (full tier) |
| `templates/` | Code templates, manifests | On-demand (full tier) |
| `README.md` | Human docs (optional) | Never by agent |

## Token Budget Integration

The `token-budget-loader` skill uses this structure:
- **Summary tier**: reads lines 1–30 (frontmatter + title + when-to-use)
- **Standard tier**: reads full SKILL.md (≤150 lines)
- **Full tier**: reads SKILL.md + examples.md + templates/

## Frontmatter Rules

```yaml
---
name: kebab-case-name          # Must match folder name
description: 'Single line...'  # Used for skill discovery — be keyword-rich
---
```

## Checklist for Compression

When compressing an existing skill:
1. Move all code blocks >5 lines → `./examples.md`
2. Move all template files → `./templates/`
3. Rewrite prose as numbered rules (one line each)
4. Rewrite procedures as numbered steps (1-2 sentences)
5. Remove "Background", "Why", "Context" sections
6. Verify `wc -l SKILL.md` ≤ 150
7. Verify frontmatter `description` unchanged
8. Add `## Reference` link if sibling files created
