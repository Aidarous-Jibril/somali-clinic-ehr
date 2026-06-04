// src/components/patient-overview/PatientBanner.tsx
import React from "react";
import { Button } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import { AttentionSignalWidget } from "./AttentionSignalWidget";
import type { Patient } from "../../features/patient/types";

/* ================= PROPS ==================== */
type Props = {
  patient: Patient;
  onHomeCareClick: () => void;
};

// We calculate it from DOB.
const calculateAge = (dateOfBirth: string) => {
  const dob = new Date(dateOfBirth);
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};


/* ================= COMPONENT ==================== */
export const PatientBanner: React.FC<Props> = ({ patient, onHomeCareClick }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded bg-blue-700 px-4 py-3 text-sm text-white">
      <div className="flex items-center gap-3">
        {/* NEW: Attention signal icon */}
        <AttentionSignalWidget />

        <span className="font-semibold">
          {patient.firstName} {patient.lastName}, {calculateAge(patient.dateOfBirth)} år
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1">
          <PlaceIcon fontSize="small" />
          <span>{patient.unit ?? patient.clinic?.name ?? "No unit assigned"}</span>
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
