import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";

import { expenseRoutes } from "./routes/expenses";
import { authRoutes } from "./routes/auth";

const app = new Hono();

app.use("*", logger());

const apiRoutes = app
  .basePath("/api")
  .route("/expenses", expenseRoutes)
  .route("/", authRoutes);

app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

export default app;

export type API_ROUTES = typeof apiRoutes;
