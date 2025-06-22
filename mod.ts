
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { app } from "./src/app.ts";

console.log("🚀 Kallama API listening on http://localhost:8000");
await serve(app.fetch, { port: 8000 });