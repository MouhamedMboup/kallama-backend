// src/routes/users.ts

import { Hono } from "https://deno.land/x/hono@v2.5.5/mod.ts";

const usersRouter = new Hono();

// GET /users → return an empty list for now
usersRouter.get("/", (c) => {
  return c.json([]);
});

export default usersRouter;