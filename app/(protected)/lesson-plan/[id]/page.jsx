import LessonPlan from "./LessonPlan";
import { getLessonPlansByTerm } from "../actions";
import RefreshError from "../RefreshError";
import { checkRole } from "@/utils/lib/checkRole.js";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }) {
  const profile = await checkRole();

  //   if (profile.role !== "admin" && profile.role !== "visitor") {
  //     redirect("/");
  //   }

  const { term, id } = await searchParams;

  let lessonPlans = [];
  let error = null;

  let termParams = term ? parseInt(term) : 1;
  let teacher_id = id;

  try {
    lessonPlans = await getLessonPlansByTerm({
      term: termParams,
      teacher_id: teacher_id,
    });
  } catch (err) {
    console.error(err);
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
        <LessonPlan
          profile={profile}
          lessonPlans={lessonPlans}
          termParams={termParams}
          teacher_id={teacher_id}
        />
      </div>
    </div>
  );
}
