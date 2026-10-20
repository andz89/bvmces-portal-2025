import { createReport, updateReport } from "@/app/features/reports/actions";
import { runFormRoute } from "@/utils/lib/formRoute";

// Create when no id is sent, otherwise update that report.
export async function POST(request) {
  return runFormRoute(
    request,
    (formData) => {
      const id = formData.get("id");

      return id ? updateReport(id, formData) : createReport(formData);
    },
    "reports",
  );
}
