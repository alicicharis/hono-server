import * as schema from "./schema";
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "dotenv/config";

declare global {
  var db: PostgresJsDatabase<typeof schema> | undefined;
}

let db: PostgresJsDatabase<typeof schema>;

if (process.env.NODE_ENV === "production") {
  console.log("Creating new db instance", process.env.DATABASE_URL);
  db = drizzle(postgres(process.env.DATABASE_URL!), { schema });
} else {
  if (!global.db) {
    console.log("Creating new db instance", process.env.DATABASE_URL);
    global.db = drizzle(postgres(process.env.DATABASE_URL!), {
      schema,
    });
  }
  db = global.db;
}

export { db };
