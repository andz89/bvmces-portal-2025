import LessonPlanIndividual from "./LessonPlanIndividual";
import LessonPlanAdmin from "./LessonPlanAdmin";
import { getLessonPlans, getUsers, getAdminLessonPlans } from "./actions";

import { checkRole } from "@/utils/lib/checkRole.js";

export default async function Page({ searchParams }) {
  const profile = await checkRole();
  const users = await getUsers();
  let lessonPlans = [];
  if (profile?.role === "null") {
    redirect("/login");
  }
  const params = await searchParams;
  let termParams = params.term ? parseInt(params.term) : 1;
  let weekParams = params.week ? parseInt(params.week) : 1;

  if (profile?.role !== "admin") {
    lessonPlans = await getLessonPlans({
      term: termParams,
      week: weekParams,
      teacher_id: profile?.id,
    });
  } else {
    console.log("admin");
    lessonPlans = await getAdminLessonPlans({
      term: termParams,
      week: weekParams,
    });
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
