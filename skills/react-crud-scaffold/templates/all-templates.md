---
name: react-crud-scaffold
description: >
  Complete CRUD code templates for your project React 19 + MUI 7 features.
  Contains types, query hooks, mutation hooks, controller hooks, dialog controller,
  page component, dialog component, and standalone table component templates.
  Replace {Feature}/{feature} with your entity name (e.g. Machine/machine).
---

# Frontend CRUD Templates

> Replace `{Feature}` / `{feature}` with your entity name (PascalCase / camelCase).
> All imports reference platform packages — see `platform-mui.instructions.md` and `platform-common.instructions.md` for full API docs.

---

## types/{feature}.types.ts

```typescript
export interface {Feature} {
  {feature}Id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  modifiedAt: string;
}

export interface {Feature}FormData {
  name: string;
  description?: string;
  isActive: boolean;
}

export const {feature}DefaultValues: {Feature}FormData = {
  name: '',
  description: '',
  isActive: true,
};
```

---

## hooks/use{Feature}Query.ts

```typescript
import { useQuery } from '@tanstack/react-query';
import {
  get{Feature}sOptions,
  get{Feature}ByIdOptions,
} from '@/api/gen/{feature}/client.gen';

/** List query — pass page/pageSize/sort/filter from usePlatformMrt */
export const use{Feature}sQuery = (params: {
  pageIndex: number;
  pageSize: number;
  sort?: string;
  filter?: string;
}) =>
  useQuery({
    ...get{Feature}sOptions({
      query: {
        pageIndex: params.pageIndex,
        pageSize: params.pageSize,
        sort: params.sort,
        filter: params.filter,
      },
    }),
  });

/** Single-item query for edit dialog / detail page */
export const use{Feature}Query = (id: number | undefined) =>
  useQuery({
    ...get{Feature}ByIdOptions({ path: { id: id! } }),
    enabled: id !== undefined,
  });
```

---

## hooks/use{Feature}Mutation.ts

```typescript
import { useMutation, useNotifications } from '@your-org/platform-lib';
import { useQueryClient } from '@tanstack/react-query';
import { UseFormReturn } from 'react-hook-form';
import {
  create{Feature}MutationOptions,
  update{Feature}MutationOptions,
  delete{Feature}MutationOptions,
  get{Feature}sQueryKey,
} from '@/api/gen/{feature}/client.gen';
import type { {Feature}FormData } from '../types/{feature}.types';

export const useCreate{Feature}Mutation = (form: UseFormReturn<{Feature}FormData>) => {
  const queryClient = useQueryClient();
  const notification = useNotifications();

  return useMutation({
    ...create{Feature}MutationOptions(),
    formControl: form,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: get{Feature}sQueryKey() });
      notification.show(t('{feature}.created'), { severity: 'success', autoHideDuration: 5000 });
    },
  });
};

export const useUpdate{Feature}Mutation = (form: UseFormReturn<{Feature}FormData>) => {
  const queryClient = useQueryClient();
  const notification = useNotifications();

  return useMutation({
    ...update{Feature}MutationOptions(),
    formControl: form,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: get{Feature}sQueryKey() });
      notification.show(t('{feature}.updated'), { severity: 'success', autoHideDuration: 5000 });
    },
  });
};

export const useDelete{Feature}Mutation = () => {
  const queryClient = useQueryClient();
  const notification = useNotifications();

  return useMutation({
    ...delete{Feature}MutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: get{Feature}sQueryKey() });
      notification.show(t('{feature}.deleted'), { severity: 'success', autoHideDuration: 5000 });
    },
  });
};
```

---

## hooks/use{Feature}Controller.ts

