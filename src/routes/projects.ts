// src/routes/projects.ts
import { Hono } from "https://deno.land/x/hono@v2.5.5/mod.ts";
import client from "../db/client.ts";

const projectsRouter = new Hono();

// GET /projects → fetch all projects
projectsRouter.get("/", async (c) => {
  try {
    const result = await client.queryObject<{
      id: number;
      title: string;
      description: string;
      language_name: string;
      created_at: string;
      updated_at: string;
    }>(
      `SELECT id, title, description, language_name, created_at, updated_at
       FROM projects
       ORDER BY created_at DESC`
    );
    return c.json(result.rows);
  } catch (err) {
    console.error("DB error:", err);
    return c.json({ error: "Failed to fetch projects" }, 500);
  }
});

// GET /projects/:id → fetch one project by ID
projectsRouter.get("/:id", async (c) => {
    try {
      const id = c.req.param("id");
      // Validate that id is a number
      if (!/^\d+$/.test(id)) {
        return c.json({ error: "Invalid project ID" }, 400);
      }
  
      const result = await client.queryObject<{
        id: number;
        title: string;
        description: string;
        language_name: string;
        created_at: string;
        updated_at: string;
      }>(
        `SELECT id, title, description, language_name, created_at, updated_at
         FROM projects
         WHERE id = $1`,
        [Number(id)],
      );
  
      if (result.rows.length === 0) {
        return c.json({ error: "Project not found" }, 404);
      }
  
      return c.json(result.rows[0]);
    } catch (err) {
      console.error("DB error:", err);
      return c.json({ error: "Failed to fetch project" }, 500);
    }
  });

// POST /projects → create a new project
projectsRouter.post("/", async (c) => {
  try {
    // 1. Parse JSON body
    const { title, description, language_name } = await c.req.json();

    // 2. Basic validation
    if (!title || !description || !language_name) {
      return c.json(
        { error: "title, description and language_name are required" },
        400
      );
    }

    // 3. Insert into DB
    const insertResult = await client.queryObject<{
      id: number;
      title: string;
      description: string;
      language_name: string;
      created_at: string;
      updated_at: string;
    }>(
      `INSERT INTO projects (title, description, language_name)
       VALUES ($1, $2, $3)
       RETURNING id, title, description, language_name, created_at, updated_at`,
      [title, description, language_name],
    );

    const newProject = insertResult.rows[0];
    return c.json(newProject, 201);
  } catch (err) {
    console.error("DB error:", err);
    return c.json({ error: "Failed to create project" }, 500);
  }
});

// PUT /projects/:id → update a project
projectsRouter.put("/:id", async (c) => {
    try {
      const id = c.req.param("id");
      if (!/^\d+$/.test(id)) {
        return c.json({ error: "Invalid project ID" }, 400);
      }
  
      const { title, description, language_name } = await c.req.json();
      if (!title || !description || !language_name) {
        return c.json(
          { error: "title, description and language_name are required" },
          400
        );
      }
  
      const result = await client.queryObject<{
        id: number;
        title: string;
        description: string;
        language_name: string;
        created_at: string;
        updated_at: string;
      }>(
        `UPDATE projects
         SET title = $1,
             description = $2,
             language_name = $3,
             updated_at = NOW()
         WHERE id = $4
         RETURNING id, title, description, language_name, created_at, updated_at`,
        [title, description, language_name, Number(id)],
      );
  
      if (result.rows.length === 0) {
        return c.json({ error: "Project not found" }, 404);
      }
  
      return c.json(result.rows[0]);
    } catch (err) {
      console.error("DB error:", err);
      return c.json({ error: "Failed to update project" }, 500);
    }
  });

  // DELETE /projects/:id → delete a project
projectsRouter.delete("/:id", async (c) => {
    try {
      const id = c.req.param("id");
      if (!/^\d+$/.test(id)) {
        return c.json({ error: "Invalid project ID" }, 400);
      }
  
      const result = await client.queryObject(
        `DELETE FROM projects
         WHERE id = $1
         RETURNING id`,
        [Number(id)],
      );
  
      if (result.rows.length === 0) {
        return c.json({ error: "Project not found" }, 404);
      }
  
      return c.json({ success: true });
    } catch (err) {
      console.error("DB error:", err);
      return c.json({ error: "Failed to delete project" }, 500);
    }
  });
  
  

export default projectsRouter;
