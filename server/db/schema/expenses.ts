import {
  text,
  pgTable,
  serial,
  index,
  numeric,
  timestamp,
  date,
} from "drizzle-orm/pg-core";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const expenses = pgTable(
  "expenses",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    amount: numeric("amount", {
      precision: 12,
      scale: 2,
    }).notNull(),
    date: date("date").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (expenses) => {
    return {
      userIdIndex: index("user_idx").on(expenses.userId),
    };
  }
);

// Schema for inserting a user - can be used to validate API requests
export const insertExpenseSchema = createInsertSchema(expenses);
// Schema for selecting a user - can be used to validate API responses
export const selectExpenseSchema = createSelectSchema(expenses);
