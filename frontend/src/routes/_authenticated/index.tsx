import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { api } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/")({
  component: Index,
});

async function getTotalSpent() {
  try {
    const response = await api.expenses["total-spent"].$get();
    if (response.ok === false) {
      throw new Error("server error");
    }
    const data = await response.json();
    return data.total;
  } catch (error) {
    throw new Error("server error");
  }
}

function Index() {
  const total = useQuery({
    queryKey: ["total-spent"],
    queryFn: getTotalSpent,
    retry: 0,
  });

  console.log({
    total,
  });

  if (total.isError && total.error) {
    return <div>{total.error.message}</div>;
  }

  return (
    <div className="p-2">
      <Card>
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>
          <CardDescription>The total amount you've spent</CardDescription>
        </CardHeader>
        <CardContent>{total.isPending ? "..." : total.data}</CardContent>
      </Card>
    </div>
  );
}
