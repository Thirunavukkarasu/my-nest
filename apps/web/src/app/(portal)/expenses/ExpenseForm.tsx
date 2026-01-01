"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import { ExpenseSchema, expenseSchema } from "@/db/schema/expense"
import { createExpense, updateExpense } from "./actions"

type ExpenseFormProps = {
    initialData?: ExpenseSchema
    isEditMode: boolean
}

const categories = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Travel",
    "Healthcare",
    "Education",
    "Other"
]

const paymentMethods = [
    "Cash",
    "Credit Card",
    "Debit Card",
    "Bank Transfer",
    "Mobile Payment",
    "Other"
]

export default function ExpenseForm({ initialData, isEditMode }: ExpenseFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<ExpenseSchema>({
        resolver: zodResolver(expenseSchema),
        defaultValues: initialData || {
            expenseDate: new Date().toDateString(),
            category: "",
            description: "",
            amount: "0.00",
            paidBy: "",
            paymentMethod: "",
            receiptUrl: "",
            status: "Pending"
        },
    })

    async function onSubmit(data: ExpenseSchema) {
        setIsSubmitting(true)
        try {
            if (isEditMode) {
                await updateExpense(data)
            } else {
                await createExpense(data)
            }
            toast({
                title: `Expense ${isEditMode ? 'Updated' : 'Added'}`,
                description: `Expense has been ${isEditMode ? 'updated' : 'added'} successfully.`,
            })
            form.reset()
        } catch (error) {
            toast({
                title: "Error",
                description: "There was a problem with the expense submission.",
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
                    name="expenseDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                                <Input 
                                    type="date" 
                                    {...field} 
                                    value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''} 
                                    onChange={(e) => field.onChange(new Date(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                                <Input 
                                    type="number" 
                                    step="0.01" 
                                    {...field} 
                                    value={field.value ?? ''} 
                                    onChange={(e) => field.onChange(e.target.value)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="paidBy"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Paid By</FormLabel>
                            <FormControl>
                                <Input {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Payment Method</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select payment method" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {paymentMethods.map((method) => (
                                        <SelectItem key={method} value={method}>
                                            {method}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea 
                                    {...field}
                                    placeholder="Enter expense description"
                                    value={field.value ?? ''}
                                />
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
                                            // In a real application, you would upload the file and set the URL
                                            field.onChange(URL.createObjectURL(file))
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                Upload a receipt image or PDF (optional)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Approved">Approved</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : isEditMode ? 'Update Expense' : 'Add Expense'}
                </Button>
            </form>
        </Form>
    )
}

