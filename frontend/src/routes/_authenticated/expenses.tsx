import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { useExpenses } from "@/hooks/use-expenses";

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
import { Button } from "@/components/ui/button";

import { Trash } from "lucide-react";

export const Route = createFileRoute("/_authenticated/expenses")({
  component: Expenses,
});

function Expenses() {
  const allExpenses = useExpenses();

  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  if (allExpenses.status === "failed") {
    return <div>{allExpenses.error}</div>;
  }

  const deleteExpense = async (id: number) => {
    try {
      if (allExpenses.status === "loaded") {
        setDeleteId(id);
        await allExpenses.actions.deleteExpenseItem(id);
        toast.success("Successfully deleted an expense.");
      }
    } catch (error) {
      toast.error("Failed to delete an expense.");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="p-2">
      <Table>
        <TableCaption>A list of all your expenses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Operations</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allExpenses.status === "loading"
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
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  </TableRow>
                );
              })
            : allExpenses.status === "loaded"
              ? allExpenses.data?.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.id}</TableCell>
                    <TableCell>{expense.title}</TableCell>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell>{expense.amount}</TableCell>
                    <TableCell>
                      <Button
                        disabled={expense.id === deleteId}
                        onClick={() => deleteExpense(expense.id)}
                        variant="outline"
                        size="icon"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : null}
        </TableBody>
      </Table>
    </div>
  );
}
