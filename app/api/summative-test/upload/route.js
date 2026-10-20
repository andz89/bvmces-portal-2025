import {
  createSummativeTest,
  updateSummativeTest,
} from "@/app/features/summative-test/actions";
import { runFormRoute } from "@/utils/lib/formRoute";

// Create when no id is sent, otherwise update that submission.
export async function POST(request) {
  return runFormRoute(
    request,
    (formData) => {
      const id = formData.get("id");

      return id
        ? updateSummativeTest(id, formData)
        : createSummativeTest(formData);
    },
    "summative-test",
  );
}
