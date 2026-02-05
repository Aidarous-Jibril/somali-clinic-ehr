// src/components/patient-overview/PatientBanner.tsx
import React from "react";
import { Button } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import { AttentionSignalWidget } from "./AttentionSignalWidget";


/* ================= PROPS ==================== */
type Patient = {
  id: string;
  name: string;
  age: number;
  unit: string;
};

type Props = {
  patient: Patient;
  onHomeCareClick: () => void;
};

/* ================= COMPONENT ==================== */
export const PatientBanner: React.FC<Props> = ({ patient, onHomeCareClick }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded bg-blue-700 px-4 py-3 text-sm text-white">
      <div className="flex items-center gap-3">
        {/* NEW: Attention signal icon */}
        <AttentionSignalWidget />

        <span className="font-semibold">
          {patient.id}, {patient.name}, {patient.age} år
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1">
          <PlaceIcon fontSize="small" />
          <span>{patient.unit}</span>
        </div>
        <div className="flex items-center gap-1">
          <WarningAmberIcon fontSize="small" />
          <span>Warnings</span>
        </div>
        <div className="flex items-center gap-1">
          <PersonIcon fontSize="small" />
          <span>Responsible caregiver</span>
        </div>

        <Button
          variant="outlined"
          size="small"
          onClick={onHomeCareClick}
          sx={{
            borderColor: "white",
            color: "white",
            "&:hover": { borderColor: "white", backgroundColor: "#1d4ed8" },
          }}
          startIcon={<HomeIcon fontSize="small" />}
        >
          Home care
        </Button>
      </div>
    </div>
  );
};
