# explain-file

> Deep file analysis — type detection, layer mapping, dependency tracing, and test counterpart lookup.

## Purpose

Provides structured analysis of any source file: identifies its architectural layer, purpose, dependencies, callers, and corresponding test file. Supports both .NET (8 patterns) and React/TypeScript (10 patterns).

## When to Use

- `/explain-file` slash command
- Understanding unfamiliar files in the codebase
- Pre-modification context gathering

## Output Template

- **Purpose** — What the file does
- **Layer** — Controller / Service / Repository / Component / Hook / etc.
- **Depends on** — Direct dependencies and imports
- **Called by** — Files that reference this file
- **Test counterpart** — Corresponding test file location

## Detection Patterns

### .NET (8 patterns)
Controller, Service, Repository, DTO, MappingProfile, Migration, Configuration, Startup

### React/TypeScript (10 patterns)
Page, Dialog, Component, Controller Hook, Query Hook, Mutation Hook, Types, Constants, Utils, Test

## Used By

- `/explain-file` prompt
