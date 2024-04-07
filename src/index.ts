import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import spaceRouter from "./routes/space";
import { pinDb } from "./ipfs";

const app = new Hono();
app.use(prettyJSON()); // append `?pretty` to the URL to get pretty JSON

app.get("/", (c) => {
  return c.json({ data: "Hello, World!" });
});

app.route("/s", spaceRouter)
app.get("/pin", async (c) => {
  const res = await pinDb();
  return c.json({ data: res });
});

const PORT = process.env.PORT || 3000;
console.log(`http://localhost:${PORT}`);
export default {
  port: PORT,
  fetch: app.fetch,
};
