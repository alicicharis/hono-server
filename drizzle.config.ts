import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

console.log("This is the DATABASE_URL: ", process.env.DATABASE_URL);

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  schema: "./src/db/schema.ts",
  out: "./src/db/drizzle",
});
