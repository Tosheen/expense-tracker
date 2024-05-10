import { Hono } from "hono";
import { logger } from "hono/logger";
import { expenseRoutes } from "./routes/expenses";
const app = new Hono();

app.use("*", logger());

app.get("/", (c) => {
  return c.json({ message: "test" });
});

app.route("/api/expenses", expenseRoutes);

export default app;
