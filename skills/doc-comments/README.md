# doc-comments

> Add XML doc comments (C#) or JSDoc (TypeScript/TSX) to public/exported members following GUARDRAILS Output Contract § O5.

## Purpose

Automatically generates documentation comments for all public classes, methods, and exported functions. No logic changes — only doc comments are added.

## When to Use

- `/add-doc-comments` slash command
- Post-implementation documentation pass
- Code review findings requiring documentation

## Comment Formats

### C# (XML Doc)
```csharp
/// <summary>...</summary>
/// <param name="id">...</param>
/// <returns>...</returns>
/// <exception cref="NotFoundException">...</exception>
```

### TypeScript (JSDoc)
```typescript
/**
 * Description
 * @param id - Parameter description
 * @returns Return value description
 * @example Usage example
 */
```

## Rules

- Only add to public/exported members
- No logic changes allowed
- Must describe purpose, not restate the name

## Used By

- `/add-doc-comments` prompt
