import { db } from '@/db'
import ResidentForm from '../ResidentForm'
import { flatsTable } from '@/db/schema'

async function getFlats() {
    return await db.select().from(flatsTable)
}

export default async function NewResidentPage() {
    const flats = await getFlats()

    return (
        <div className="container mx-auto p-10">
            <h1 className="text-2xl font-bold mb-5">Add New Resident</h1>
            <ResidentForm isEditMode={false} flats={flats} />
        </div>
    )
}

