import SummativeTestClient from "../../features/summative-test/SummativeTestClient";
import { getSummativeTests } from "../../features/summative-test/actions";
import { checkRole } from "../../../utils/lib/checkRole";
import RefreshError from "../lesson-plan/RefreshError";
import { redirect } from "next/navigation";

const page = async () => {
  const profile = await checkRole();

  if (!profile) {
    redirect("/login");
  }

  let records = [];

  try {
    records = await getSummativeTests();
  } catch (err) {
    console.error(err);

    return (
      <RefreshError
        message={
          err instanceof Error
            ? err.message
            : "Unable to load submissions. Please refresh the page."
        }
      />
    );
  }

  return <SummativeTestClient profile={profile} records={records} />;
};

export default page;
