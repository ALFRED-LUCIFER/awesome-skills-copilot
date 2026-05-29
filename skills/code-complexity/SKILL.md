---
name: code-complexity
description: 'Cyclomatic complexity analysis, cognitive complexity scoring, hotspot detection, and refactoring candidate identification for any language'
---

# Code Complexity Skill

Analyze and reduce code complexity to improve maintainability.

## When to Use

- Identifying the most complex files/functions in a codebase
- Prioritizing refactoring candidates by complexity × churn
- Setting complexity thresholds for CI quality gates
- Reviewing code for cognitive complexity issues

## Rules

1. Cyclomatic complexity > 10 per function = refactor candidate
2. Cognitive complexity > 15 per function = mandatory refactor
3. File length > 300 lines = split candidate
4. Function length > 50 lines = extract sub-functions
5. Nesting depth > 3 = flatten with early returns or guard clauses
6. Hotspot = high complexity + high churn (frequently changed) — prioritize these
7. Measure BEFORE and AFTER refactoring — prove improvement

## Steps

1. Run complexity analysis per ecosystem:
   - JS/TS: `npx complexity-report` or ESLint `complexity` rule
   - C#: `dotnet tool run jb inspectcode` or VS analyzers
   - Python: `radon cc -s -a .`
   - Go: `gocyclo .`
2. Identify top 10 most complex functions/methods
3. Cross-reference with git churn: `git log --format=format: --name-only | sort | uniq -c | sort -rn`
4. Calculate hotspot score: complexity × change_frequency
5. For each hotspot, identify applicable refactoring (extract method, simplify conditionals, strategy pattern)
6. Set CI threshold: fail build if new code exceeds complexity limit
7. Generate complexity report with trend over time
8. Track complexity reduction sprint-over-sprint

## Reference

See `./examples.md` for complexity analysis output examples and refactoring patterns.
