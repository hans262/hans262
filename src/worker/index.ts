import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";

const app = new Hono<{ Bindings: Env }>();

app.get("/api/", async (c) => {
  const db = drizzle(c.env.mydb, { schema });

  // await db.insert(schema.user).values({
  //   id:3,
  //   email: "hans@262.cn"
  // })

  const users = await db.select().from(schema.user).all();

  console.log(users);
  return c.json({ name: "Stick Runner", users });
});

export default app;
