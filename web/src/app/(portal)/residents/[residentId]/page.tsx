import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"
import Link from 'next/link'
import { CreditCard, Calendar, DollarSign, Mail, Phone, Building, Clock, ArrowLeft } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { db } from "@/db"
import { residentsTable } from "@/db/schema"


async function getResidentData(residentId: string) {
    const residentData = await db.query.residentsTable.findFirst({
        where: eq(residentsTable.residentId, parseInt(residentId || "0")),
        with: {
            flat: true,
        },
    })
    return residentData
}

async function getPayments(residentId: string) {
    const payments = await db.query.paymentsTable.findMany({
        where: eq(residentsTable.residentId, parseInt(residentId))
    })
    return payments
}

export default async function ResidentDetailPage({ params }: { params: { residentId: string } }) {
    const residentId = params?.residentId;
    const residentData = await getResidentData(params?.residentId)
    const payments = await getPayments(params?.residentId)

    if (!residentData) {
        notFound()
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
    } = residentData

    return (
        <div className="container py-6 px-4">
            <div className="mb-6">
                <Button variant="ghost" asChild>
                    <Link href="/residents" className="flex items-center space-x-2">
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Residents</span>
                    </Link>
                </Button>
            </div>
            <div className="grid gap-6">
                {/* Header Section */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={`/placeholder.svg?height=80&width=80`} alt={`${firstName} ${lastName}`} />
                            <AvatarFallback>{`${firstName[0]}${lastName[0]}`}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-3xl font-bold">{`${firstName} ${lastName}`}</h1>
                            <p className="text-muted-foreground">Detailed information about the resident</p>
                            <div className="mt-2">
                                <Badge variant={isPrimaryTenant ? "default" : "secondary"}>
                                    {isPrimaryTenant ? "Primary Tenant" : "Additional Tenant"}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <div className="space-x-3">
                        <Button variant="outline" asChild>
                            <Link href={`/residents/${residentId}/edit`}>Edit Resident</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={`/residents/new?flatId=${flat.flatId}`}>Add Resident</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={`/payments/new?residentId=${residentId}`}>Add Payment</Link>
                        </Button>
                    </div>
                </div>

                {/* Quick Info Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Flat Number</CardTitle>
                            <Building className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{flat.flatNumber}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Monthly Rent</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${flat.monthlyRent}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${flat.monthlyMaintenanceCharge}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Lease Period</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{leaseEndDate ?
                                Math.ceil((new Date(leaseEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 'N/A'
                            }</div>
                            <p className="text-xs text-muted-foreground">Days Remaining</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Contact & Lease Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Contact & Lease Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Email</p>
                                        <p className="text-sm text-muted-foreground">{email || "N/A"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <Phone className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Phone</p>
                                        <p className="text-sm text-muted-foreground">{phone || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Lease Start Date</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(leaseStartDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Lease End Date</p>
                                        <p className="text-sm text-muted-foreground">
                                            {leaseEndDate ? new Date(leaseEndDate).toLocaleDateString() : "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment History */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Payments</CardTitle>
                        <CardDescription>Latest payment transactions for this resident</CardDescription>
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
                                {payments.length > 0 ? (
                                    payments.slice(0, 5).map((payment: any) => (
                                        <TableRow key={payment.paymentId}>
                                            <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                                            <TableCell>${payment.amount}</TableCell>
                                            <TableCell>{payment.paymentType}</TableCell>
                                            <TableCell>
                                                <Badge variant={payment.status === "Paid" ? "default" : "secondary"}>
                                                    {payment.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{payment.paymentMethod}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                                            No payment history available
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

