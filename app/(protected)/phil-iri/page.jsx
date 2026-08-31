import { getReports } from "../../features/reports/actions";
import ReportsClient from "../../features/reports/ReportsClient";
import { checkRole } from "../../../utils/lib/checkRole";
const page = async () => {
  const profile = await checkRole();

  const type = "phil-iri";

  const reports = await getReports(type);

  return (
    <ReportsClient profile={profile} title={type} reports={reports} type={type} />
  );
};

export default page;
