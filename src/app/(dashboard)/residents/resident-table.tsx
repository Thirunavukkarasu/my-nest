'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import GridTable from '@/components/grid-table';

export const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "first_name",
    header: "First Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("first_name")}</div>
    ),
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
    cell: ({ row }) => (
      <div>{row.getValue("last_name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="truncate w-40" title={row.getValue("email")}>
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "lease_start_date",
    header: "Lease Start Date",
    cell: ({ row }) => (
      <div>{new Date(row.getValue("lease_start_date")).toLocaleDateString()}</div>
    ),
  },
  {
    accessorKey: "lease_end_date",
    header: "Lease End Date",
    cell: ({ row }) => {
      const endDate:any = row.getValue("lease_end_date");
      return endDate
        ? <div>{new Date(endDate).toLocaleDateString()}</div>
        : <div>-</div>;
    },
  },
  {
    accessorKey: "is_primary_tenant",
    header: "Primary Tenant",
    cell: ({ row }) => (
      <div>{row.getValue("is_primary_tenant") ? "Yes" : "No"}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const resident = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>View resident</DropdownMenuItem>
            <DropdownMenuItem>Edit resident</DropdownMenuItem>
            <DropdownMenuItem>Delete resident</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function ResidentsTable({ data }: { data: any[] }) {
  return <GridTable data={data} columns={columns} />;
}
