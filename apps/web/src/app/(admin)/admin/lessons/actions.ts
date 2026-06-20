"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createAdminLesson,
  deleteAdminLesson,
  isAdminLessonInput,
  readLessonInput,
  updateAdminLesson
} from "@/lib/admin/lessons";
import { ADMIN_SESSION_COOKIE_NAME, verifyAdminSessionCookie } from "@/lib/security/admin-session";

async function requireAdminSession() {
  const adminSession = (await cookies()).get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (!verifyAdminSessionCookie(adminSession)) {
    redirect("/admin/login");
  }
}

function redirectWithError(pathname: string, message: string): never {
  redirect(`${pathname}?error=${encodeURIComponent(message)}`);
}

export async function createLessonAction(formData: FormData) {
  await requireAdminSession();

  const input = readLessonInput(formData);

  if (!isAdminLessonInput(input)) {
    redirectWithError("/admin/lessons/new", input.message);
  }

  const result = await createAdminLesson(input);

  if (!result.ok) {
    redirectWithError("/admin/lessons/new", result.message);
  }

  revalidatePath("/admin/lessons");
  redirect(`/admin/lessons/${result.lesson.id}/edit?saved=created`);
}

export async function updateLessonAction(id: string, formData: FormData) {
  await requireAdminSession();

  const input = readLessonInput(formData);
  const editPath = `/admin/lessons/${encodeURIComponent(id)}/edit`;

  if (!isAdminLessonInput(input)) {
    redirectWithError(editPath, input.message);
  }

  const result = await updateAdminLesson(id, input);

  if (!result.ok) {
    redirectWithError(editPath, result.message);
  }

  revalidatePath("/admin/lessons");
  revalidatePath(editPath);
  redirect(`${editPath}?saved=updated`);
}

export async function deleteLessonAction(id: string) {
  await requireAdminSession();

  const result = await deleteAdminLesson(id);

  if (!result.ok) {
    redirectWithError("/admin/lessons", result.message);
  }

  revalidatePath("/admin/lessons");
  redirect("/admin/lessons?saved=deleted");
}
