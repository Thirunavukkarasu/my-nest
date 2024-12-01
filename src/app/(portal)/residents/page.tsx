import ResidentTable from "./resident-table";

export default async function Residents() {
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Residents</h2>
          <p className="text-muted-foreground">
            View and manage all residents in your society
          </p>
        </div>
      </div>
      <ResidentTable />
    </div>
  );
}
