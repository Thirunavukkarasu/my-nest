import { notFound } from "next/navigation"
import { Home, Users, CreditCard, Calendar, DollarSign, Maximize2, Bed, Bath, Wind, ArrowLeft, PlusIcon, MoreVerticalIcon, PencilIcon, TrashIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { db } from "@/db"
import { flatsTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import Link from 'next/link'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

async function getFlatData(flatId: string) {
  const flatData = await db.query.flatsTable.findFirst({
    where: eq(flatsTable.flatId, parseInt(flatId || '0')),
    with: {
      residents: true,
      payments: true
    },
  })
  return flatData
}

export default async function FlatDetailPage({ params }: { params: { flatId: string } }) {
  const flatData = await getFlatData(params?.flatId)

  if (!flatData) {
    notFound()
  }

  const {
    flatNumber,
    floorNumber,
    bedrooms,
    bathrooms,
    totalArea,
    balcony,
    status,
    monthlyRent,
    monthlyMaintenanceCharge,
    residents,
    payments
  } = flatData

  return (
    <div className="container py-6 px-10">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/flats" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Flats</span>
          </Link>
        </Button>
      </div>
      <div className="grid gap-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Flat {flatNumber}</h1>
            <p className="text-muted-foreground">Detailed information about the flat</p>
            <div className="mt-2">
              <Badge variant={status === "Occupied" ? "default" : "secondary"}>{status}</Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/residents/new?flatId=${params.flatId}`}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  <span>Add Resident</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/payments/new?flatId=${params.flatId}`}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  <span>Add Payment</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/flats/${params.flatId}/edit`}>
                  <PencilIcon className="mr-2 h-4 w-4" />
                  <span>Edit Flat</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <TrashIcon className="mr-2 h-4 w-4" />
                <span>Delete Flat</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Quick Info Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Floor</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{floorNumber}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bedrooms</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bedrooms}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bathrooms</CardTitle>
              <Bath className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bathrooms}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Area</CardTitle>
              <Maximize2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalArea} sq ft</div>
            </CardContent>
          </Card>
        </div>

        {/* Flat Details */}
        <Card>
          <CardHeader>
            <CardTitle>Flat Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Wind className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Balcony</p>
                    <p className="text-sm text-muted-foreground">{balcony ? "Yes" : "No"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Monthly Rent</p>
                    <p className="text-sm text-muted-foreground">${monthlyRent}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Monthly Maintenance</p>
                    <p className="text-sm text-muted-foreground">${monthlyMaintenanceCharge}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Current Residents</p>
                    <p className="text-sm text-muted-foreground">{residents.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Residents and Payments Tabs */}
        <Tabs defaultValue="residents" className="mt-6">
          <TabsList>
            <TabsTrigger value="residents">Residents</TabsTrigger>
            <TabsTrigger value="payments">Recent Payments</TabsTrigger>
          </TabsList>
          <TabsContent value="residents">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Current Residents</CardTitle>
                <Button asChild variant={'outline'}>
                  <Link href={`/residents/new`}>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Resident
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Lease Start</TableHead>
                      <TableHead>Lease End</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {residents.length > 0 ? (
                      residents.map((resident) => (
                        <TableRow key={resident.residentId}>
                          <TableCell className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={`${resident.firstName} ${resident.lastName}`} />
                              <AvatarFallback>{resident.firstName[0]}{resident.lastName[0]}</AvatarFallback>
                            </Avatar>
                            <span>{`${resident.firstName} ${resident.lastName}`}</span>
                          </TableCell>
                          <TableCell>{resident.email}</TableCell>
                          <TableCell>{resident.phone}</TableCell>
                          <TableCell>{new Date(resident.leaseStartDate).toLocaleDateString()}</TableCell>
                          <TableCell>{resident.leaseEndDate ? new Date(resident.leaseEndDate).toLocaleDateString() : 'N/A'}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">No residents found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
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
                      payments.slice(0, 5).map((payment) => (
                        <TableRow key={payment.paymentId}>
                          <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                          <TableCell>${payment.amount}</TableCell>
                          <TableCell>{payment.paymentType}</TableCell>
                          <TableCell>
                            <Badge variant={payment.status === "Paid" ? "default" : "secondary"}>{payment.status}</Badge>
                          </TableCell>
                          <TableCell>{payment.paymentMethod}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">No payment history available</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

