import { notFound } from "next/navigation";
import {
    Home,
    CreditCard,
    Calendar,
    DollarSign,
    User,
    Mail,
    Phone,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { db } from "@/db";
import { residentsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

async function getResidentData(residentId: string) {
    const residentData = await db.query.residentsTable.findFirst({
        where: eq(residentsTable.residentId, parseInt(residentId || "0")),
        with: {
            flat: true, // Associated flat
        },
    });
    return residentData;
}

export default async function ResidentDetailPage({ params }: { params: { residentId: string } }) {
    const residentData = await getResidentData(params?.residentId);

    if (!residentData) {
        notFound();
    }

    const {
        firstName,
        lastName,
        email,
        phone,
        leaseStartDate,
        leaseEndDate,
        isPrimaryTenant,
        flat,
    } = residentData;
    const payments: any = [];

    return (
        <div className="container mx-auto py-10 px-4">
            {/* Resident Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">{`${firstName} ${lastName}`}</CardTitle>
                    <CardDescription>
                        Detailed information about the resident
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <User className="mr-2" />
                            <span>Email: {email || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                            <Phone className="mr-2" />
                            <span>Phone: {phone || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="mr-2" />
                            <span>Lease Start: {new Date(leaseStartDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="mr-2" />
                            <span>Lease End: {leaseEndDate ? new Date(leaseEndDate).toLocaleDateString() : "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                            <Badge variant={isPrimaryTenant ? "default" : "secondary"}>
                                {isPrimaryTenant ? "Primary Tenant" : "Additional Tenant"}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs Section */}
            <Tabs defaultValue="flat" className="mt-6">
                <TabsList>
                    <TabsTrigger value="flat">Flat Details</TabsTrigger>
                    <TabsTrigger value="payments">Payment History</TabsTrigger>
                </TabsList>

                {/* Flat Details */}
                <TabsContent value="flat">
                    <Card>
                        <CardHeader>
                            <CardTitle>Associated Flat</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center">
                                    <Home className="mr-2" />
                                    <span>Flat Number: {flat.flatNumber}</span>
                                </div>
                                <div className="flex items-center">
                                    <DollarSign className="mr-2" />
                                    <span>Monthly Rent: ${flat.monthlyRent}</span>
                                </div>
                                <div className="flex items-center">
                                    <CreditCard className="mr-2" />
                                    <span>Maintenance: ${flat.monthlyMaintenanceCharge}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Payment History */}
                <TabsContent value="payments">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Method</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payments.slice(0, 5).map((payment: any) => (
                                        <TableRow key={payment.paymentId}>
                                            <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                                            <TableCell>${payment.amount}</TableCell>
                                            <TableCell>{payment.paymentType}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={payment.status === "Paid" ? "default" : "secondary"}
                                                >
                                                    {payment.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{payment.paymentMethod}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
