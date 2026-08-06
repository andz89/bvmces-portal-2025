import { getReports } from "../../features/reports/actions";
import ReportsClient from "../../features/reports/ReportsClient";
import { checkRole } from "../../../utils/lib/checkRole";
import { getGoogleConfig } from "../../features/reports/actions";
const page = async () => {
  const profile = await checkRole();

  const type = "phil-iri";

  const { data: googleConfig, error: configError } =
    await getGoogleConfig(type);

  if (configError) {
    return { error: configError };
  }

  const reports = await getReports(googleConfig);
  return (
    <ReportsClient
      googleConfig={googleConfig}
      profile={profile}
      title={type}
      reports={reports}
      type={type}
    />
  );
};

export default page;
