import { ImportForm } from '@/components/import-form'
import { importPayments } from './actions'
import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'

export default function ImportPaymentsPage() {
    return (
        <div className="container mx-auto p-10">
            <div className="flex items-center space-x-3 mb-5">
                <Link
                    href="/payments"
                    className="flex items-center px-3 py-2"
                >
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                </Link>
                <h1 className="text-2xl font-bold">Import Payment Records</h1>
            </div>
            <ImportForm formAction={importPayments} entityName="payments" />
        </div>
    )
}

