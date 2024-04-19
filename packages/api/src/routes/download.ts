import { Hono } from "hono";
import { dbPath } from "../db/queries";

const download = new Hono();

download.get("/:space", async (c) => {
  try {
    const { space } = c.req.param();
    const file = Bun.file(`${dbPath}/${space}.db`);
    const exists = await file.exists();
    if (!exists) {
      return c.json({ error: "File not found" }, 404);
    }
    return new Response(file);
  } catch (e) {
    return c.json({ error: e }, 404);
  }
});

export default download;
