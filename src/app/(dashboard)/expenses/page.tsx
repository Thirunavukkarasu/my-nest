import React from "react";
import { sql } from "@vercel/postgres";

import Table from "./expenses-table";

export default async function ResidentsPage() {
  const { rows: data } = await sql`select *from expenses`;
  console.log(data);

  return (
    <>
      <Table data={data} />
    </>
  );
}
