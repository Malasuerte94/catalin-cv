import { db } from "../db";
import { admins } from "../db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const args = process.argv.slice(2);
  const emailArg = args.find(a => a.startsWith("--email="));
  const passwordArg = args.find(a => a.startsWith("--password="));

  if (!emailArg || !passwordArg) {
    console.error("Usage: bun run scripts/generate-admin.ts --email=... --password=...");
    process.exit(1);
  }

  const email = emailArg.split("=")[1];
  const password = passwordArg.split("=")[1];

  const existing = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
  if (existing.length > 0) {
    console.log("Admin already exists. Updating password...");
    const hashedPassword = await Bun.password.hash(password);
    await db.update(admins).set({ password: hashedPassword }).where(eq(admins.email, email));
    console.log("Admin password updated.");
  } else {
    const hashedPassword = await Bun.password.hash(password);
    await db.insert(admins).values({ email, password: hashedPassword });
    console.log("Admin created.");
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
