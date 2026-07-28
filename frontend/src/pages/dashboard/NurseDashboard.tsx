import { useNavigate } from "react-router-dom";
import { useNurseDashboard } from "../../hooks/nurse/useNurseDashboard";
import DashboardCard from "../../components/doctor/DoctorCard";

const NurseDashboard = () => {
  const navigate = useNavigate();

  const {
    assignedPatients,
    medicationDue,
    vitalsOverdue,
    fluidAlerts,
    pendingReferrals,
    wardOccupancy,
    isLoading,
  } = useNurseDashboard();
console.log("medicationDue:", medicationDue)
  if (isLoading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold">
          Nurse Dashboard
        </h1>

        <p className="text-sm text-gray-600">
          Live ward overview and patient care tasks.
        </p>
      </div>

      {/* Dashboard widgets */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* Assigned Patients */}
        <DashboardCard
          title="Assigned Patients"
          value={assignedPatients.length}
          severity="normal"
          onClick={() =>
            navigate("/patients?scope=assigned")
          }
        />

        {/* Medication Due */}
        <DashboardCard
          title="Medication Due"
          value={medicationDue.length}
          severity={
            medicationDue.length > 3
              ? "danger"
              : medicationDue.length > 0
              ? "warning"
              : "normal"
          }
          badge={
            medicationDue.length > 3
              ? "Urgent"
              : medicationDue.length > 0
              ? "Due"
              : undefined
          }
          onClick={() =>
            navigate("/patients?scope=medication-due")
          }
        />

        {/* Vitals Overdue */}
        <DashboardCard
          title="Vitals Overdue"
          value={vitalsOverdue.length}
          severity={
            vitalsOverdue.length > 2
              ? "danger"
              : vitalsOverdue.length > 0
              ? "warning"
              : "normal"
          }
          badge={
            vitalsOverdue.length > 0
              ? "Review"
              : undefined
          }
          onClick={() =>
            navigate("/patients?scope=vitals-overdue")
          }
        />

        {/* Fluid Alerts */}
        <DashboardCard
          title="Fluid Alerts"
          value={fluidAlerts.length}
          severity={
            fluidAlerts.length > 0
              ? "warning"
              : "normal"
          }
          badge={
            fluidAlerts.length > 0
              ? "Monitor"
              : undefined
          }
          onClick={() =>
            navigate("/patients?scope=fluid-alerts")
          }
        />

        {/* Pending Referrals */}
        <DashboardCard
          title="Pending Referrals"
          value={pendingReferrals.length}
          severity={
            pendingReferrals.some((r: any) => r.urgent)
              ? "danger"
              : pendingReferrals.length > 0
              ? "warning"
              : "normal"
          }
          badge={
            pendingReferrals.some((r: any) => r.urgent)
              ? "Urgent"
              : pendingReferrals.length > 0
              ? "Pending"
              : undefined
          }
          onClick={() =>
            navigate("/patients?scope=pending-referrals")
          }
        />

        {/* Ward Occupancy */}
        <DashboardCard
          title="Ward Occupancy"
          value={
            wardOccupancy
              ? `${wardOccupancy.occupiedBeds}/${wardOccupancy.totalBeds}`
              : "-"
          }
          severity={
            wardOccupancy?.occupancyRate >= 90
              ? "danger"
              : wardOccupancy?.occupancyRate >= 75
              ? "warning"
              : "normal"
          }
          badge={
            wardOccupancy?.occupancyRate >= 90
              ? "Full"
              : wardOccupancy?.occupancyRate >= 75
              ? "Busy"
              : undefined
          }
          onClick={() => navigate("/unit-overview")}
        />
      </div>
    </div>
  );
};

export default NurseDashboard;