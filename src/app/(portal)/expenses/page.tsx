import ExpenseTable from "./expenses-table";

export default async function Payments() {
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Expenses</h2>
          <p className="text-muted-foreground">
            View and manage all expenses of your society
          </p>
        </div>
      </div>
      <ExpenseTable />
    </div>
  );
}
