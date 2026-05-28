# trace-bug

> Structured root-cause analysis from error messages or stack traces — ranks causes by likelihood and provides targeted fixes.

## Purpose

Takes an error message or stack trace and performs systematic root-cause analysis. Traces through the call chain, searches for related patterns, ranks potential causes by confidence level, and suggests targeted fixes.

## When to Use

- `/trace-bug` prompt
- Debugging production errors
- Analyzing stack traces from logs
- Understanding error propagation paths

## 6-Step Process

1. **Parse Error** — Extract error type, message, and stack frames
2. **Read Source Files** — Load files referenced in the stack trace
3. **Trace Call Chain** — Follow the execution path through layers
4. **Search Related Patterns** — Find similar patterns/issues in codebase
5. **Rank Root Causes** — High / Medium / Low confidence ranking
6. **Suggest Targeted Fixes** — Specific code changes for each potential cause

## Tools Used

- File reading, `grep`, `git log`

## Used By

- `/trace-bug` prompt
