// src/components/dashboard/DashboardPatientList.tsx
import React from "react";

type Props = {
  patients: { patientId: string; patientName: string }[];
};

export const DashboardPatientList: React.FC<Props> = ({ patients }) => {
  return (
    <div className="px-3 py-3 text-sm">
      <p className="mb-2 text-gray-600">Quick shortcuts to patients you follow frequently.</p>
      <ul className="space-y-1 text-xs">
        {patients.map((p) => (
          <li key={p.patientId}>• {p.patientId} – {p.patientName}</li>
        ))}
      </ul>
    </div>
  );
};
