"use server";
import { db } from "@/db"
import { flatsTable } from "@/db/schema"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

export async function FlatSelect({ form }: { form: any }) {
    const flats = await db.select().from(flatsTable)

    return (
        <FormField
            control={form.control}
            name="flatId"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Flat</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a flat" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {flats.map((flat) => (
                                <SelectItem key={flat.flatId} value={flat.flatId.toString()}>
                                    {flat.flatNumber}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

