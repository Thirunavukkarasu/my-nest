import { notFound } from "next/navigation";
import {
    Calendar,
    DollarSign,
    CreditCard,
    CheckCircle,
    XCircle,
    Home,
    User,
    DockIcon
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/db";
import { paymentsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

async function getPaymentData(paymentId: string) {
    const paymentData = await db.query.paymentsTable.findFirst({
        where: eq(paymentsTable.paymentId, parseInt(paymentId || "0")),
        with: {
            flat: true, // Associated flat
            resident: true, // Associated resident
        },
    });
    return paymentData;
}

export default async function PaymentDetailPage({ params }: { params: { paymentId: string } }) {
    const paymentData = await getPaymentData(params?.paymentId);

    if (!paymentData) {
        notFound();
    }

    const {
        paymentDate,
        dueDate,
        amount,
        paymentType,
        status,
        paymentMethod,
        referenceNumber,
        notes,
        flat,
        resident,
    } = paymentData;

    return (
        <div className="container mx-auto py-10 px-4">
            {/* Payment Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">Payment Details</CardTitle>
                    <CardDescription>
                        Detailed information about this payment
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <Calendar className="mr-2" />
                            <span>Payment Date: {new Date(paymentDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="mr-2" />
                            <span>Due Date: {dueDate ? new Date(dueDate).toLocaleDateString() : "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                            <DollarSign className="mr-2" />
                            <span>Amount: ${amount}</span>
                        </div>
                        <div className="flex items-center">
                            <CreditCard className="mr-2" />
                            <span>Payment Type: {paymentType || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                            <Badge variant={status === "Paid" ? "default" : "secondary"}>
                                {status === "Paid" ? (
                                    <CheckCircle className="mr-2 text-green-500" />
                                ) : (
                                    <XCircle className="mr-2 text-red-500" />
                                )}
                                {status || "paid"}
                            </Badge>
                        </div>
                        <div className="flex items-center">
                            <CreditCard className="mr-2" />
                            <span>Payment Method: {paymentMethod || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                            <span>Reference #: {referenceNumber || "N/A"}</span>
                        </div>
                        {notes && (
                            <div className="flex items-center col-span-2">
                                <DockIcon className="mr-2" />
                                <span>Notes: {notes}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Associated Entities */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Associated Flat */}
                <Card>
                    <CardHeader>
                        <CardTitle>Associated Flat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center">
                            <Home className="mr-2" />
                            <span>Flat Number: {flat.flatNumber}</span>
                        </div>
                        <div className="flex items-center">
                            <DollarSign className="mr-2" />
                            <span>Monthly Rent: ${flat.monthlyRent}</span>
                        </div>
                        <div className="flex items-center">
                            <DollarSign className="mr-2" />
                            <span>Maintenance: ${flat.monthlyMaintenanceCharge}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Associated Resident */}
                <Card>
                    <CardHeader>
                        <CardTitle>Associated Resident</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center">
                            <User className="mr-2" />
                            <span>{`${resident.firstName} ${resident.lastName}`}</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="mr-2" />
                            <span>Lease Start: {new Date(resident.leaseStartDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="mr-2" />
                            <span>Lease End: {resident.leaseEndDate ? new Date(resident.leaseEndDate).toLocaleDateString() : "N/A"}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
