import { z } from "zod";

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Amount must be a valid monetary value",
  }),
  date: z.string().datetime(),
});

export const createExpenseSchema = expenseSchema.omit({
  id: true,
});
