import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'

import { ImportForm } from '@/components/import-form'
import { importResidents } from './actions'

export default function ImportResidentsPage() {
    return (
        <div className="container mx-auto p-10">
            <div className="flex items-center space-x-3 mb-5">
                <Link
                    href="/residents"
                    className="flex items-center px-3 py-2"
                >
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                </Link>
                <h1 className="text-2xl font-bold">Import Resident Records</h1>
            </div>
            <ImportForm formAction={importResidents} entityName="residents" />
        </div>
    )
}
