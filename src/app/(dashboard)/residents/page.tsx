import React from "react";
import { sql } from "@vercel/postgres";

import Table from "./resident-table";

export default async function ResidentsPage() {
  const { rows: data } = await sql`select *from residents`;
  console.log(data);

  return (
    <>
      <Table data={data} />
    </>
  );
}
