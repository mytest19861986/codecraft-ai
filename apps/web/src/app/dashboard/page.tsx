import { redirect } from "next/navigation";
import { StudentLogoutButton } from "@/components/auth/student-logout-button";
import { StudentDashboardPanel } from "@/components/student/student-dashboard-panel";
import { getAuthenticatedStudent } from "@/lib/security/student-auth";
import { getStudentLessonPath } from "@/lib/student/lessons";

export const metadata = {
  title: "داشبورد دانش‌آموز",
  robots: { index: false, follow: false }
};

export default async function DashboardPage() {
  const student = await getAuthenticatedStudent();

  if (!student) {
    redirect("/login");
  }

  const lessonPath = await getStudentLessonPath(student.id);

  return (
    <section className="mx-auto flex min-h-[calc(100svh-8rem)] w-full max-w-5xl items-center px-5 py-10 sm:px-7 sm:py-14 lg:px-5">
      <StudentDashboardPanel
        student={{
          name: student.name,
          phone: student.phone,
          xp: student.xp,
          level: student.level
        }}
        lessons={lessonPath.map((lesson) => ({
          ...lesson,
          completedAt: lesson.completedAt ? lesson.completedAt.toISOString() : null
        }))}
        logoutButton={<StudentLogoutButton />}
      />
    </section>
  );
}
