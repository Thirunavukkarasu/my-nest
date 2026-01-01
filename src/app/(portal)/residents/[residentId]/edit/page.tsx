import { notFound } from 'next/navigation'
import { eq } from "drizzle-orm"

import { db } from "@/db"
import ResidentForm from '../../ResidentForm'
import { flatsTable, residentsTable } from "@/db/schema"

async function getFlats() {
    return await db.select().from(flatsTable)
}

async function getResidentData(residentId: string) {
    const residentData = await db.query.residentsTable.findFirst({
        where: eq(residentsTable.residentId, parseInt(residentId)),
    })
    return residentData
}

export default async function EditResidentPage({ params }: { params: { residentId: string } }) {
    const residentData = await getResidentData(params.residentId)
    const flats = await getFlats()

    if (!residentData) {
        notFound()
    }

    return (
        <div className="container mx-auto p-10">
            <h1 className="text-2xl font-bold mb-5">Edit Resident</h1>
            <ResidentForm isEditMode={true} initialData={residentData} flats={flats} />
        </div>
    )
}

