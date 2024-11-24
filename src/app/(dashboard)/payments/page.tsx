import React from "react";
import Table from "./payment-table";
import { sql } from "@vercel/postgres";

export default async function PaymentPage() {
  const { rows: data } = await sql`select *from payments`;
  console.log(data);

  return (
    <>
      <Table data={data} />
    </>
  );
}
