'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentSchema, PaymentSchema } from '@/db/schema/payment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createPayment } from './actions';

interface NewPaymentFormProps {
    flats: { flatId: number; flatNumber: string }[];
    residents: { residentId: number; firstName: string; lastName: string }[];
}

export default function PaymentForm({ flats, residents }: NewPaymentFormProps) {
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
        },
    });

    async function onSubmit(data: PaymentSchema) {
        try {
            await createPayment(data);
            form.reset();
            // Add a success message or redirect
        } catch (error) {
            console.error('Failed to create payment:', error);
            // Show an error message
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
                <Button type="submit">Add Payment</Button>
            </form>
        </Form>
    );
}