```typescript
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlatformMrt, useMrtDataValueFormatter, MRT_ColumnDef } from '@your-org/platform-lib';
import { useTranslation } from '@/i18n';
import { use{Feature}sQuery } from './use{Feature}Query';
import { useDelete{Feature}Mutation } from './use{Feature}Mutation';
import type { {Feature} } from '../types/{feature}.types';

export const use{Feature}Controller = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected{Feature}, setSelected{Feature}] = useState<{Feature} | undefined>();

  const { mrtNumberValueFormatter, mrtStringValueFormatter, mrtDateValueFormatter } =
    useMrtDataValueFormatter();

  const columns: MRT_ColumnDef<{Feature}>[] = useMemo(
    () => [
      {
        accessorKey: '{feature}Id',
        accessorFn: (row) => mrtNumberValueFormatter(row.{feature}Id),
        header: t('{feature}.id'),
        meta: { type: 'number' },
        filterVariant: 'text',
      },
      {
        accessorKey: 'name',
        accessorFn: (row) => mrtStringValueFormatter(row.name),
        header: t('{feature}.name'),
        meta: { type: 'string' },
        filterVariant: 'text',
      },
      {
        accessorKey: 'isActive',
        accessorFn: (row) => mrtStringValueFormatter(row.isActive ? t('common.yes') : t('common.no')),
        header: t('{feature}.isActive'),
        meta: { type: 'multi-selection' },
        filterVariant: 'multi-select',
        filterSelectOptions: [
          { label: t('common.yes'), value: 'true' },
          { label: t('common.no'), value: 'false' },
        ],
      },
    ],
    [t, mrtNumberValueFormatter, mrtStringValueFormatter],
  );

  const { table, pageIndex, pageSize, sort, filter } = usePlatformMrt<{Feature}>({
    tableProps: { columns, data: [], rowCount: 0 },
    isPending: false,
  });

  const { data, isPending } = use{Feature}sQuery({ pageIndex, pageSize, sort, filter });
  const deleteMutation = useDelete{Feature}Mutation();

  // Keep table data in sync
  useMemo(() => {
    table.setOptions((prev) => ({
      ...prev,
      data: data?.entities ?? [],
      rowCount: data?.totalCount ?? 0,
    }));
  }, [data, table]);

  return {
    state: {
      table,
      isPending,
      columns,
      dialogOpen,
      selected{Feature},
    },
    handler: {
      openAddDialog: () => {
        setSelected{Feature}(undefined);
        setDialogOpen(true);
      },
      openEditDialog: (item: {Feature}) => {
        setSelected{Feature}(item);
        setDialogOpen(true);
      },
      closeDialog: () => setDialogOpen(false),
      handleDelete: (id: number) => deleteMutation.mutate({ path: { id } }),
    },
  };
};
```

---

## hooks/use{Feature}DialogController.ts

```typescript
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCreate{Feature}Mutation, useUpdate{Feature}Mutation } from './use{Feature}Mutation';
import type { {Feature}, {Feature}FormData } from '../types/{feature}.types';
import { {feature}DefaultValues } from '../types/{feature}.types';

export const use{Feature}DialogController = (
  existing{Feature}?: {Feature},
  onClose?: () => void,
) => {
  const isEditMode = existing{Feature} !== undefined;

  const form = useForm<{Feature}FormData>({
    defaultValues: {feature}DefaultValues,
  });

  // Populate form when editing
  useEffect(() => {
    if (existing{Feature}) {
      form.reset({
        name: existing{Feature}.name,
        description: existing{Feature}.description ?? '',
        isActive: existing{Feature}.isActive,
      });
    } else {
      form.reset({feature}DefaultValues);
    }
  }, [existing{Feature}, form]);

  const createMutation = useCreate{Feature}Mutation(form);
  const updateMutation = useUpdate{Feature}Mutation(form);

  const handleSubmit = form.handleSubmit((data) => {
    if (isEditMode) {
      updateMutation.mutate(
        { path: { id: existing{Feature}!.{feature}Id }, body: data },
        { onSuccess: () => onClose?.() },
      );
    } else {
      createMutation.mutate(
        { body: data },
        { onSuccess: () => onClose?.() },
      );
    }
  });

  return {
    state: {
      form,
      isEditMode,
      isPending: createMutation.isPending || updateMutation.isPending,
    },
    handler: {
      handleSubmit,
      handleCancel: () => {
        form.reset();
        onClose?.();
      },
    },
  };
};
```

---

## src/routing/{Feature}Page.tsx

