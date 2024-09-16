import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Hono } from "hono";
import { createBook, getAllBooks, getBookById } from "../controllers/books";
import { validateRequest } from "../middleware/auth";

export const books = new Hono();

books.get("/", validateRequest, async (c) => {
  try {
    const books = await getAllBooks();
    return c.json(books, 200);
  } catch (err) {
    console.error(err);
    return c.json({ message: "Error fetching books" }, 400);
  }
});

books.get("/:id", validateRequest, async (c) => {
  const id = c.req.param("id");
  try {
    const book = await getBookById(parseInt(id));
    return c.json(book, 200);
  } catch (err) {
    console.error(err);
    return c.json({ message: "Error fetching book with id: " + id }, 400);
  }
});

books.post(
  "/",
  validateRequest,
  zValidator(
    "json",
    z.object({
      title: z.string().min(3),
      userId: z.string().min(3),
    })
  ),
  async (c) => {
    try {
      const body = await c.req.json();
      await createBook(body);
      return c.json({ message: "Book created!" }, 200);
    } catch (err) {
      console.error(err);
      return c.json({ message: "Error creating book" }, 400);
    }
  }
);
