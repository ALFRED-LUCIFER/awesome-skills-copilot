---
name: react-vitest
description: >
  Vitest + React Testing Library test templates for your project frontend features.
  Contains: controller hook tests, dialog controller tests, query tests (single + list),
  mutation tests (with captured onSuccess), utility function tests, page component tests,
  dialog component tests, table component tests, and mock data factory pattern.
---

# Frontend Test Templates

> Replace `feature` / `Feature` with your entity name. Use `vi.mock()` for all mocks — never wrap hook tests in `QueryClientProvider`.

---

## 🎯 Core Principles

> **The purpose of a unit test is to prevent unintended side effects when updating or bug-fixing existing code.**

| Principle | Rule |
|-----------|------|
| **Regression guards, not line counters** | Every test must fail if the tested functionality breaks. Never write a test solely to satisfy a coverage metric. |
| **Never update assertions to pass** | Only change an existing assertion when a **requirement change** explicitly demands it. Updating an assertion to make a failing test green is masking a bug. |
| **Controller hooks first** | Always write `useXxxController` and `useXxxDialogController` hook tests **before** UI component tests. Core logic correctness reduces complexity and improves meaningful coverage. |

### 📁 File Placement & Naming

- Place the test file in the **same directory** as the file under test.
- Name convention: `<filename>.test.ts` (plain TS) or `<filename>.test.tsx` (JSX).

```
src/features/storage/
  useStorageController.ts            ← source
  useStorageController.test.ts       ← test (same folder, same name)
  StoragePage.tsx
  StoragePage.test.tsx
```

### 🔢 Testing Priority Order

1. Controller hook (`useXxxController.test.ts`)
2. Dialog controller hook (`useXxxDialogController.test.ts`)
3. Query hooks (`useXxxQuery.test.ts`, `useXxxsQuery.test.ts`)
4. Mutation hooks (create / update / delete)
5. Utility functions
6. Page component (`XxxPage.test.tsx`)
7. Dialog component (`XxxDialog.test.tsx`)
8. Table component (`XxxTable.test.tsx`)

---

## ⛔ FORBIDDEN PATTERNS

> These patterns contradict the ISO/IEC 29119 checklist enforced by `frontend-tests.agent.md`. Any test containing them will fail mandatory self-verification.

| Pattern | Why It Fails | Correct Alternative |
|---------|-------------|---------------------|
| `expect(x).toBeDefined()` alone | Existence check — passes for `null`, `0`, and `''` | Assert the specific value: `expect(x).toBe(false)` |
| `expect(x).toBeTruthy()` alone | Too broad — `1`, `'a'`, and `{}` all pass | Use `.toBe(true)` or assert the exact value |
| `expect(typeof fn).toBe('function')` | Existence check — no behavior verified | Call the fn and assert its side-effect |
| `expect(state).toEqual({ ...fullShape })` | Shape test — breaks on every refactor | One assertion per behavior: `expect(state.isOpen).toBe(false)` |
| `expect(navigate).toBe(mockNavigate)` | Identity check — proves nothing about what was called | `expect(mockNavigate).toHaveBeenCalledWith('/path/1')` |
| `it('renders correctly', ...)` | Untraceable name — no behavior stated | `it('should close dialog when cancel clicked', ...)` |
| `it('should be defined', ...)` | Same as `toBeDefined()` in prose | Name the expected behavior |
| Wrapping hooks in `QueryClientProvider` | Violates direct-mock rule | Use `vi.mock('@tanstack/react-query', ...)` directly |

---

## Controller Hook Test

