'use client'

import { useState } from 'react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ImportForm({ formAction }: any) {
    const [file, setFile] = useState<File | null>(null)
    const [importing, setImporting] = useState(false)
    const [result, setResult] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!file) return

        setImporting(true)
        setResult(null)

        const formData = new FormData()
        formData.append('file', file)

        try {
            const result = await formAction(formData)
            setResult(`Successfully imported ${result.importedCount} records.`)
        } catch (error) {
            setResult('Error importing data. Please try again.')
            console.error('Import error:', error)
        } finally {
            setImporting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
            <div>
                <Label htmlFor="csv-file">Select CSV File</Label>
                <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    disabled={importing}
                />
            </div>
            <Button type="submit" disabled={!file || importing}>
                {importing ? 'Importing...' : 'Import Data'}
            </Button>
            {result && <p className="mt-4 text-sm font-medium">{result}</p>}
        </form>
    )
}

