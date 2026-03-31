import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./index";

async function main() {
  console.log("Migration started...");
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("Migration ended.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
