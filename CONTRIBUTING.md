# Contributing to Awesome Skills Copilot

Thank you for your interest in contributing! This collection of agents, skills, hooks, and plugins helps developers work more effectively with GitHub Copilot and Claude Code.

## Table of Contents

- [What We Accept](#what-we-accept)
- [Quality Guidelines](#quality-guidelines)
- [How to Contribute](#how-to-contribute)
  - [Adding Agents](#adding-agents)
  - [Adding Skills](#adding-skills)
  - [Adding Hooks](#adding-hooks)
  - [Adding Plugins](#adding-plugins)
- [Submitting Your Contribution](#submitting-your-contribution)
- [License](#license)

## What We Accept

We welcome contributions covering any technology, framework, or development practice:

- Programming languages and frameworks
- Development methodologies and best practices
- Architecture patterns and design principles
- Testing strategies and quality assurance
- DevOps and deployment practices
- Accessibility and inclusive design
- Performance optimization techniques

## What We Don't Accept

- Content that violates Responsible AI principles
- Instructions designed to bypass security policies
- Content that duplicates what frontier models already handle well without meaningful uplift

## Quality Guidelines

- **Be specific**: Generic instructions are less helpful than specific, actionable guidance
- **Test your content**: Ensure your agents/skills work with GitHub Copilot and/or Claude Code
- **Follow conventions**: Use consistent formatting and naming
- **Keep it focused**: Each file should address a specific use case
- **Write clearly**: Use simple, direct language

## How to Contribute

### Adding Agents

Agents are specialized configurations that transform Copilot Chat into domain-specific assistants.

1. Create a new `.agent.md` file in `agents/`
2. Use lowercase filenames with hyphens (e.g., `react-performance-expert.agent.md`)
3. Include YAML frontmatter with required fields

**Example agent format:**

```yaml
---
name: "my-agent"
description: "Brief description of the agent and its purpose"
tools: ["search/codebase", "edit/editFiles", "execute/runInTerminal"]
model: "copilot-chat"
user-invocable: true
---

You are an expert [domain/role] with deep knowledge in [specific areas].

## Your Expertise
- [Specific skill 1]
- [Specific skill 2]

## Your Approach
- [How you help users]
- [What you prioritize]
```

**Supported tool namespaces:**

| Tool | Purpose |
|------|---------|
| `search/codebase` | Search files and code |
| `edit/editFiles` | Edit files in the workspace |
| `execute/runInTerminal` | Run terminal commands |
| `execute/getTerminalOutput` | Read terminal output |
| `read/terminalLastCommand` | Get last terminal command |
| `todo` | Manage todo lists |
| `agent` | Delegate to sub-agents |
| `vscode/memory` | Read/write memory files |
| `vscode/askQuestions` | Ask the user questions |
| `vscode/openErrors` | Get editor diagnostics |

### Adding Skills

Skills are self-contained folders with a `SKILL.md` file and optional bundled assets.

1. Create a new folder in `skills/` (lowercase with hyphens)
2. Add a `SKILL.md` with YAML frontmatter (`name` + `description`)
3. Optionally add a `README.md` for human-readable docs
4. Add any bundled assets (templates, references)

**Example SKILL.md:**

```yaml
---
name: my-skill
description: "Clear description of what this skill does and when to use it"
---

# My Skill

Instructions for the AI agent when this skill is invoked.

## When to Use
- Scenario 1
- Scenario 2

## Steps
1. Step one
2. Step two
```

### Adding Hooks

Hooks are automated actions triggered during Copilot agent sessions.

1. Create a new folder in `hooks/` (lowercase with hyphens)
2. Add `README.md` with frontmatter (`name`, `description`, optional `tags`)
3. Add `hooks.json` with event configuration
4. Add executable scripts (`chmod +x script.sh`)

**Example hook structure:**

```
hooks/my-hook/
├── README.md       # Documentation with frontmatter
├── hooks.json      # Event configuration
└── my-script.sh    # Bundled script
```

### Adding Plugins

Plugins bundle related agents, skills, and prompts into installable packages.

1. Create a new folder in `plugins/` (lowercase with hyphens)
2. Add `plugin.json` with metadata
3. Add `README.md` with usage instructions

**Example plugin.json:**

```json
{
  "name": "my-plugin",
  "description": "Plugin description",
  "version": "1.0.0",
  "agents": ["../../agents/my-agent.agent.md"],
  "skills": ["../../skills/my-skill/"],
  "keywords": ["category", "workflow"],
  "license": "MIT"
}
```

## Submitting Your Contribution

1. Fork this repository
2. Create a branch from `main`
3. Add your content following the guidelines above
4. Run validation: `npm run validate`
5. Submit a pull request with a clear description

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
