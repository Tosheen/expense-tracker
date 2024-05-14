import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/expenses")({
  component: Expenses,
});

async function getAllExpenses() {
  try {
    await new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
    const response = await api.expenses.$get();
    if (response.ok === false) {
      throw new Error("server error");
    }
    const data = await response.json();
    return data.expenses;
  } catch (error) {
    throw new Error("server error");
  }
}

function Expenses() {
  const allExpenses = useQuery({
    queryKey: ["all-expenses"],
    queryFn: getAllExpenses,
    retry: 0,
    refetchOnWindowFocus: false,
  });

  if (allExpenses.isError && allExpenses.error) {
    return <div>{allExpenses.error.message}</div>;
  }

  return (
    <div className="p-2">
      <Table>
        <TableCaption>A list of all your expenses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allExpenses.isPending
            ? new Array(3).fill(0).map((_, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  </TableRow>
                );
              })
            : allExpenses.data?.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.id}</TableCell>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell className="text-right">{expense.amount}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
