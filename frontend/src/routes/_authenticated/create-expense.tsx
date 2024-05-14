import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import type { FieldApi } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import { createExpenseSchema } from "@server/shared-schemas";

import { useExpenses } from "@/hooks/use-expenses";

export const Route = createFileRoute("/_authenticated/create-expense")({
  component: CreateExpense,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.touchedErrors ? (
        <em>{field.state.meta.touchedErrors}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

function CreateExpense() {
  const expenses = useExpenses();
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      title: "",
      amount: "0",
      date: new Date(),
    },
    validatorAdapter: zodValidator,
    onSubmit: async ({ value }) => {
      if (expenses.status === "loaded") {
        navigate({
          to: "/expenses",
        });
        try {
          await expenses.actions.createNewExpenseItem({
            ...value,
            date: value.date.toISOString(),
          });

          toast.success("Successfully created new expense.");
        } catch (error) {
          toast.error("Failed to create new expense.");
        }
      }
    },
  });

  return (
    <div className="p-2">
      <h2 className="mb-4">Create Expense</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div className="grid w-full items-center gap-1.5">
          <form.Field
            name="title"
            validators={{
              onChange: createExpenseSchema.shape.title,
            }}
            children={(field) => {
              return (
                <>
                  <Label htmlFor={field.name}>Title</Label>
                  <Input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Title"
                  />
                  <FieldInfo field={field} />
                </>
              );
            }}
          ></form.Field>
        </div>
        <div className="grid w-full items-center gap-1.5">
          <form.Field
            name="amount"
            validators={{
              onChange: createExpenseSchema.shape.amount,
            }}
            children={(field) => {
              return (
                <>
                  <Label htmlFor={field.name}>Amount</Label>
                  <Input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Title"
                  />
                  <FieldInfo field={field} />
                </>
              );
            }}
          ></form.Field>
        </div>
        <div className="grid w-full items-center gap-1.5">
          <form.Field
            name="date"
            validators={{
              onChange: z.date(),
            }}
            children={(field) => {
              return (
                <div className="inline-flex">
                  <Calendar
                    mode="single"
                    selected={field.state.value}
                    onSelect={(date) => field.handleChange(date ?? new Date())}
                    className="rounded-md border w-full"
                  />
                </div>
              );
            }}
          ></form.Field>
        </div>
        <div>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => {
              return (
                <Button disabled={canSubmit === false}>
                  {isSubmitting ? `Creating an Expense` : "Create Expense"}
                </Button>
              );
            }}
          />
        </div>
      </form>
    </div>
  );
}
