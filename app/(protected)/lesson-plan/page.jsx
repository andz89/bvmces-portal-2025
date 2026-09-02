import LessonPlanIndividual from "./LessonPlanIndividual";
import LessonPlanAdmin from "./LessonPlanAdmin";
import { getLessonPlans, getUsers, getAdminLessonPlans } from "./actions";
import RefreshError from "./RefreshError";
import { checkRole } from "@/utils/lib/checkRole.js";
import { canSubmitLessonPlan } from "@/utils/lib/canSubmitLessonPlan";
import { redirect } from "next/navigation";
export default async function Page({ searchParams }) {
  const profile = await checkRole();
  let users;

  if (profile.role === "admin" || profile.role === "visitor") {
    users = await getUsers();
  } else {
    users = [];
  }

  const params = await searchParams;

  let lessonPlans = [];
  let error = null;

  if (profile?.role === "null") {
    redirect("/login");
  }

  let termParams = params.term ? parseInt(params.term) : 1;
  let weekParams = params.week ? parseInt(params.week) : 1;
  if (profile?.role === "editor") {
    const params = new URLSearchParams({
      id: profile.id,
      term: "1",
    });

    redirect(`/lesson-plan/teacher?${params.toString()}`);
  }
  try {
    if (profile.role === "admin" || profile.role === "visitor") {
      lessonPlans = await getAdminLessonPlans({
        term: termParams,
        week: weekParams,
      });
    } else {
      throw new Error("Unauthorized role.");
    }
  } catch (err) {
    console.error("Failed to load lesson plans:", err);

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
    <div className="min-h-screen bg-lis-panel-header py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        <LessonPlanAdmin
          profile={profile}
          lessonPlans={lessonPlans}
          users={users}
          termParams={termParams}
          weekParams={weekParams}
          canSubmit={canSubmitLessonPlan()}
        />

        {/* <LessonPlanIndividual lessonPlans={lessonPlans} /> */}
      </div>
    </div>
  );
}
