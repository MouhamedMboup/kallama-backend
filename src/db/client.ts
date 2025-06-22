
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import "https://deno.land/x/dotenv/load.ts";

const client = new Client({
  user:     Deno.env.get("POSTGRES_USER")!,
  password: Deno.env.get("POSTGRES_PASSWORD")!,
  database: Deno.env.get("POSTGRES_DB")!,
  hostname: Deno.env.get("POSTGRES_HOST") || "localhost",
  port:     parseInt(Deno.env.get("POSTGRES_PORT") || "5432", 10),
});

await client.connect();
console.log("✅ Postgres connected!");

export default client;