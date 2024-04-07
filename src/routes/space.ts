import { Hono } from "hono";
import { proposalById } from "../db/queries";

const space = new Hono();

space.get("/:space/download", async (c) => {
  try {
    const { space } = c.req.param();
    const file = Bun.file(`./src/db_files/${space}.db`);
    const exists = await file.exists();
    if (!exists) {
      return c.json({ error: "File not found" });
    }
    return new Response(file);
  } catch (e) {
    return c.json({ error: e });
  }
});

space.get("/:space/:id", async (c) => {
  const { space, id } = c.req.param()
  const proposal = await proposalById(space, id);
  return c.json({ data: proposal });
});

export default space;
