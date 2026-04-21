import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

type Args = {
  databaseUrl?: string;
  email?: string;
  password?: string;
  name?: string;
  phone?: string | null;
  allowLocal?: boolean;
};

function getArgValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function parseArgs(): Args {
  const positional = process.argv.slice(2).filter((value) => !value.startsWith("--"));

  return {
    databaseUrl:
      getArgValue("--database-url") ||
      process.env.RENDER_DATABASE_URL ||
      process.env.DATABASE_URL,
    email: getArgValue("--email") || positional[0] || process.env.ADMIN_EMAIL,
    password: getArgValue("--password") || positional[1] || process.env.ADMIN_PASSWORD,
    name: getArgValue("--name") || positional[2] || process.env.ADMIN_NAME || "Platform Admin",
    phone: getArgValue("--phone") || positional[3] || process.env.ADMIN_PHONE || null,
    allowLocal: process.argv.includes("--allow-local"),
  };
}

function isLocalDatabaseUrl(databaseUrl: string): boolean {
  try {
    const parsed = new URL(databaseUrl);
    const host = parsed.hostname.toLowerCase();
    return host === "localhost" || host === "127.0.0.1" || host === "::1";
  } catch {
    // If URL is malformed, let Prisma fail with a clear error later.
    return false;
  }
}

function printDatabaseInfo(databaseUrl: string, source: string) {
  try {
    const parsed = new URL(databaseUrl);
    const dbName = parsed.pathname.replace("/", "") || "(unknown)";
    console.log(`[create-admin] DATABASE_URL source: ${source}`);
    console.log(
      `[create-admin] Target DB => protocol=${parsed.protocol.replace(":", "")}, host=${parsed.host}, db=${dbName}`
    );
  } catch {
    console.log(`[create-admin] DATABASE_URL source: ${source}`);
    console.log("[create-admin] Target DB => unable to parse URL (raw value provided)");
  }
}

async function main() {
  const args = parseArgs();
  const email = args.email;
  const plainPassword = args.password;
  const name = args.name!;
  const phone = args.phone;
  const databaseUrl = args.databaseUrl;

  if (!databaseUrl) {
    console.error("Missing database URL.");
    console.error("Pass it with --database-url or set RENDER_DATABASE_URL in the shell.");
    process.exit(1);
  }

  if (isLocalDatabaseUrl(databaseUrl) && !args.allowLocal) {
    console.error(
      "Refusing to run against a local database URL (localhost/127.0.0.1)."
    );
    console.error("Provide your Render Postgres URL with --database-url.");
    console.error("If you intentionally want local, pass --allow-local.");
    process.exit(1);
  }

  const source = getArgValue("--database-url")
    ? "--database-url"
    : process.env.RENDER_DATABASE_URL
      ? "RENDER_DATABASE_URL"
      : "DATABASE_URL";
  printDatabaseInfo(databaseUrl, source);

  if (!email || !plainPassword) {
    console.error("Usage:");
    console.error(
      "npx ts-node --transpile-only scratch/create-admin.ts --database-url <url> --email <email> --password <password> [--name <name>] [--phone <phone>]"
    );
    console.error("or");
    console.error(
      "npx ts-node --transpile-only scratch/create-admin.ts <email> <password> [name] [phone] --database-url <url>"
    );
    process.exit(1);
  }

  // Make sure Prisma uses the chosen target URL for this process.
  process.env.DATABASE_URL = databaseUrl;
  const prisma = new PrismaClient();

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    if (existing.role === "PLATFORM_ADMIN") {
      console.log(`[create-admin] Admin already exists: ${email}`);
      await prisma.$disconnect();
      return;
    }

    console.error(
      `[create-admin] User with email ${email} already exists with role ${existing.role}. No changes were made.`
    );
    await prisma.$disconnect();
    process.exit(1);
  }

  const rounds = parseInt(process.env.BCRYPT_ROUNDS || "12", 10);
  const hashedPassword = await bcrypt.hash(plainPassword, rounds);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      role: "PLATFORM_ADMIN",
      status: "ACTIVE",
      emailVerified: true,
    },
  });

  console.log(`[create-admin] Admin created successfully: ${email}`);
  await prisma.$disconnect();
}

main()
  .catch((error) => {
    console.error("[create-admin] Failed:", error);
    process.exit(1);
  });
