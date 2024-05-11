import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function App() {
  const [totalSpent, setTotalSpent] = React.useState(0);

  React.useEffect(() => {
    async function getTotalSpent() {
      const response = await fetch("/api/expenses/total-spent");
      const data = await response.json();
      setTotalSpent(data.total);
    }

    getTotalSpent();
  }, []);
  return (
    <>
      <Card className="w-[350px] mx-auto">
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>
          <CardDescription>The total amount you've spent</CardDescription>
        </CardHeader>
        <CardContent>{totalSpent}</CardContent>
      </Card>
    </>
  );
}

export default App;
