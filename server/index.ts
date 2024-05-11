import app from "./app";
const port = process.env.PORT || 4000;

const server = Bun.serve({
  port, // defaults to $BUN_PORT, $PORT, $NODE_PORT otherwise 3000
  hostname: "0.0.0.0", // defaults to "0.0.0.0"
  fetch: app.fetch,
});

console.log("Server running", {
  port: server.port,
});
