import { getReports } from "../../features/reports/actions";
import ReportsClient from "../../features/reports/ReportsClient";
import { checkRole } from "../../../utils/lib/checkRole";
const page = async () => {
  const profile = await checkRole();
  const type = "CRLA";
  const reports = await getReports(type);

  return (
    <ReportsClient
      title={type}
      reports={reports.data}
      type={type}
      profile={profile}
    />
  );
};

export default page;
