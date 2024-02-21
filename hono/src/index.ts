import { serve } from "@hono/node-server";
import { readFile } from "fs/promises";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use("/*", cors());

app.get("/sample.vtt", async (c) => {
  const file = await readFile("assets/sample.vtt");
  return c.body(file);
});

app.get("/sample.m3u", async (c) => {
  const file = await readFile("assets/sample.m3u");
  return c.body(file);
});

app.get("/thumbnail.png", async (c) => {
  const file = await readFile("assets/thumbnail.png");
  return c.body(file);
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