```typescript
describe('useFeatureController', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { cleanup(); });

  it('should have dialog closed on mount', () => {
    const { result } = renderHook(() => useFeatureController());
    expect(result.current.state.isDialogOpen).toBe(false);
  });

  it('should have no item selected on mount', () => {
    const { result } = renderHook(() => useFeatureController());
    expect(result.current.state.selectedItem).toBeNull();
  });

  it('should handle dialog open/close', () => {
    const { result } = renderHook(() => useFeatureController());
    act(() => { result.current.handler.openDialog(); });
    expect(result.current.state.isDialogOpen).toBe(true);
    act(() => { result.current.handler.closeDialog(); });
    expect(result.current.state.isDialogOpen).toBe(false);
  });

  it('should handle item selection', () => {
    const { result } = renderHook(() => useFeatureController());
    const testItem = { id: 1, name: 'Test Item' };
    act(() => { result.current.handler.selectItem(testItem); });
    expect(result.current.state.selectedItem).toEqual(testItem);
  });

  it('should handle delete with confirmation', async () => {
    const mockConfirm = vi.fn().mockResolvedValue(true);
    vi.mocked(useDialogs).mockReturnValue({ confirm: mockConfirm });
    const { result } = renderHook(() => useFeatureController());
    await act(async () => { await result.current.handler.handleDelete(1); });
    expect(mockConfirm).toHaveBeenCalled();
  });

  it('should not delete when confirmation cancelled', async () => {
    const mockConfirm = vi.fn().mockResolvedValue(false);
    vi.mocked(useDialogs).mockReturnValue({ confirm: mockConfirm });
    const { result } = renderHook(() => useFeatureController());
    await act(async () => { await result.current.handler.handleDelete(1); });
    expect(mockMutate).not.toHaveBeenCalled();
  });
});
```

---

## Dialog Controller Test

```typescript
describe('useFeatureDialogController', () => {
  const mockOnClose = vi.fn();
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { cleanup(); });

  it('should initialize in add mode with default values', () => {
    const { result } = renderHook(() => useFeatureDialogController(undefined, mockOnClose));
    expect(result.current.state.isEditMode).toBe(false);
    expect(result.current.state.form.getValues()).toEqual({
      name: '',
      description: '',
      isActive: true,
    });
  });

  it('should initialize in edit mode with existing data', () => {
    const existing = { featureId: 1, name: 'Test', description: 'Desc', isActive: true, createdAt: '', modifiedAt: '' };
    const { result } = renderHook(() => useFeatureDialogController(existing, mockOnClose));
    expect(result.current.state.isEditMode).toBe(true);
    expect(result.current.state.form.getValues('name')).toBe('Test');
  });

  it('should reset form and call onClose on cancel', () => {
    const { result } = renderHook(() => useFeatureDialogController(undefined, mockOnClose));
    act(() => { result.current.handler.handleCancel(); });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call create mutation with submitted form values in add mode', async () => {
    const { result } = renderHook(() => useFeatureDialogController(undefined, mockOnClose));
    act(() => { result.current.state.form.setValue('name', 'New Item'); });
    await act(async () => { await result.current.handler.handleSubmit(); });
    expect(mockMutate).toHaveBeenCalledWith(expect.objectContaining({ name: 'New Item' }));
  });

  it('should call update mutation with changed values and featureId in edit mode', async () => {
    const existing = { featureId: 1, name: 'Test', description: '', isActive: true, createdAt: '', modifiedAt: '' };
    const { result } = renderHook(() => useFeatureDialogController(existing, mockOnClose));
    act(() => { result.current.state.form.setValue('name', 'Updated'); });
    await act(async () => { await result.current.handler.handleSubmit(); });
    expect(mockMutate).toHaveBeenCalledWith(expect.objectContaining({ featureId: 1, name: 'Updated' }));
  });

  it('should call onClose after successful create', async () => {
    const { result } = renderHook(() => useFeatureDialogController(undefined, mockOnClose));
    act(() => { result.current.state.form.setValue('name', 'New Item'); });
    await act(async () => { await result.current.handler.handleSubmit(); });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should not call mutation when required field is empty [EP: invalid partition]', async () => {
    const { result } = renderHook(() => useFeatureDialogController(undefined, mockOnClose));
    // name left empty — form invalid
    await act(async () => { await result.current.handler.handleSubmit(); });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('should show pending state during submission', () => {
    vi.mocked(useMutation).mockReturnValue({ mutate: vi.fn(), isPending: true });
    const { result } = renderHook(() => useFeatureDialogController(undefined, mockOnClose));
    expect(result.current.state.isPending).toBe(true);
  });
});
```

