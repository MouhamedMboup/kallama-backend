// src/routes/tasks.ts
import { Hono } from "https://deno.land/x/hono@v2.5.5/mod.ts";

const tasksRouter = new Hono();

tasksRouter.get("/", (c) => c.json([]));  // placeholder

export default tasksRouter;