```tsx
import { FC } from 'react';
import { PageContainer, ActionBar, Button } from '@your-org/platform-lib';
import { PlatformMrt } from '@your-org/platform-lib';
import { useTranslation } from '@/i18n';
import { use{Feature}Controller } from '../domain/{feature}/hooks/use{Feature}Controller';
import { {Feature}Dialog } from '../domain/{feature}/components/{Feature}Dialog';

export const {Feature}Page: FC = () => {
  const { t } = useTranslation();
  const { state, handler } = use{Feature}Controller();

  return (
    <PageContainer
      showBreadcrumbs
      padding={3}
      slots={{
        footer: (
          <ActionBar
            align="right"
            rightElements={[
              <Button
                key="add"
                mode="primary"
                onClick={handler.openAddDialog}
                data-testid="{feature}-add-button"
              >
                {t('common.add')}
              </Button>,
            ]}
          />
        ),
      }}
    >
      <PlatformMrt table={state.table} data-testid="{feature}-table" />

      <{Feature}Dialog
        open={state.dialogOpen}
        {feature}={state.selected{Feature}}
        onClose={handler.closeDialog}
      />
    </PageContainer>
  );
};
```

---

## components/{Feature}Dialog.tsx

```tsx
import { FC } from 'react';
import { Grid2 as Grid } from '@mui/material';
import { PlatformDialog, TextFieldElement } from '@your-org/platform-lib';
import { useTranslation } from '@/i18n';
import { use{Feature}DialogController } from '../hooks/use{Feature}DialogController';
import type { {Feature} } from '../types/{feature}.types';

interface Props {
  open: boolean;
  {feature}?: {Feature};
  onClose: () => void;
}

export const {Feature}Dialog: FC<Props> = ({ open, {feature}, onClose }) => {
  const { t } = useTranslation();
  const { state, handler } = use{Feature}DialogController({feature}, onClose);

  return (
    <PlatformDialog
      open={open}
      onClose={handler.handleCancel}
      title={state.isEditMode ? t('{feature}.edit') : t('{feature}.add')}
      actions={{
        primary: {
          name: t('common.save'),
          onAction: handler.handleSubmit,
          disabled: state.isPending,
        },
        secondary: {
          name: t('common.cancel'),
          onAction: handler.handleCancel,
        },
      }}
      data-testid="{feature}-dialog"
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextFieldElement
            name="name"
            label={t('{feature}.name')}
            control={state.form.control}
            required
            fullWidth
            data-testid="{feature}-name-input"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextFieldElement
            name="description"
            label={t('{feature}.description')}
            control={state.form.control}
            fullWidth
            multiline
            rows={3}
            data-testid="{feature}-description-input"
          />
        </Grid>
      </Grid>
    </PlatformDialog>
  );
};
```

---

## components/{Feature}Table.tsx (standalone with row actions)

> Use this instead of inline `PlatformMrt` when the table needs custom row actions or complex column rendering.

```tsx
import { FC, useMemo } from 'react';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { PlatformMrt, MRT_ColumnDef, useMrtDataValueFormatter } from '@your-org/platform-lib';
import { useTranslation } from '@/i18n';
import { useDialogs } from '@your-org/platform-lib';
import type { {Feature} } from '../types/{feature}.types';
import type { MRT_TableInstance } from 'material-react-table';

interface Props {
  table: MRT_TableInstance<{Feature}>;
  onEdit: (item: {Feature}) => void;
  onDelete: (id: number) => void;
}

export const {Feature}Table: FC<Props> = ({ table, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const dialogs = useDialogs();

  const handleDelete = async (item: {Feature}) => {
    const confirmed = await dialogs.confirm(
      t('{feature}.confirmDelete', { name: item.name }),
      { title: t('common.confirm'), okText: t('common.delete'), cancelText: t('common.cancel') },
    );
    if (confirmed) onDelete(item.{feature}Id);
  };

  return (
    <PlatformMrt
      table={table}
      enableRowActions
      renderRowActions={({ row }) => (
        <>
          <IconButton onClick={() => onEdit(row.original)} data-testid={`edit-{feature}-${row.original.{feature}Id}`}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(row.original)} data-testid={`delete-{feature}-${row.original.{feature}Id}`}>
            <DeleteIcon />
          </IconButton>
        </>
      )}
      data-testid="{feature}-table"
    />
  );
};
```
