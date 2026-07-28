//src/pages/DashboardPage.tsx

import { useAuth } from "../../context/AuthContext";
import DoctorDashboard from "./DoctorDashboard";
import LaboratoryDashboard from "./LaboratoryDashboard";
import NurseDashboard from "./NurseDashboard";
import RadiologyDashboard from "./RadiologyDashboard";


const DashboardPage = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case "Doctor":
      return <DoctorDashboard />;

    case "Nurse":
      return <NurseDashboard />;
      
    case "Lab":
      return <LaboratoryDashboard />;
    case "Radiology":
      return <RadiologyDashboard />;

    default:
      return (
        <div className="p-6">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p>No dashboard available for your role yet.</p>
        </div>
      );
  }
};

export default DashboardPage;