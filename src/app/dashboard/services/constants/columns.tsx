'use client';

import { Checkbox } from '../../../../components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { Service } from '../../../../types/service';
import { CellAction } from '../components/cell-action';

export const columns: ColumnDef<Service>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        className="ml-3"
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="ml-3"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Назва',
  },

  {
    accessorKey: 'description',
    header: 'Опис',
    cell: ({ row }) => row.original.description || '—',
  },
  {
    accessorKey: 'price',
    header: 'Ціна',
    cell: ({ row }) => row.original.price.toString() + ' грн',
  },
  {
    accessorKey: 'duration',
    header: 'Тривалість',
    cell: ({ row }) => row.original.duration.toString() + ' хв',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction service={row.original} />,
  },
];
