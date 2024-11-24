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
    accessorKey: "flat_number",
    header: "Flat No",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("flat_number")}</div>
    ),
  },
  {
    accessorKey: "first_name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("first_name") ?? ""}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }:any) => (
      <div className={`capitalize ${row.getValue("status").toLowerCase()}`}>
        {row.getValue("status")}
      </div>
    ),
  },
  {
    accessorKey: "monthly_rent",
    header: "Monthly Rent (INR)",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("monthly_rent"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount);
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "monthly_maintenance_charge",
    header: "Maintenance Charge (INR)",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("monthly_maintenance_charge"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount);
      return <div>{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const flat = row.original;

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
            <DropdownMenuItem>View flat details</DropdownMenuItem>
            <DropdownMenuItem>Edit flat</DropdownMenuItem>
            <DropdownMenuItem>Delete flat</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function FlatsTable({ data }: { data: any[] }) {
  return <GridTable data={data} columns={columns} />;
}
