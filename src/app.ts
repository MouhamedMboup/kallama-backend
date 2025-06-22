import { Hono } from "https://deno.land/x/hono@v2.5.5/mod.ts";
import 'https://deno.land/x/dotenv/load.ts';
import projectsRouter from "./routes/projects.ts";
import tasksRouter from "./routes/tasks.ts";
import usersRouter from "./routes/users.ts";

const app = new Hono();

app.use('*', async (c, next) => {
  console.log(`${c.req.method} ${c.req.url}`);
  return next();
});

app.route('/projects', projectsRouter);
app.route('/tasks',    tasksRouter);
app.route('/users',    usersRouter);

// Pick up PORT or default to 8000
const port = parseInt(Deno.env.get("PORT") || "8000");
console.log(`Server listening on http://localhost:${port}`);

// ← here’s the change:
Deno.serve({ port }, app.fetch);
