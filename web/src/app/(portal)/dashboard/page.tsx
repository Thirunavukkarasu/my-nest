"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

// Types
type Payment = {
  amount: number;
  date: Date;
  status: "paid" | "partial" | "unpaid";
};

type FlatData = {
  id: string;
  number: string;
  owner: string;
  payments: Record<string, Payment>;
};

// Sample data generation
const generateSampleData = (
  numFlats: number,
  numMonths: number
): FlatData[] => {
  const flats: FlatData[] = [];
  const statuses: ("paid" | "partial" | "unpaid")[] = [
    "paid",
    "partial",
    "unpaid",
  ];
  const owners = [
    "John Doe",
    "Jane Smith",
    "Alice Johnson",
    "Bob Brown",
    "Charlie Davis",
  ];

  for (let i = 1; i <= numFlats; i++) {
    const flatPayments: Record<string, Payment> = {};
    const today = new Date();

    for (let j = 0; j < numMonths; j++) {
      const date = new Date(today.getFullYear(), today.getMonth() - j, 1);
      const monthKey = format(date, "yyyy-MM");
      flatPayments[monthKey] = {
        amount: Math.floor(Math.random() * 1000) + 500,
        date: date,
        status: statuses[Math.floor(Math.random() * statuses.length)],
      };
    }

    flats.push({
      id: `flat-${i}`,
      number: `${i}`,
      owner: owners[Math.floor(Math.random() * owners.length)],
      payments: flatPayments,
    });
  }

  return flats;
};

// Color scale based on payment status
const getColorClass = (status: "paid" | "partial" | "unpaid" | undefined) => {
  switch (status) {
    case "paid":
      return "bg-green-500";
    case "partial":
      return "bg-yellow-500";
    case "unpaid":
      return "bg-red-500";
    default:
      return "bg-gray-200";
  }
};

// Main component
export default function PaymentHeatmap() {
  const numFlats = 20;
  const numMonths = 12;
  const flatsData = generateSampleData(numFlats, numMonths);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [filterText, setFilterText] = useState("");

  const months = Array.from({ length: numMonths }, (_, i) => {
    const date = new Date(currentYear, 11 - i, 1);
    return format(date, "MMM");
  }).reverse();

  const handlePreviousYear = () => {
    setCurrentYear((prevYear) => prevYear - 1);
  };

  const handleNextYear = () => {
    setCurrentYear((prevYear) => prevYear + 1);
  };

  const filteredFlats = useMemo(() => {
    return flatsData.filter(
      (flat) =>
        flat.number.toLowerCase().includes(filterText.toLowerCase()) ||
        flat.owner.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [flatsData, filterText]);

  return (
    <div className="min-h-screen flex flex-col mx-auto">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between">
          <div className="flex items-center w-2/4">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <Input
              type="text"
              placeholder="Filter by flat number or owner"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handlePreviousYear}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-bold text-lg">{currentYear}</span>
            <Button variant="outline" size="sm" onClick={handleNextYear}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Flat / Owner
                    </th>
                    {months.map((month) => (
                      <th
                        key={month}
                        scope="col"
                        className="py-3 px-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {month}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFlats.map((flat) => (
                    <tr key={flat.id}>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          Flat {flat.number}
                        </div>
                        <div className="text-sm text-gray-500">
                          {flat.owner}
                        </div>
                      </td>
                      {months.map((month) => {
                        const date = new Date(
                          currentYear,
                          months.indexOf(month),
                          1
                        );
                        const monthKey = format(date, "yyyy-MM");
                        const payment = flat.payments[monthKey];
                        return (
                          <td
                            key={monthKey}
                            className="py-4 px-3 whitespace-nowrap"
                          >
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <div
                                    className={`w-8 h-8 mx-auto ${getColorClass(
                                      payment?.status
                                    )} rounded-sm`}
                                  ></div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Flat: {flat.number}</p>
                                  <p>Owner: {flat.owner}</p>
                                  <p>
                                    Month:{" "}
                                    {format(payment?.date || date, "MMMM yyyy")}
                                  </p>
                                  <p>Amount: ${payment?.amount || "N/A"}</p>
                                  <p>Status: {payment?.status || "No data"}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* <main className="flex-grow bg-gray-100 p-4 sm:p-6 lg:p-8">

      </main>
      <footer className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-sm mr-2"></div>
              <span className="text-sm text-gray-600">Paid</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-sm mr-2"></div>
              <span className="text-sm text-gray-600">Partial</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-sm mr-2"></div>
              <span className="text-sm text-gray-600">Unpaid</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-200 rounded-sm mr-2"></div>
              <span className="text-sm text-gray-600">No data</span>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
