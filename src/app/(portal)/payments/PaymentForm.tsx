'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { paymentSchema, PaymentSchema } from '@/db/schema/payment'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createPayment } from './actions'
import { uploadReceipt } from './upload'
import { toast } from "@/hooks/use-toast"

interface NewPaymentFormProps {
    flats: { flatId: number; flatNumber: string }[]
    residents: { residentId: number; firstName: string; lastName: string }[]
}

export default function PaymentForm({ flats, residents }: NewPaymentFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)

    const form = useForm<PaymentSchema>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            flatId: undefined,
            residentId: undefined,
            amount: '',
            paymentDate: new Date().toISOString().split('T')[0],
            paymentType: '',
            paymentMethod: '',
            referenceNumber: '',
            notes: '',
            receiptUrl: '',
        },
    })

    async function onSubmit(data: PaymentSchema) {
        setIsSubmitting(true)
        try {
            let receiptUrl = ''
            
            if (uploadedFile) {
                const formData = new FormData()
                formData.append('file', uploadedFile)
                receiptUrl = await uploadReceipt(formData)
            }

            await createPayment({
                ...data,
                receiptUrl,
            })

            form.reset()
            setUploadedFile(null)
            toast({
                title: "Success",
                description: "Payment has been created successfully.",
            })
        } catch (error) {
            console.error('Failed to create payment:', error)
            toast({
                title: "Error",
                description: "Failed to create payment. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
                <FormField
                    control={form.control}
                    name="flatId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Flat</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={(value) => field.onChange(Number(value))}
                                    defaultValue={field.value?.toString() || ''}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a Flat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {flats.map((flat) => (
                                            <SelectItem key={flat.flatId} value={flat.flatId.toString()}>
                                                {flat.flatNumber}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="residentId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Resident</FormLabel>
                            <FormControl>
                                <Select onValueChange={(value) => field.onChange(Number(value))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a Resident" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {residents.map((resident) => (
                                            <SelectItem key={resident.residentId} value={resident.residentId.toString()}>
                                                {resident.firstName} {resident.lastName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="paymentDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Payment Date</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="receiptUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Receipt</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                            setUploadedFile(file)
                                            field.onChange(file.name) // Temporary value until upload
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                Upload payment receipt (PDF or image)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        'Add Payment'
                    )}
                </Button>
            </form>
        </Form>
    )
}

