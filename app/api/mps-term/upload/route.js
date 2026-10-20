import {
  createMPSTermReport,
  updateMPSTermReport,
} from "@/app/features/mps-term/actions";
import { runFormRoute } from "@/utils/lib/formRoute";

// The form's hidden "id" input is empty when creating a report.
export async function POST(request) {
  return runFormRoute(
    request,
    (formData) =>
      formData.get("id")
        ? updateMPSTermReport(null, formData)
        : createMPSTermReport(null, formData),
    "mps-term",
  );
}
