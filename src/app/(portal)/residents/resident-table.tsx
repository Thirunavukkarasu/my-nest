"use client";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { GridColumnDef } from "@/types";
import { IndiGrid } from "@/components/indi-grid";

export const columns: GridColumnDef<any>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
    dataType: "string",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    dataType: "string",
  },
  {
    accessorKey: "email",
    header: "Email",
    dataType: "string",
    cell: ({ row }) => (
      <div className="truncate w-40" title={row.getValue("email")}>
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    dataType: "string",
  },
  {
    accessorKey: "leaseStartDate",
    header: "Lease Start Date",
    dataType: "date",
    cell: ({ row }) => (
      <div>
        {new Date(row.getValue("leaseStartDate"))?.toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "leaseEndDate",
    header: "Lease End Date",
    dataType: "date",
    cell: ({ row }) => {
      const endDate: any = row.getValue("leaseEndDate");
      return endDate ? (
        <div>{new Date(endDate)?.toLocaleDateString()}</div>
      ) : (
        <div>-</div>
      );
    },
  },
  {
    accessorKey: "isPrimaryTenant",
    header: "Primary Tenant",
    dataType: "boolean",
    cell: ({ row }) => (
      <div>{row.getValue("isPrimaryTenant") ? "Yes" : "No"}</div>
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

export default function ResidentsTable() {
  return <IndiGrid columns={columns} gridUrl="/api/residents" />;
}
