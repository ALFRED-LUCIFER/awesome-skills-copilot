# product-flow-screenshots

> Generate or update Cypress `productFlowScreenshots.spec.cy.ts` — a documentation screenshot walkthrough of every app screen.

## Purpose

Creates or updates a single Cypress spec file that captures screenshots of every application screen for product documentation, sprint reviews, and user manuals. Uses a standardized 1920×1080 viewport.

## When to Use

- `/product-flow-screenshots` prompt
- Creating product screenshots for documentation
- Sprint review visual captures
- Updating screenshot flow with new screens

## Key Rules

- **Single file rule** — All screenshots in one spec file
- **2-phase workflow** — Check existing → Generate/Update
- **Standard viewport** — 1920×1080

## Helper Functions

| Helper | Purpose |
|--------|---------|
| `forceMonitorViewport` | Set consistent viewport size |
| `waitForLoading` | Wait for page to fully load |
| `shotPage` | Capture full page screenshot |
| `shotDialog` | Capture dialog screenshot |

## Used By

- `/product-flow-screenshots` prompt
- `@e2e-tests` agent
