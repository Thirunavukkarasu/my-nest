import { db } from '@/db';
import NewPaymentForm from './NewPaymentForm'

export default async function NewPaymentPage() {
    const flats = await db.query.flatsTable.findMany();
    const residents = await db.query.residentsTable.findMany();

    return (
        <div className="container mx-auto p-10">
            <h1 className="text-2xl font-bold mb-5">Add New Payment</h1>
            <NewPaymentForm flats={flats} residents={residents} />
        </div>
    )
}

