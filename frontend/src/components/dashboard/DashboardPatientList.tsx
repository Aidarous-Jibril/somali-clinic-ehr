// src/components/dashboard/DashboardPatientList.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import type { DashboardPatientItem } from "../../features/dashboard/types";

type Props = {
  patients: DashboardPatientItem[];
};

export const DashboardPatientList: React.FC<Props> = ({ patients }) => {
  const navigate = useNavigate();

  return (
    <div className="px-3 py-3 text-sm">
      <p className="mb-2 text-gray-600">
        Quick shortcuts to patients you follow frequently.
      </p>

      <ul className="space-y-1 text-xs">
        {patients.map((p) => (
          <li
            key={p.patientId}
            className="cursor-pointer hover:underline"
            onClick={() => navigate(`/patients/${p.patientId}`)}
          >
            • {p.nationalId || p.patientId} – {p.patientName}
          </li>
        ))}
      </ul>
    </div>
  );
};