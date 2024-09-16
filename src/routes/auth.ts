import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { getUserByEmail } from "../controllers/users";
import { Scrypt } from "lucia";
import { createSession } from "../auth/sessions";

export const auth = new Hono();

auth.post(
  "/login",
  zValidator(
    "json",
    z.object({
      email: z.string().email(),
      password: z.string().min(3),
    })
  ),
  async (c) => {
    const { email, password } = await c.req.json();

    const user = await getUserByEmail(email);
    if (user) {
      const isPasswordValid = new Scrypt().verify(password, user.passwordHash);

      if (!isPasswordValid) {
        return c.json({ message: "Invalid password" });
      }

      const session = await createSession(user.id);

      return c.json({ session: session.id }, 200);
    }

    return c.json({ message: "Internal server error!" }, 200);
  }
);
