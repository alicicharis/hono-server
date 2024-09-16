import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { generateIdFromEntropySize, Scrypt } from "lucia";
import { createUser, getAllUsers, getUserById } from "../controllers/users";
import { createSession } from "../auth/sessions";

export const users = new Hono();

users.get("/", async (c) => {
  try {
    const users = await getAllUsers();
    return c.json(users, 200);
  } catch (err) {
    console.error(err);
    return c.json({ message: "Error fetching users" }, 400);
  }
});

users.get("/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const user = await getUserById(id);
    return c.json(user, 200);
  } catch (err) {
    console.error(err);
    return c.json({ message: "Error fetching user with id: " + id }, 400);
  }
});

users.post(
  "/",
  zValidator(
    "json",
    z.object({
      username: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(3),
    })
  ),
  async (c) => {
    try {
      const body = await c.req.json();
      console.log("Body: ", body);
      const passwordHash = await new Scrypt().hash(body.password);
      const id = generateIdFromEntropySize(32);
      const res = await createUser({ ...body, id, passwordHash });
      console.log("Res: ", res);

      if (res) {
        const session = await createSession(res.userId);
        console.log("Session here: ", session);
        return c.json({ message: "User created!", session }, 200);
      }

      return c.json({ message: "Internal server error!" }, 400);
    } catch (err) {
      console.error(err);
      return c.json({ message: "Error creating user" }, 400);
    }
  }
);
