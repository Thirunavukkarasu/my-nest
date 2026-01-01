import { notFound } from 'next/navigation'
import { eq } from "drizzle-orm"

import { db } from "@/db"
import FlatForm from '../../FlatForm'
import { flatsTable } from "@/db/schema"

async function getFlatData(flatId: string) {
    const data = await db.query.flatsTable.findFirst({
        where: eq(flatsTable.flatId, parseInt(flatId)),
    })
    return data
}

export default async function EditFlatPage({ params }: { params: { flatId: string } }) {
    const flatData = await getFlatData(params.flatId)

    if (!flatData) {
        notFound()
    }

    return (
        <div className="container mx-auto p-10">
            <h1 className="text-2xl font-bold mb-5">Edit Flat</h1>
            <FlatForm isEditMode={true} initialData={flatData} />
        </div>
    )
}

