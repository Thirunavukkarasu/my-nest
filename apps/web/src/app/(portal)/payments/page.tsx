import { Button } from "@/components/ui/button";
import PaymentTable from "./payment-table";
import Link from "next/link";

export default async function Payments() {
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Payments</h2>
          <p className="text-muted-foreground">
            View and manage all payments made by residents
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="btn btn-primary" asChild>
            <Link href="/payments/new">Add Payment</Link>
          </Button>
          <Button className="btn btn-secondary" asChild>
            <Link href="/payments/import">
              Import
            </Link>
          </Button>
        </div>
      </div>
      <PaymentTable />
    </div>
  );
}
