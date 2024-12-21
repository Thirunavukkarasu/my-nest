import Link from "next/link";
import { Button } from "@/components/ui/button";
import TransactionTable from "./transaction-table";

export default async function TransactionHistory() {
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Transaction History</h2>
          <p className="text-muted-foreground">
            View all the transactions that have been made by residents.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="btn btn-primary" asChild>
            <Link href="/transaction-history/new">Add Transaction</Link>
          </Button>
          <Button className="btn btn-secondary" asChild>
            <Link href="/transaction-history/import">
              Import
            </Link>
          </Button>
        </div>
      </div>
      <TransactionTable />
    </div>
  );
}
