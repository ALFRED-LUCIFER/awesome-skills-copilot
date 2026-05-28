# Awesome Skills Copilot — Copilot Instructions

> This repository contains a production-ready AI agent system for GitHub Copilot and Claude Code.
> Clone it, symlink the folders, or install as a plugin to supercharge your development workflow.

## How This Repo Works

- **Agents** (`agents/`) — 15 specialized Copilot agents with handoff chains and quality gates
- **Skills** (`skills/`) — 28 self-contained skill folders with domain knowledge
- **Prompts** (`prompts/`) — 15 reusable prompt templates for common workflows
- **Hooks** (`hooks/`) — 5 automated session hooks (secrets scanning, audit logging, etc.)
- **Instructions** (`instructions/`) — Auto-injected coding standards by file pattern
- **Plugins** (`plugins/`) — 3 installable bundles for fullstack, testing, and planning

## Quality Overrides

Override these defaults in your project's `copilot-instructions.md`:

| Threshold | Default |
|-----------|---------|
| `REVIEW_PASS_THRESHOLD` | 5 |
| `FRONTEND_COVERAGE_MIN` | 90% |
| `BACKEND_COVERAGE_MIN` | 95% |
| `MAX_REVIEW_ITERATIONS` | 3 |
| `CYPRESS_MANDATORY` | true |
| `MIGRATION_AUTO_DETECT` | true |

## Dependency Change Policy

Any new npm or NuGet dependency added by an agent requires explicit user confirmation with justification before installation. Agents must not silently add packages.

## Memory & Context Retention

Two-layer memory system to reduce context loss across sessions:

- **Shared** (`memories/org/`): Conventions, anti-patterns, and architectural decisions.
- **Repo-level** (`.copilot/memories/repo/` in each project): Session summaries and gotchas.

## Knowledge Base

Domain knowledge maintained as a living knowledge base via `/knowledge-init`:

- **`{folder}/AGENTS.md`** — 1-page domain index per feature folder
- **`docs/{domain}.md`** — Deep knowledge doc per domain
- **`docs/INDEX.md`** — Master index with project metadata

The `knowledge-drift` hook detects source file changes and flags stale docs. Run `/knowledge-init --update` to refresh.

## Getting Started

```bash
# Clone and validate
git clone https://github.com/YOUR-ORG/awesome-skills-copilot.git
cd awesome-skills-copilot && npm install && npm run validate

# Symlink into your Copilot config
ln -s $(pwd)/agents ~/.copilot/agents
ln -s $(pwd)/skills ~/.copilot/skills
```

See [README.md](README.md) for full setup instructions.
