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
    title: "ماموریت شروع: فکر کردن مثل برنامه‌نویس",
    description: "اولین قدم برای ورود به مسیر کدکرافت: مسئله را کوچک کن، مرحله بساز و برای هر قدم XP بگیر.",
    content:
      "هدف این مرحله این است که قبل از نوشتن کد، مثل یک سازنده فکر کنی.\n\nماموریت:\n1. یک بازی خیلی ساده انتخاب کن؛ مثلا حدس عدد یا انتخاب مسیر.\n2. قوانین بازی را در سه جمله بنویس.\n3. هر قانون را به یک قدم کوچک تبدیل کن.\n\nنمونه:\n- بازی یک عدد مخفی دارد.\n- بازیکن حدس می‌زند.\n- برنامه می‌گوید حدس بزرگ‌تر است یا کوچک‌تر.\n\nوقتی این نقشه را ساختی، یعنی اولین قدم تفکر الگوریتمی را برداشتی.",
    order: 1,
    xpReward: 20
  },
  {
    id: "lesson_variables_power",
    slug: "variables-power",
    title: "متغیرها: کوله‌پشتی اطلاعات",
    description: "یاد می‌گیری چطور نام، امتیاز یا انتخاب بازیکن را نگه داری و دوباره در برنامه استفاده کنی.",
    content:
      "متغیر یعنی یک جای امن برای نگه داشتن اطلاعات.\n\nدر بازی‌ها، متغیرها همه‌جا هستند:\n- نام بازیکن\n- امتیاز فعلی\n- تعداد جان‌ها\n- مرحله‌ای که بازیکن در آن قرار دارد\n\nماموریت کوتاه:\nبرای یک بازی ساده، سه چیز بنویس که باید در حافظه نگه داشته شود. بعد برای هرکدام یک نام انگلیسی کوتاه انتخاب کن؛ مثلا playerName یا score.\n\nاین کار کمک می‌کند قبل از کدنویسی، مغز برنامه را مرتب ببینی.",
    order: 2,
    xpReward: 20
  },
  {
    id: "lesson_conditions_decisions",
    slug: "conditions-decisions",
    title: "شرط‌ها: انتخاب مسیر در بازی",
    description: "با شرط‌ها به برنامه قدرت تصمیم‌گیری می‌دهی؛ مثل وقتی بازی بر اساس جواب بازیکن مسیر تازه‌ای باز می‌کند.",
    content:
      "شرط‌ها به برنامه کمک می‌کنند تصمیم بگیرد.\n\nنمونه در یک بازی حدس عدد:\nاگر حدس بازیکن درست بود، پیام برد نمایش بده.\nاگر حدس بزرگ‌تر بود، راهنمایی کن که عدد کوچک‌تر است.\nاگر حدس کوچک‌تر بود، راهنمایی کن که عدد بزرگ‌تر است.\n\nماموریت کوتاه:\nبرای یک بازی انتخاب مسیر، دو شرط بنویس. مثلا اگر بازیکن کلید را برداشت، در باز شود؛ اگر برنداشت، مسیر بسته بماند.\n\nشرط‌ها همان لحظه‌ای هستند که برنامه از حالت ثابت خارج می‌شود و واکنش نشان می‌دهد.",
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
          "content",
          "order",
          "xpReward",
          "isActive",
          "updatedAt"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, true, CURRENT_TIMESTAMP)
        ON CONFLICT ("slug") DO UPDATE SET
          "title" = EXCLUDED."title",
          "description" = EXCLUDED."description",
          "content" = EXCLUDED."content",
          "order" = EXCLUDED."order",
          "xpReward" = EXCLUDED."xpReward",
          "isActive" = true,
          "updatedAt" = CURRENT_TIMESTAMP
      `,
      [lesson.id, lesson.slug, lesson.title, lesson.description, lesson.content, lesson.order, lesson.xpReward]
    );
  }

  console.log(`Seeded ${lessons.length} starter lessons.`);
} finally {
  await pool.end();
}