---

## Query Test (single item, with captured mock)

```typescript
const mockUseQuery = vi.fn();
vi.mock('@tanstack/react-query', () => ({
  useQuery: (...args) => {
    mockUseQuery(...args);
    return { data: mockData, isPending: false, isSuccess: true };
  }
}));

describe('useFeatureQuery', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should call useQuery with correct parameters', () => {
    renderHook(() => useFeatureQuery({ id: 1 }));
    const queryOptions = mockUseQuery.mock.calls[0][0];
    expect(queryOptions.enabled).toBe(true);
  });

  it('should be disabled when params missing', () => {
    renderHook(() => useFeatureQuery({ id: null }));
    const queryOptions = mockUseQuery.mock.calls[0][0];
    expect(queryOptions.enabled).toBe(false);
  });
});
```

---

## List Query Test (pagination / sort / filter)

```typescript
describe('useFeaturesQuery', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should pass pagination params to query options', () => {
    renderHook(() => useFeaturesQuery({ pageIndex: 0, pageSize: 25 }));
    const opts = mockUseQuery.mock.calls[0][0];
    expect(opts.queryKey).toContain('features');
  });

  it('should include sort and filter in query key when provided', () => {
    renderHook(() => useFeaturesQuery({ pageIndex: 0, pageSize: 10, sort: 'name asc', filter: 'name==Test' }));
    const opts = mockUseQuery.mock.calls[0][0];
    expect(JSON.stringify(opts.queryKey)).toContain('name asc');
    expect(JSON.stringify(opts.queryKey)).toContain('name==Test');
  });

  it('should not include sort in query key when sort is omitted', () => {
    renderHook(() => useFeaturesQuery({ pageIndex: 0, pageSize: 10 }));
    const opts = mockUseQuery.mock.calls[0][0];
    expect(JSON.stringify(opts.queryKey)).not.toContain('sort');
  });

  it('should return empty entities array when no data', () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined, isPending: false, isSuccess: true } as any);
    const { result } = renderHook(() => useFeaturesQuery({ pageIndex: 0, pageSize: 10 }));
    expect(result.current.data).toBeUndefined();
  });
});
```

---

## Mutation Test (with captured onSuccess)

```typescript
const mockInvalidateQueries = vi.fn();
const mockShow = vi.fn();
let capturedOnSuccess: Function | undefined;

vi.mock('@your-org/platform-lib', () => ({
  useMutation: ({ onSuccess }) => {
    capturedOnSuccess = onSuccess;
    return { mutate: vi.fn(), mutateAsync: vi.fn(), isPending: false };
  },
  useNotifications: () => ({ show: mockShow })
}));

describe('useCreateFeatureMutation', () => {
  beforeEach(() => { vi.clearAllMocks(); capturedOnSuccess = undefined; });

  it('should not be pending on initial mount', () => {
    const { result } = renderHook(() => useCreateFeatureMutation(mockFormControl));
    expect(result.current.isPending).toBe(false);
  });

  it('should invalidate queries on success', () => {
    renderHook(() => useCreateFeatureMutation(mockFormControl));
    capturedOnSuccess?.({}, {}, {});
    expect(mockInvalidateQueries).toHaveBeenCalled();
  });

  it('should show success notification on success', () => {
    renderHook(() => useCreateFeatureMutation(mockFormControl));
    capturedOnSuccess?.({}, {}, {});
    expect(mockShow).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ severity: 'success' })
    );
  });
});

describe('useDeleteFeatureMutation', () => {
  beforeEach(() => { vi.clearAllMocks(); capturedOnSuccess = undefined; });

  it('should call mutateAsync with the correct feature id', async () => {
    const mockMutateAsync = vi.fn().mockResolvedValue({});
    vi.mocked(useMutation).mockReturnValue({ mutate: vi.fn(), mutateAsync: mockMutateAsync, isPending: false });
    const { result } = renderHook(() => useDeleteFeatureMutation());
    await act(async () => { await result.current.mutateAsync({ featureId: 42 }); });
    expect(mockMutateAsync).toHaveBeenCalledWith({ featureId: 42 });
  });

  it('should invalidate queries after deletion', () => {
    renderHook(() => useDeleteFeatureMutation());
    capturedOnSuccess?.({}, {}, {});
    expect(mockInvalidateQueries).toHaveBeenCalled();
  });

  it('should show success notification after deletion', () => {
    renderHook(() => useDeleteFeatureMutation());
    capturedOnSuccess?.({}, {}, {});
    expect(mockShow).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ severity: 'success' })
    );
  });
});
```

