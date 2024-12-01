import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function GridSkeleton() {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[250px]" />
        <div className="space-x-2">
          <Skeleton className="h-10 w-[100px] inline-block" />
          <Skeleton className="h-10 w-[100px] inline-block" />
        </div>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-6 w-full" />
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(100)
              .fill(0)
              .map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array(5)
                    .fill(0)
                    .map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-[200px]" />
        <div className="space-x-2">
          <Skeleton className="h-10 w-[180px] inline-block" />
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
