---
name: optimize-query
description: Paste a slow SQL or ORM query and get optimization suggestions with index recommendations and rewrite options
argument-hint: Paste the SQL query or ORM code
agent: agent
model: Claude Sonnet 4.6 (copilot)
tools: [search/codebase, edit]
---

Optimize this query: `${input:query:Paste the SQL or ORM query}`

## Step 1 — Analyze Query

Identify: tables involved, join types, WHERE conditions, ORDER BY, GROUP BY, subqueries, and aggregations.

## Step 2 — Identify Issues

Check for: full table scans, missing indexes, N+1 patterns, unnecessary columns (SELECT *), cartesian products, correlated subqueries.

## Step 3 — Suggest Optimizations

For each issue found, provide:
1. The problem and its performance impact
2. The optimized query or ORM code
3. Suggested indexes (CREATE INDEX statement)
4. EXPLAIN ANALYZE recommendation for validation

## Step 4 — Apply

If in an ORM context, find the source file and apply the optimized query. If raw SQL, provide the rewritten query and index DDL.
