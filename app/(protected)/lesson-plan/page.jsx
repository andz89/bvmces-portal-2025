import LessonPlanIndividual from "./LessonPlanIndividual";
import LessonPlanAdmin from "./LessonPlanAdmin";
import { getLessonPlans, getUsers, getAdminLessonPlans } from "./actions";
import RefreshError from "./RefreshError";
import { checkRole } from "@/utils/lib/checkRole.js";
import { redirect } from "next/navigation";
export default async function Page({ searchParams }) {
  const profile = await checkRole();
  let users;

  if (profile.role === "admin") {
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
    if (profile?.role === "admin" || profile?.role === "visitor") {
      console.log("visitor");
      lessonPlans = await getAdminLessonPlans({
        term: termParams,
        week: weekParams,
      });
    } else {
      throw new Error("Unauthorized role.");
    }
  } catch (err) {
    console.error("Failed to load lesson plans:", err);
    error = "Unable to load lesson plans. Please refresh the page.";
  }
  if (error) {
    return (
      <RefreshError message="Unable to load lesson plans. Please refresh the page." />
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-green-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        <LessonPlanAdmin
          profile={profile}
          lessonPlans={lessonPlans}
          users={users}
          termParams={termParams}
          weekParams={weekParams}
        />

        {/* <LessonPlanIndividual lessonPlans={lessonPlans} /> */}
      </div>
    </div>
  );
}