---

## Mutation Error Path Templates

> Required by ISO/IEC 29119 **Error condition coverage** — every async operation must have a rejection/error branch test.

```typescript
const mockShow = vi.fn();
let capturedOnError: ((error: Error) => void) | undefined;

vi.mock('@your-org/platform-lib', () => ({
  useMutation: ({ onSuccess, onError }: { onSuccess?: Function; onError?: (e: Error) => void }) => {
    capturedOnSuccess = onSuccess;
    capturedOnError = onError;
    return { mutate: vi.fn(), mutateAsync: vi.fn(), isPending: false };
  },
  useNotifications: () => ({ show: mockShow }),
}));

describe('useCreateFeatureMutation — error paths', () => {
  beforeEach(() => { vi.clearAllMocks(); capturedOnError = undefined; });

  it('should show error notification when API returns validation error', () => {
    renderHook(() => useCreateFeatureMutation(mockFormControl));
    capturedOnError?.(new Error('Validation failed'));
    expect(mockShow).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ severity: 'error' })
    );
  });

  it('should keep dialog open when API call fails', () => {
    const mockOnClose = vi.fn();
    renderHook(() => useCreateFeatureMutation(mockFormControl, mockOnClose));
    capturedOnError?.(new Error('Server Error'));
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should show error notification on network failure', () => {
    renderHook(() => useCreateFeatureMutation(mockFormControl));
    capturedOnError?.(new Error('Network Error'));
    expect(mockShow).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ severity: 'error' })
    );
  });
});
```

---

## Utility Function Test

```typescript
describe('calculateSquareMeters', () => {
  it('should convert mm² to m² correctly', () => {
    expect(calculateSquareMeters(600, 800)).toBe(0.48);
    expect(calculateSquareMeters(1000, 1500)).toBe(1.5);
  });

  it('should handle zero dimensions', () => {
    expect(calculateSquareMeters(0, 800)).toBe(0);
  });

  it('should handle negative dimensions', () => {
    expect(calculateSquareMeters(-600, 800)).toBe(-0.48);
  });
});
```

---

## Boundary Value Analysis (BVA) Templates

> ISO/IEC 29119 requires at least 3 BVA tests per input boundary. Apply these patterns to every numeric, string-length, or array-size input.

```typescript
// Example: items array boundary (empty → single → many → max page size)
describe('useFeaturesQuery — items array boundary values', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should return empty items array when data is empty [lower boundary = 0]', () => {
    vi.mocked(useQuery).mockReturnValue({ data: { items: [], totalCount: 0 }, isPending: false } as any);
    const { result } = renderHook(() => useFeaturesQuery({ pageIndex: 0, pageSize: 10 }));
    expect(result.current.data?.items).toHaveLength(0);
  });

  it('should render single row for minimum valid item count [min = 1]', () => {
    vi.mocked(useQuery).mockReturnValue({ data: { items: [createFeature()], totalCount: 1 }, isPending: false } as any);
    const { result } = renderHook(() => useFeaturesQuery({ pageIndex: 0, pageSize: 1 }));
    expect(result.current.data?.items).toHaveLength(1);
  });

  it('should handle maximum page size without overflow [max = 100]', () => {
    const items = Array.from({ length: 100 }, () => createFeature());
    vi.mocked(useQuery).mockReturnValue({ data: { items, totalCount: 100 }, isPending: false } as any);
    const { result } = renderHook(() => useFeaturesQuery({ pageIndex: 0, pageSize: 100 }));
    expect(result.current.data?.items).toHaveLength(100);
  });

  it('should pass pageSize of 0 to API unchanged [below minimum]', () => {
    renderHook(() => useFeaturesQuery({ pageIndex: 0, pageSize: 0 }));
    const opts = mockUseQuery.mock.calls[0][0];
    expect(opts.queryKey).toEqual(expect.arrayContaining([expect.objectContaining({ pageSize: 0 })]));
  });

  it('should handle undefined data without crashing [null/undefined boundary]', () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined, isPending: false, isSuccess: true } as any);
    const { result } = renderHook(() => useFeaturesQuery({ pageIndex: 0, pageSize: 10 }));
    expect(result.current.data).toBeUndefined();
  });
});
```

