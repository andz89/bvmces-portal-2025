import LessonPlan from "./LessonPlan";
import { getLessonPlansByTerm, getSettings } from "../actions";
import RefreshError from "../RefreshError";
import { checkRole } from "@/utils/lib/checkRole.js";
import { canSubmitLessonPlan } from "@/utils/lib/canSubmitLessonPlan";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }) {
  const profile = await checkRole();

  if (!profile) {
    redirect("/login");
  }

  const { data, errorSettings } = await getSettings();
  const { term, id } = await searchParams;

  let termParams = term ? parseInt(term) : 1;
  let teacher_id = id;

  // Teachers may only view their own lesson plans; only admins/visitors
  // can view another teacher's records (e.g. via the admin dashboard link).
  if (
    profile.role !== "admin" &&
    profile.role !== "visitor" &&
    teacher_id !== profile.id
  ) {
    redirect("/lesson-plan");
  }

  let lessonPlans = [];

  try {
    lessonPlans = await getLessonPlansByTerm({
      term: termParams,
      teacher_id,
    });
  } catch (err) {
    console.error(err);

    return (
      <RefreshError
        message={
          err instanceof Error
            ? err.message
            : "Unable to load lesson plans. Please refresh the page."
        }
      />
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-green-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        <LessonPlan
          profile={profile}
          lessonPlans={lessonPlans}
          termParams={termParams}
          teacher_id={teacher_id}
          upload_lesson_plan={data?.active}
          canSubmit={canSubmitLessonPlan()}
        />
      </div>
    </div>
  );
}
