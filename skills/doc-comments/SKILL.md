---
name: doc-comments
description: Add XML doc comments (C#) or JSDoc (TypeScript/TSX) to public/exported members following Copilot Agent System GUARDRAILS Output Contract § O5
---

# Doc Comments Skill

Add documentation comments to public/exported members. Supports C# XML docs and TypeScript JSDoc.

## For .cs files — XML doc comments

For every **public** class, interface, method, property, and constructor without a `///` comment:

```xml
/// <summary>
/// [One sentence: what this does, not how it does it.]
/// </summary>
/// <param name="paramName">[What this parameter represents.]</param>
/// <returns>[What is returned, including the inner type of Task<T> or BaseResponse<T>.]</returns>
/// <exception cref="ArgumentNullException">[When thrown — only if explicitly thrown in the method.]</exception>
```

### Rules
- `<summary>` is mandatory on every public member
- `<param>` required for every parameter
- `<returns>` required on non-void methods
- `<exception>` only when the method explicitly throws — never invent exceptions
- Do NOT add comments to private/internal members unless they have complex logic
- Do NOT change any logic, signatures, or access modifiers
- Do NOT add `// TODO` or placeholder text

## For .ts / .tsx files — JSDoc comments

For every **exported** function, class, interface, type, hook, and React component without a `/** */` comment:

```typescript
/**
 * [One sentence: what this does.]
 *
 * @param paramName - [What this parameter represents.]
 * @returns [What is returned.]
 * @example
 * // Only include if the usage is non-obvious
 * const result = myFunction(value);
 */
```

### Rules
- `@param` required for every parameter except React `props` (use `Props` interface instead)
- `@returns` required on non-void functions
- `@example` only when usage is genuinely non-obvious
- For React components: document what the component renders and key props
- For `useXxxController` hooks: document the returned `{ state, handler }` shape
- Do NOT add comments to internal helper variables or non-exported functions
- Do NOT change any logic, types, or signatures

## Verification

After editing:
1. Confirm every public/exported member now has a doc comment
2. Confirm no logic was changed — only comments added
3. List the members that were documented