---

## Page Component Test

```typescript
describe('FeaturePage', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { cleanup(); });

  it('should render page container with table', () => {
    render(<FeaturePage />);
    expect(screen.getByTestId('feature-table')).toBeInTheDocument();
  });

  it('should render add button', () => {
    render(<FeaturePage />);
    expect(screen.getByTestId('feature-add-button')).toBeInTheDocument();
  });

  it('should open dialog when add button clicked', () => {
    render(<FeaturePage />);
    fireEvent.click(screen.getByTestId('feature-add-button'));
    expect(screen.getByTestId('feature-dialog')).toBeInTheDocument();
  });

  it('should show loading state while data pending', () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined, isPending: true } as any);
    render(<FeaturePage />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
```

---

## Dialog Component Test

```typescript
describe('FeatureDialog', () => {
  const defaultProps = {
    open: true,
    feature: undefined,
    onClose: vi.fn(),
  };
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { cleanup(); });

  it('should render dialog with add title when no feature', () => {
    render(<FeatureDialog {...defaultProps} />);
    expect(screen.getByTestId('feature-dialog')).toBeInTheDocument();
    expect(screen.getByText('feature.add')).toBeInTheDocument();
  });

  it('should render dialog with edit title when feature provided', () => {
    const feature = { featureId: 1, name: 'Test', isActive: true };
    render(<FeatureDialog {...defaultProps} feature={feature} />);
    expect(screen.getByText('feature.edit')).toBeInTheDocument();
  });

  it('should render all form fields', () => {
    render(<FeatureDialog {...defaultProps} />);
    expect(screen.getByTestId('feature-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('feature-description-input')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(<FeatureDialog {...defaultProps} open={false} />);
    expect(screen.queryByTestId('feature-dialog')).not.toBeInTheDocument();
  });

  it('should call onClose when cancel clicked', () => {
    render(<FeatureDialog {...defaultProps} />);
    fireEvent.click(screen.getByText('common.cancel'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('should disable save button while pending', () => {
    vi.mocked(useMutation).mockReturnValue({ mutate: vi.fn(), isPending: true });
    render(<FeatureDialog {...defaultProps} />);
    expect(screen.getByText('common.save').closest('button')).toBeDisabled();
  });
});
```

---

## Table Component Test

```typescript
describe('FeatureTable', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockData = [
    createFeature({ featureId: 1, name: 'Feature A' }),
    createFeature({ featureId: 2, name: 'Feature B' }),
  ];
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { cleanup(); });

  it('should render table with rows', () => {
    render(<FeatureTable table={mockTable} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByTestId('feature-table')).toBeInTheDocument();
    expect(screen.getByText('Feature A')).toBeInTheDocument();
  });

  it('should call onEdit when edit button clicked', () => {
    render(<FeatureTable table={mockTable} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    fireEvent.click(screen.getByTestId('edit-feature-1'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockData[0]);
  });

  it('should confirm before delete', async () => {
    const mockConfirm = vi.fn().mockResolvedValue(true);
    vi.mocked(useDialogs).mockReturnValue({ confirm: mockConfirm });
    render(<FeatureTable table={mockTable} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    await act(async () => { fireEvent.click(screen.getByTestId('delete-feature-1')); });
    expect(mockConfirm).toHaveBeenCalled();
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  it('should not delete when confirmation cancelled', async () => {
    const mockConfirm = vi.fn().mockResolvedValue(false);
    vi.mocked(useDialogs).mockReturnValue({ confirm: mockConfirm });
    render(<FeatureTable table={mockTable} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    await act(async () => { fireEvent.click(screen.getByTestId('delete-feature-1')); });
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('should render empty state when no data', () => {
    render(<FeatureTable table={emptyTable} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.queryByText('Feature A')).not.toBeInTheDocument();
  });
});
```

