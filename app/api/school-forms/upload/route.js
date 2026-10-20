import {
  createSchoolForm,
  updateSchoolForm,
} from "@/app/features/school-forms/actions";
import { runFormRoute } from "@/utils/lib/formRoute";

// Create when no id is sent, otherwise replace that submission.
export async function POST(request) {
  return runFormRoute(
    request,
    (formData) => {
      const id = formData.get("id");

      return id
        ? updateSchoolForm(id, formData.get("sf"), formData)
        : createSchoolForm(formData);
    },
    "school-forms",
  );
}
