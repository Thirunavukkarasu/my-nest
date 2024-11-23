"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";

// Sample apartment data
const apartments = [
  {
    id: 1,
    apartmentNo: "A101",
    ownerName: "John Doe",
    purchaseDate: "2023-01-15",
    housewarmingDate: "2023-02-01",
    status: "Occupied",
  },
  {
    id: 2,
    apartmentNo: "B202",
    ownerName: "Jane Smith",
    purchaseDate: "2023-03-10",
    housewarmingDate: "2023-04-01",
    status: "Vacant",
  },
  {
    id: 3,
    apartmentNo: "C303",
    ownerName: "Alice Johnson",
    purchaseDate: "2023-05-20",
    housewarmingDate: "2023-06-15",
    status: "Maintenance",
  },
  {
    id: 4,
    apartmentNo: "D404",
    ownerName: "Bob Williams",
    purchaseDate: "2023-07-05",
    housewarmingDate: "2023-08-01",
    status: "Occupied",
  },
  {
    id: 5,
    apartmentNo: "E505",
    ownerName: "Carol Brown",
    purchaseDate: "2023-09-12",
    housewarmingDate: "2023-10-01",
    status: "Vacant",
  },
];

export default function OwnersTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredRecords = apartments.filter((apartment) => {
    const matchesSearch =
      apartment.apartmentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apartment.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || apartment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Occupied":
        return "bg-green-500";
      case "Vacant":
        return "bg-yellow-500";
      case "Maintenance":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-4 p-8">
      <h1 className="text-2xl font-bold">Owners</h1>
      <div className="flex space-x-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search by Owner by Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Occupied">Occupied</SelectItem>
              <SelectItem value="Vacant">Vacant</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Apartment No.</TableHead>
            <TableHead>Owner Name</TableHead>
            <TableHead>Purchase Date</TableHead>
            <TableHead>Housewarming Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">
                {record.apartmentNo}
              </TableCell>
              <TableCell>{record.ownerName}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                  {formatDate(record.purchaseDate)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                  {formatDate(record.housewarmingDate)}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(record.status)}>
                  {record.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
