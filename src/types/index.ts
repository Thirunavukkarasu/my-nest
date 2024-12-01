import { ColumnDef } from "@tanstack/react-table"

// Extend the ColumnDef type to include our custom 'show' property
export type GridColumnDef<T> = ColumnDef<T> & {
    dataType?: "string" | "number" | "boolean" | "date" | "display" | "datetime" | "currency";
    show?: boolean
}