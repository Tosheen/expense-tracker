import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { eq, desc, sum, and } from "drizzle-orm";

import { db } from "../db";
import { userMiddleware } from "../kinde";
import { expenses as expensesTable } from "../db/schema/expenses";

import { createExpenseSchema } from "../shared-schemas";

export type Expense = {
  id: number;
  title: string;
  amount: string;
  date: string;
};

export const expenseRoutes = new Hono()
  .get("/", userMiddleware, async (c) => {
    const user = c.var.user;
    const expenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .orderBy(desc(expensesTable.createdAt))
      .limit(100);

    return c.json({
      expenses,
    });
  })
  .post(
    "/",
    userMiddleware,
    zValidator("json", createExpenseSchema),
    async (c) => {
      const user = c.var.user;
      const expense = await c.req.valid("json");
      const newExpense = await db
        .insert(expensesTable)
        .values({
          ...expense,
          userId: user.id,
        })
        .returning();

      return c.json(newExpense[0]);
    }
  )
  .get("/total-spent", userMiddleware, async (c) => {
    const user = c.var.user;
    const total = await db
      .select({
        total: sum(expensesTable.amount),
      })
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .limit(100);

    return c.json({
      total: total == null ? 0 : total[0].total,
    });
  })
  .get("/:id{[0-9]+}", userMiddleware, async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const user = c.var.user;

    const expense = await db
      .select()
      .from(expensesTable)
      .where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)));

    if (expense == null) {
      return c.notFound();
    }

    return c.json(expense[0]);
  })
  .delete("/:id{[0-9]+}", userMiddleware, async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const user = c.var.user;

    const expense = await db
      .delete(expensesTable)
      .where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)))
      .returning();

    return c.json(expense[0]);
  });
