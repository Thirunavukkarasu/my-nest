import React from "react";
import FlatTable from "./flat-table";
import { sql } from "@vercel/postgres";

export default async function FlatsPage() {
  const { rows: records } =
    await sql`select *from flats left join residents on flats.flat_id = residents.flat_id`;
  console.log(records);

  return (
    <>
      <FlatTable records={records} />
    </>
  );
}
