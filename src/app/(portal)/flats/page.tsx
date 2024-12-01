import FlatsTable from "./flat-table";

export default async function Flats() {
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Flats</h2>
          <p className="text-muted-foreground">
            View and manage all the flats in your society
          </p>
        </div>
      </div>
      <FlatsTable />
    </div>
  );
}
