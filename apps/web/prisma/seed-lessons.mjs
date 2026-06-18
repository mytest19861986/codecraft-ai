import pg from "pg";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

function loadEnvFile(path) {
  if (!existsSync(path)) {
    return;
  }

  const lines = readFileSync(path, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(join(process.cwd(), ".env"));
loadEnvFile(join(process.cwd(), "..", "..", ".env"));

const lessons = [
  {
    id: "lesson_coding_adventure_start",
    slug: "coding-adventure-start",
    title: "شروع ماجراجویی کدنویسی",
    description: "اولین قدم برای ساختن چیزهای جالب با کد و آشنایی با مسیر CodeCraft.",
    order: 1,
    xpReward: 20
  },
  {
    id: "lesson_variables_power",
    slug: "variables-power",
    title: "متغیرها و قدرت ذخیره‌سازی",
    description: "یاد می‌گیری چطور اطلاعات را نگه داری و دوباره در برنامه از آن استفاده کنی.",
    order: 2,
    xpReward: 20
  },
  {
    id: "lesson_conditions_decisions",
    slug: "conditions-decisions",
    title: "شرط‌ها و تصمیم‌گیری در کد",
    description: "با شرط‌ها به برنامه‌هایت قدرت تصمیم‌گیری می‌دهی.",
    order: 3,
    xpReward: 20
  }
];

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed lessons.");
}

const pool = new pg.Pool({ connectionString });

try {
  for (const lesson of lessons) {
    await pool.query(
      `
        INSERT INTO "Lesson" (
          "id",
          "slug",
          "title",
          "description",
          "order",
          "xpReward",
          "isActive",
          "updatedAt"
        )
        VALUES ($1, $2, $3, $4, $5, $6, true, CURRENT_TIMESTAMP)
        ON CONFLICT ("slug") DO UPDATE SET
          "title" = EXCLUDED."title",
          "description" = EXCLUDED."description",
          "order" = EXCLUDED."order",
          "xpReward" = EXCLUDED."xpReward",
          "isActive" = true,
          "updatedAt" = CURRENT_TIMESTAMP
      `,
      [lesson.id, lesson.slug, lesson.title, lesson.description, lesson.order, lesson.xpReward]
    );
  }

  console.log(`Seeded ${lessons.length} starter lessons.`);
} finally {
  await pool.end();
}
