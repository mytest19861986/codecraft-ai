"use client";

type DeleteLessonButtonProps = {
  action: () => void | Promise<void>;
  lessonTitle: string;
  lessonOrder: number;
};

export function DeleteLessonButton({ action, lessonTitle, lessonOrder }: DeleteLessonButtonProps) {
  return (
    <form action={action}>
      <button
        className="w-fit rounded-md border border-[#ff6b9d]/30 bg-[#ff6b9d]/10 px-3 py-2 text-xs font-black text-[#ffd6e5] hover:border-[#ff6b9d]"
        type="submit"
        onClick={(event) => {
          const confirmed = window.confirm(
            `درس «${lessonTitle}» با ترتیب ${lessonOrder.toLocaleString("fa-IR")} حذف شود؟ اگر این درس سابقه یادگیری داشته باشد، حذف انجام نمی‌شود.`
          );

          if (!confirmed) {
            event.preventDefault();
          }
        }}
      >
        حذف
      </button>
    </form>
  );
}
