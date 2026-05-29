## Summary

<!-- What does this PR do? One-liner. -->

## Type of Change

- [ ] 🤖 New agent (`agents/*.agent.md`)
- [ ] 🧠 New skill (`skills/*/SKILL.md`)
- [ ] 📝 New prompt (`prompts/*.prompt.md`)
- [ ] 🪝 New hook (`hooks/*/`)
- [ ] 🔌 Plugin update (`plugins/*/`)
- [ ] 📋 Instruction update (`instructions/*.instructions.md`)
- [ ] 📖 Documentation only
- [ ] 🐛 Bug fix
- [ ] 🔧 Tooling / CI

## Checklist

> All items must be checked before merging.

### Navigation & Counts

- [ ] `README.md` badges updated (agent/skill/hook/plugin/prompt counts)
- [ ] `README.md` catalog table updated with new entries
- [ ] `AGENTS.md` navigation index updated (Directory Map + tables)
- [ ] Counts in `README.md` match counts in `AGENTS.md`

### Format Compliance

- [ ] Agents have valid YAML frontmatter (`name`, `description`, `tools`, `model`)
- [ ] Skills follow `skills/SKILL-FORMAT.md` (≤ 150 lines, YAML frontmatter)
- [ ] Prompts have valid YAML frontmatter (`name`, `description`)
- [ ] Hooks have `hooks.json` + executable script + `README.md`

### Quality

- [ ] `npm run validate` passes
- [ ] No duplicate agent/skill/prompt names
- [ ] No broken cross-references between agents ↔ skills

## Linked Issues

<!-- Closes #123 -->

## Screenshots / Examples

<!-- If applicable, show before/after or usage examples. -->
