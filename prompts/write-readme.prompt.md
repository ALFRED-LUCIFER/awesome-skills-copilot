---
name: write-readme
description: Generate a README.md from project structure analysis — auto-detects stack, scripts, and architecture
agent: agent
model: Claude Sonnet 4.6 (copilot)
tools: [search/codebase, edit, execute/runInTerminal]
---

Generate a README.md for this project.

## Step 1 — Analyze project

Read package.json / *.csproj / go.mod / Cargo.toml for metadata. Scan directory structure. Identify entry points, tech stack, and available scripts.

## Step 2 — Generate README

Include sections: project name + description, quick start (prerequisites, install, run), architecture overview (Mermaid diagram), available scripts/commands, configuration (env vars), testing, deployment, contributing, and license.

## Step 3 — Validate

Ensure all commands mentioned are real (match actual scripts). Ensure no secrets or internal URLs are included. Write to README.md.