---

## Mock Data Factory

```typescript
let idCounter = 0;

export const createFeature = (overrides = {}): Feature => ({
  featureId: ++idCounter,
  name: `Feature ${idCounter}`,
  description: `Description ${idCounter}`,
  isActive: true,
  createdAt: new Date().toISOString(),
  modifiedAt: new Date().toISOString(),
  ...overrides
});

// Usage: createFeature({ name: 'Custom', isActive: false })
```

---

## 🚫 Anti-Patterns — NEVER Generate These

### Mock-on-mock theater (all forms forbidden)

| Pattern | Example | Why forbidden |
|---|---|---|
| **(a) Identity passthrough** | `handler.foo` IS the mock → asserting it was called | Tests mock wiring, not code |
| **(b) Shape tautology** | Assert mock value comes back unchanged from hook | No transformation tested |
| **(c) String-literal lock** | `toHaveBeenCalledWith({ key: 'platformMrtX' })` | Refactor-locked, no behavioral value |
| **(d) useState initializer** | `expect(isOpen).toBe(false)` on first render | Tests React, not your code |
| **(e) Default-state duplicate** | Separate test for `false` when `beforeEach` already sets it | Baseline covers it |
| **(f) One-line passthrough** | `remove(i) => fieldArray.remove(i)` | Only test if wrapper transforms input |

### Also forbidden

- **Wire-up tests**: `it('calls useMutation with options')` — tests import, not behavior
- **`toBeDefined()` alone**: Replace with concrete value assertion
- **Redundant boolean tests**: Only test both branches if they have different side effects
- **Duplicate domain tests**: If 5+ identical query/mutation tests exist, only test unique behavior
- **Excessive mocking**: Budget ONE mock per test; never mock `react-hook-form`, module under test, or pure functions. >3 mocks → should be integration/E2E test
- **Thin forwarding code** (<10 lines, no branching): Output `// NO UNIT TESTS WARRANTED — <reason>`

### What TO test instead

Boolean/branch composition, data shaping (`?? defaults`), control flow branches, callback arguments using inputs, `useEffect` side effects. Target **>85% assertions exercising real code**.

---

## 🧭 Hook Classification — Classify Before Writing Tests

| Hook type | Test decision |
|---|---|
| Pure forwarding / thin `useQuery` wrapper | Skip unless transforms params/result |
| Controller hook | Must test |
| Form controller hook | Must test (use real `useForm`, never mock `react-hook-form`) |
| Mutation hook | Must test success/error/pending |
| Permission / read-only hook | Must test allowed/blocked |

---

## 🧩 Component Classification — Classify Before Writing Tests

| Component type | Test decision |
|---|---|
| Pure layout/styling wrapper | Skip |
| Form / Dialog / Table / Page | Must test |
| Permission / read-only | Must test allowed/blocked/disabled |
| Loading/error/empty states | Must test |

**Query priority** (RTL): `getByRole` > `getByLabelText` > `getByText` > `getByTestId` (last resort).

**Mock only boundaries**: API hooks, auth hooks, translation, `useNavigate`. **Never mock**: MUI, module under test, pure functions, child components in behavior chain.

---

## ✅ Value Justification (every `it()`)

- **Check 1**: "If this fails, what user-visible regression does it catch?" → if nothing, delete
- **Check 2**: "If I delete this assertion, does the test still pass with correct source?" → if yes, delete
