// src/app.ts
import { Hono } from "https://deno.land/x/hono@v2.5.5/mod.ts";
import { cors } from "https://deno.land/x/hono@v2.5.6/middleware.ts"; // Updated to a valid source
import 'https://deno.land/x/dotenv/load.ts';
import projectsRouter from "./routes/projects.ts";
import tasksRouter    from "./routes/tasks.ts";
import usersRouter    from "./routes/users.ts";

const app = new Hono();

// ⬇︎ Apply CORS to all paths ⬇︎
app.use("/*", cors({
  origin: ["http://localhost:5173"],
  allowMethods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowHeaders: ["Content-Type","Authorization"],
  credentials: true,
}));

// Your existing logger middleware
app.use('*', async (c, next) => {
  console.log(`${c.req.method} ${c.req.url}`);
  return next();
});

app.route('/projects', projectsRouter);
app.route('/tasks',    tasksRouter);
app.route('/users',    usersRouter);

const port = parseInt(Deno.env.get("PORT") || "8000");
console.log(`Server listening on http://localhost:${port}`);
Deno.serve({ port }, app.fetch);
