import { cookies } from "next/headers";
import { UserRole } from "@/generated/prisma/enums";
import { prisma } from "@/lib/db/prisma";
import { STUDENT_SESSION_COOKIE_NAME, verifyStudentSessionCookie } from "@/lib/security/student-session";

export type AuthenticatedStudent = {
  id: string;
  name: string;
  phone: string;
  role: typeof UserRole.STUDENT;
  xp: number;
  level: number;
  createdAt: Date;
};

export async function getAuthenticatedStudent(): Promise<AuthenticatedStudent | null> {
  const cookieStore = await cookies();
  const session = verifyStudentSessionCookie(cookieStore.get(STUDENT_SESSION_COOKIE_NAME)?.value);

  if (!session) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.sub
      },
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        xp: true,
        level: true,
        createdAt: true
      }
    });

    if (!user || user.role !== UserRole.STUDENT) {
      return null;
    }

    return {
      ...user,
      role: UserRole.STUDENT
    };
  } catch {
    return null;
  }
}
