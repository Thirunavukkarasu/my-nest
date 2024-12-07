import { notFound } from "next/navigation"
import { Home, Users, CreditCard, Calendar, DollarSign, Maximize2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { db } from "@/db"
import { flatsTable } from "@/db/schema"
import { eq } from "drizzle-orm"


async function getFlatData(flatId: string) {
  const flatData = db.query.flatsTable.findFirst({
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
  console.log(params)

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
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Flat {flatNumber}</CardTitle>
          <CardDescription>Detailed information about the flat</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Home className="mr-2" />
              <span>Floor: {floorNumber}</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-2" />
              <span>Bedrooms: {bedrooms}</span>
            </div>
            <div className="flex items-center">
              <CreditCard className="mr-2" />
              <span>Bathrooms: {bathrooms}</span>
            </div>
            <div className="flex items-center">
              <Maximize2 className="mr-2" />
              <span>Total Area: {totalArea} sq ft</span>
            </div>
            <div className="flex items-center">
              <span>Balcony: {balcony ? "Yes" : "No"}</span>
            </div>
            <div className="flex items-center">
              <Badge variant={status === "Occupied" ? "default" : "secondary"}>{status}</Badge>
            </div>
            <div className="flex items-center">
              <DollarSign className="mr-2" />
              <span>Monthly Rent: ${monthlyRent}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="mr-2" />
              <span>Maintenance: ${monthlyMaintenanceCharge}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="residents" className="mt-6">
        <TabsList>
          <TabsTrigger value="residents">Residents</TabsTrigger>
          <TabsTrigger value="payments">Recent Payments</TabsTrigger>
        </TabsList>
        <TabsContent value="residents">
          <Card>
            <CardHeader>
              <CardTitle>Current Residents</CardTitle>
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
                  {residents.map((resident) => (
                    <TableRow key={resident.residentId}>
                      <TableCell>{`${resident.firstName} ${resident.lastName}`}</TableCell>
                      <TableCell>{resident.email}</TableCell>
                      <TableCell>{resident.phone}</TableCell>
                      <TableCell>{new Date(resident.leaseStartDate).toLocaleDateString()}</TableCell>
                      <TableCell>{resident.leaseEndDate ? new Date(resident.leaseEndDate).toLocaleDateString() : 'N/A'}</TableCell>
                    </TableRow>
                  ))}
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
                  {payments.slice(0, 5).map((payment) => (
                    <TableRow key={payment.paymentId}>
                      <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                      <TableCell>${payment.amount}</TableCell>
                      <TableCell>{payment.paymentType}</TableCell>
                      <TableCell>
                        <Badge variant={payment.status === "Paid" ? "default" : "secondary"}>{payment.status}</Badge>
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
  )
}

