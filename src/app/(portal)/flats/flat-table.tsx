"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { IndiGrid } from "@/components/indi-grid";
import { GridColumnDef } from "@/types";

export const columns: GridColumnDef<any>[] = [
  {
    accessorKey: "flatNumber",
    header: "Flat No",
    dataType: "string",
  },
  {
    accessorKey: "floorNumber",
    header: "Floor No",
    dataType: "number",
  },
  // {
  //   accessorKey: "firstName",
  //   header: "Name",
  //   dataType: "string",
  // },
  // {
  //   accessorKey: "email",
  //   header: "Email",
  //   dataType: "string",
  // },
  // {
  //   accessorKey: "phone",
  //   header: "Phone",
  //   dataType: "string",
  // },
  {
    accessorKey: "status",
    header: "Status",
    dataType: "string",
    cell: ({ row }: any) => (
      <div className={`capitalize ${row.getValue("status")?.toLowerCase()}`}>
        {row.getValue("status")}
      </div>
    ),
  },
  {
    accessorKey: "monthlyRent",
    header: "Monthly Rent (INR)",
    dataType: "number",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("monthlyRent"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount);
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "monthlyMaintenanceCharge",
    header: "Maintenance Charge (INR)",
    dataType: "number",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("monthlyMaintenanceCharge"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount);
      return <div>{formatted}</div>;
    },
  },
  {
    id: "actions",
    dataType: "display",
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

export default function FlatsTable() {
  return <IndiGrid columns={columns} gridUrl="/api/flats" />;
}
