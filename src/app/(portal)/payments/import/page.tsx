import { ImportForm } from '@/components/import-form'
import { importPayments } from './actions'

export default function ImportPaymentsPage() {
    return (
        <div className="container mx-auto p-10">
            <h1 className="text-2xl font-bold mb-5">Import Payment Records</h1>
            <ImportForm formAction={importPayments} />
        </div>
    )
}

