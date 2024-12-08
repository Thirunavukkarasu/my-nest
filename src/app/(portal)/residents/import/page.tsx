import { ImportForm } from '@/components/import-form'
import { importResidents } from './actions'

export default function ImportResidentsPage() {
    return (
        <div className="container mx-auto p-10">
            <h1 className="text-2xl font-bold mb-5">Import Resident Records</h1>
            <ImportForm formAction={importResidents} />
        </div>
    )
}

