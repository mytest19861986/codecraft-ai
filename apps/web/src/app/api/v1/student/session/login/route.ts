import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/enums";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/security/password";
import { checkStudentAuthRateLimit, getClientIp } from "@/lib/security/student-auth-rate-limit";
import {
  STUDENT_SESSION_COOKIE_NAME,
  createStudentSessionCookieValue,
  studentSessionCookieOptions
} from "@/lib/security/student-session";
import { studentLoginSchema } from "@/lib/validators/student-auth";

const LOGIN_XP_REWARD = 10;
const XP_PER_LEVEL = 100;
const LOGIN_XP_COOLDOWN_MS = 24 * 60 * 60 * 1000;

function getLevelForXp(xp: number) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

function errorResponse(code: string, message: string, status: number, details?: unknown) {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code,
        message,
        ...(details ? { details } : {})
      }
    },
    { status }
  );
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request);

  if (!checkStudentAuthRateLimit(`login:${clientIp}`)) {
    return errorResponse("RATE_LIMIT_EXCEEDED", "Too many attempts. Please try again later.", 429);
  }

  try {
    const body = await request.json().catch(() => null);
    const result = studentLoginSchema.safeParse(body);

    if (!result.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid login input.", 400, result.error.flatten().fieldErrors);
    }

    const user = await prisma.user.findUnique({
      where: {
        phone: result.data.phone
      },
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        passwordHash: true,
        xp: true,
        level: true,
        createdAt: true
      }
    });

    if (user?.role !== UserRole.STUDENT || !user.passwordHash) {
      return errorResponse("INVALID_CREDENTIALS", "Invalid phone or password.", 401);
    }

    const isPasswordValid = await verifyPassword(result.data.password, user.passwordHash);

    if (!isPasswordValid) {
      return errorResponse("INVALID_CREDENTIALS", "Invalid phone or password.", 401);
    }

    const sessionValue = createStudentSessionCookieValue(user.id);

    if (!sessionValue) {
      return errorResponse("AUTH_UNAVAILABLE", "Authentication is unavailable.", 500);
    }

    const now = new Date();
    const loginXpCutoff = new Date(now.getTime() - LOGIN_XP_COOLDOWN_MS);
    const loginXpAward = await prisma.user.updateMany({
      where: {
        id: user.id,
        OR: [{ lastLoginXpAwardedAt: null }, { lastLoginXpAwardedAt: { lt: loginXpCutoff } }]
      },
      data: {
        xp: {
          increment: LOGIN_XP_REWARD
        },
        lastLoginXpAwardedAt: now
      }
    });

    let xp = user.xp;
    let level = user.level;

    if (loginXpAward.count > 0) {
      const rewardedUser = await prisma.user.findUnique({
        where: {
          id: user.id
        },
        select: {
          xp: true,
          level: true
        }
      });

      if (rewardedUser) {
        const nextLevel = getLevelForXp(rewardedUser.xp);
        const updatedUser =
          rewardedUser.level === nextLevel
            ? rewardedUser
            : await prisma.user.update({
                where: {
                  id: user.id
                },
                data: {
                  level: nextLevel
                },
                select: {
                  xp: true,
                  level: true
                }
              });
        xp = updatedUser.xp;
        level = updatedUser.level;
      }
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      xp,
      level,
      createdAt: user.createdAt
    };
    const response = NextResponse.json({ ok: true, user: safeUser });

    response.cookies.set(STUDENT_SESSION_COOKIE_NAME, sessionValue, studentSessionCookieOptions());

    return response;
  } catch {
    return errorResponse("INTERNAL_SERVER_ERROR", "Internal server error.", 500);
  }
}
