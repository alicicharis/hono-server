import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { books } from "./routes/books";
import { books as booksSchema } from "./db/schema";
import { users } from "./routes/users";
import { logger } from "hono/logger";
import { auth } from "./routes/auth";
import { db } from "./db";
import "dotenv/config";
// import { validateRequest } from "./middleware/auth";

const app = new Hono();

const port = 3000;

const userId = "ekdpfq3bbanhhxn5wl3aws7q522ocnlfd2mqmvxmvzbla6p2eqla";

app.use(logger());
// app.use("/users/*", validateRequest);
// app.use("/books/*", validateRequest);

app.route("/auth", auth);
app.route("/books", books);
app.route("/users", users);

app.get("/", (c) => {
  console.log("DB URL: ", process.env.DATABASE_URL!);
  return c.text("Hello Hono!");
});

app.get("/setup", async (c) => {
  const randomSentences = Array.from({ length: 100 }).map(
    generateRandomSentence
  );

  for (const sentence of randomSentences) {
    await db.insert(booksSchema).values({ userId, title: sentence });
  }
  return c.json({
    message: "Setup completed successfully",
  });
});

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

export default app;

// imnimn3qvhsz2jicavu74aajwopmxuvfus6xc2bk

function generateRandomSentence() {
  const words = [
    "sky",
    "ocean",
    "mountain",
    "river",
    "sun",
    "moon",
    "stars",
    "cloud",
    "rain",
    "wind",
    "forest",
    "tree",
    "leaf",
    "flower",
    "grass",
    "desert",
    "sand",
    "snow",
    "fire",
    "storm",
  ];

  // Generate a single random sentence
  return (
    Array.from({ length: 5 }) // Create an array of length 5
      .map(() => words[Math.floor(Math.random() * words.length)]) // Select random word for each position
      .join(" ") + "."
  ); // Join the words into a sentence and add period at the end
}
