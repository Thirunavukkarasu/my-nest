import { notFound } from "next/navigation"
import Link from 'next/link'
import { Calendar, DollarSign, CreditCard, CheckCircle, XCircle, Home, User, FileText, ArrowLeft, MoreVertical, Pencil, Trash } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { db } from "@/db"
import { paymentsTable } from "@/db/schema"
import { eq } from "drizzle-orm"

async function getPaymentData(paymentId: string) {
    const paymentData = await db.query.paymentsTable.findFirst({
        where: eq(paymentsTable.paymentId, parseInt(paymentId || "0")),
        with: {
            flat: true,
            resident: true,
        },
    })
    return paymentData
}

export default async function PaymentDetailPage({ params }: { params: { paymentId: string } }) {
    const paymentData = await getPaymentData(params?.paymentId)

    if (!paymentData) {
        notFound()
    }

    const {
        paymentDate,
        dueDate,
        amount,
        paymentType,
        status = "Paid",
        paymentMethod,
        referenceNumber,
        notes,
        flat,
        resident,
    } = paymentData

    return (
        <div className="container py-6 px-10">
            <div className="mb-6">
                <Button variant="ghost" asChild>
                    <Link href="/payments" className="flex items-center space-x-2">
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Payments</span>
                    </Link>
                </Button>
            </div>
            <div className="grid gap-6">
                {/* Header Section */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Payment Details</h1>
                        <p className="text-muted-foreground">Detailed information about this payment</p>
                        <div className="mt-2">
                            <Badge variant={status === "Paid" ? "default" : "secondary"}>
                                {status === "Paid" ? (
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                ) : (
                                    <XCircle className="mr-2 h-4 w-4" />
                                )}
                                {status || 'Paid'}
                            </Badge>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Edit Payment</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Trash className="mr-2 h-4 w-4" />
                                <span>Delete Payment</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Quick Info Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Amount</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${amount}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Payment Date</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{new Date(paymentDate).toLocaleDateString()}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Payment Type</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{paymentType || 'Online'}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Payment Method</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{paymentMethod || 'UPI'}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Payment Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Due Date</p>
                                        <p className="text-sm text-muted-foreground">
                                            {dueDate ? new Date(dueDate).toLocaleDateString() : "N/A"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Reference Number</p>
                                        <p className="text-sm text-muted-foreground">{referenceNumber || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                            {notes && (
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Notes</p>
                                            <p className="text-sm text-muted-foreground">{notes}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Associated Entities */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Associated Flat */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Associated Flat</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-4">
                                <Home className="h-10 w-10 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Flat Number: {flat.flatNumber}</p>
                                    <p className="text-sm text-muted-foreground">Monthly Rent: ${flat.monthlyRent}</p>
                                    <p className="text-sm text-muted-foreground">Maintenance: ${flat.monthlyMaintenanceCharge}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Associated Resident */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Associated Resident</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={`${resident.firstName} ${resident.lastName}`} />
                                    <AvatarFallback>{resident.firstName[0]}{resident.lastName[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">{`${resident.firstName} ${resident.lastName}`}</p>
                                    <p className="text-sm text-muted-foreground">Lease Start: {new Date(resident.leaseStartDate).toLocaleDateString()}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Lease End: {resident.leaseEndDate ? new Date(resident.leaseEndDate).toLocaleDateString() : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

