import { format } from "date-fns";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const dateFormatter = ({ cell, row }: any) => {
  const columnId = cell?.column?.id;
  const date = row.getValue(columnId);
  return <div>{date ? format(new Date(date), "dd-MMM-yyyy") : "-"}</div>;
};

export const dateTimeFormatter = ({ cell, row }: any) => {
  const columnId = cell?.column?.id;
  const date = row.getValue(columnId);
  return (
    <div>{date ? format(new Date(date), "dd-MMM-yyyy hh:mm a") : "-"}</div>
  );
};

export const currencyFormatter = ({ cell, row }: any) => {
  const columnId = cell?.column?.id;
  const amount = parseFloat(row.getValue(columnId));
  return (
    <div className="font-medium">
      {new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount)}
    </div>
  );
};

export const discountFormatter = ({ cell, row }: any) => {
  const columnId = cell?.column?.id;
  const discount = row.getValue(columnId) ? Number(row.getValue(columnId)) : 0;
  return discount !== null ? (
    <div>{`${discount.toFixed(2)}`}</div>
  ) : (
    <div>-</div>
  );
};

export const capitalizeFormatter = ({ cell, row }: any) => {
  const columnId = cell?.column?.id;
  return <div className="capitalize">{row.getValue(columnId)}</div>;
};

export const actionsFormatter = ({ row }: any) => {
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
        <DropdownMenuItem>Copy Transaction ID</DropdownMenuItem>
        <DropdownMenuItem>View Prospect</DropdownMenuItem>
        <DropdownMenuItem>View Payment Details</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
