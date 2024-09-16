import { Context } from "hono";
import { BlankEnv, BlankInput, Next } from "hono/types";
import { lucia } from "../auth/lucia";

export const validateRequest = async (
  c: Context<BlankEnv, "/", BlankInput>,
  next: Next
) => {
  const authorizationHeader = c.req.header("Authorization");
  const session = authorizationHeader?.replace("Bearer ", "").trim();

  if (!session) return c.json({ message: "Unauthorized" }, 401);

  const isValidSession = await lucia.validateSession(session);

  if (!isValidSession?.session) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  return await next();
};
