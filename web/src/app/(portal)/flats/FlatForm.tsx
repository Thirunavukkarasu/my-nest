"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import { flatSchema, type FlatSchema } from "@/db/schema/flat"
import { createFlat, updateFlat } from "./actions"

type FlatFormProps = {
    initialData?: FlatSchema
    isEditMode: boolean
}

export default function FlatForm({ initialData, isEditMode }: FlatFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<FlatSchema>({
        resolver: zodResolver(flatSchema),
        defaultValues: initialData || {
            flatNumber: "",
            floorNumber: 1,
            bedrooms: 1,
            bathrooms: 1,
            totalArea: "1200.00",
            balcony: false,
            status: "vacant",
            monthlyRent: "0",
            monthlyMaintenanceCharge: "2000",
        },
    })

    async function onSubmit(data: FlatSchema) {
        setIsSubmitting(true)
        try {

            if (isEditMode) {
                await updateFlat(data)
            } else {
                await createFlat(data)
            }
            toast({
                title: `Flat ${isEditMode ? 'Updated' : 'Added'}`,
                description: `Flat ${data.flatNumber} has been ${isEditMode ? 'updated' : 'added'} successfully.`,
            })
            form.reset()
        } catch (error) {
            toast({
                title: "Error",
                description: "There was a problem creating the flat.",
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
                    name="flatNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Flat Number</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormDescription>
                                The unique identifier for the flat(G001, F101, S201, T301, F401, F501).
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="floorNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Floor Number</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bedrooms</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bathrooms</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="totalArea"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Total Area (sq ft)</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.01" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="balcony"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value ?? false}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Balcony
                                </FormLabel>
                                <FormDescription>
                                    Does this flat have a balcony?
                                </FormDescription>
                            </div>
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
                                        <SelectValue placeholder="Select flat status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="vacant">Vacant</SelectItem>
                                    <SelectItem value="occupied">Occupied</SelectItem>
                                    <SelectItem value="maintenance">Under Maintenance</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="monthlyRent"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Monthly Rent</FormLabel>
                            <FormControl>
                                <Input type="text" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="monthlyMaintenanceCharge"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Monthly Maintenance Charge</FormLabel>
                            <FormControl>
                                <Input type="text" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : isEditMode ? 'Update Flat' : 'Add Flat'}
                </Button>
            </form>
        </Form>
    )
}

