import { ImportForm } from '@/components/import-form'
import { importFlats } from './actions'

export default function ImportFlatsPage() {
    return (
        <div className="container mx-auto p-10">
            <h1 className="text-2xl font-bold mb-5">Import Flat Records</h1>
            <ImportForm formAction={importFlats} />
        </div>
    )
}

