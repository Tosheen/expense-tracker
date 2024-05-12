import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

type Expense = {
  id: number;
  title: string;
  amount: number;
};

let fakeExpenses: Expense[] = [
  {
    id: 1,
    title: "Groceries",
    amount: 50,
  },
  {
    id: 2,
    title: "Utilities",
    amount: 100,
  },
  {
    id: 3,
    title: "Rent",
    amount: 1000,
  },
];

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.number().int().positive(),
});

const createPostSchema = expenseSchema.omit({
  id: true,
});

export const expenseRoutes = new Hono()
  .get("/", (c) => {
    return c.json({
      expenses: fakeExpenses,
    });
  })
  .post("/", zValidator("json", createPostSchema), async (c) => {
    const expense = await c.req.valid("json");
    const newExpense = {
      ...expense,
      id: fakeExpenses.length + 1,
    };
    fakeExpenses.push(newExpense);
    c.status(201);
    return c.json(newExpense);
  })
  .get("/total-spent", (c) => {
    const total = fakeExpenses.reduce((acc, current) => {
      return acc + current.amount;
    }, 0);

    return c.json({
      total,
    });
  })
  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"), 10);

    const expense = fakeExpenses.find((ex) => ex.id === id);

    if (expense == null) {
      return c.notFound();
    }

    return c.json(expense);
  })
  .delete("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"), 10);

    const expense = fakeExpenses.find((ex) => ex.id === id);

    if (expense == null) {
      return c.notFound();
    }

    fakeExpenses = fakeExpenses.filter((ex) => ex.id !== id);

    return c.json(expense);
  });
