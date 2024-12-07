"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { IndiGrid } from "@/components/indi-grid";
import { dateTimeFormatter } from "@/components/indi-grid/grid-formatters";
import Link from "next/link";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "paymentDate",
    header: "Payment Date",
    size: 200,
    cell: dateTimeFormatter,
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
    cell: ({ row }) => {
      const dueDate: any = row.getValue("due_date");
      return dueDate ? (
        <div>{new Date(dueDate).toLocaleDateString()}</div>
      ) : (
        <div>-</div>
      );
    },
  },
  {
    accessorKey: "resident",
    header: "Resident",
    cell: ({ row }) => {
      const resident: any = row.getValue("resident") || {};
      return (
        <Link className="underline" href={`/residents/${resident.residentId}`}>{resident?.residentId}</Link>
      )
    },
  },
  {
    accessorKey: "flat",
    header: "Flat",
    cell: ({ row }) => {
      const flat: any = row.getValue("flat") || {};
      return (
        <Link className="underline" href={`/flats/${flat.flatId}`}>{flat?.flatId}</Link>
      )
    },
  },
  {
    accessorKey: "payment_type",
    header: "Payment Type",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("payment_type")}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => (
      <div className={`capitalize ${row.getValue("status")?.toLowerCase()}`}>
        {row.getValue("status")}
      </div>
    ),
  },
  {
    accessorKey: "payment_method",
    header: "Payment Method",
  },
  {
    accessorKey: "reference_number",
    header: "Reference Number",
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => (
      <div className="truncate w-40" title={row.getValue("notes")}>
        {row.getValue("notes")}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

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
            <DropdownMenuItem>View payment</DropdownMenuItem>
            <DropdownMenuItem>Edit payment</DropdownMenuItem>
            <DropdownMenuItem>Delete payment</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function PaymentsTable() {
  return <IndiGrid columns={columns} gridUrl="/api/payments" />;
}
