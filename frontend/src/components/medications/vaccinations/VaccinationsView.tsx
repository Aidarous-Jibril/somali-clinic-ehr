// src/components/medications/vaccinations/VaccinationsView.tsx

import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";

import { useVaccinations } from "../../../hooks/vaccination/useVaccinations";
import type { VaccinationRecord } from "../../../features/medications/types";

import { RegisterVaccinationDialog } from "./RegisterVaccinationDialog";
import { VaccinationsTable } from "./VaccinationsTable";
import { VaccinationsTimeline } from "./VaccinationsTimeline";

export function VaccinationsView() {
  const { patientId = "" } = useParams<{ patientId: string }>();

  const { data: vaccinationsData, isLoading,} = useVaccinations(patientId);

  const vaccinations: VaccinationRecord[] = vaccinationsData ?? [];

  /* --------------------------------------------------------------------------
   * Local state
   * ------------------------------------------------------------------------ */
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  /* --------------------------------------------------------------------------
   * Derived state
   * ------------------------------------------------------------------------ */
  const selectedVaccination = vaccinations.find((v) => v.id === selectedId) ?? null;

  if (isLoading) {
    return <div className="rounded border border-gray-300 bg-white p-6 text-sm text-gray-500">Loading vaccinations...</div>;
  }
  
  /* --------------------------------------------------------------------------
   * Render
   * ------------------------------------------------------------------------ */
  return (
    <>
      <div className="grid h-full grid-cols-12 gap-3">
        {/* ------------------------------------------------------------------
         * LEFT PANEL
         * ---------------------------------------------------------------- */}
        <div className="col-span-5 rounded border border-gray-300 bg-white">
          {/* Header */}
          <div className="flex items-center justify-end border-b border-gray-200 p-2">
            <Button
              variant="outlined"
              size="small"
              onClick={() => setDialogOpen(true)}
            >
              Register...
            </Button>
          </div>

          {/* Table */}
          <div className="h-[500px] overflow-auto">
            <VaccinationsTable
              vaccinations={vaccinations}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
        </div>

        {/* ------------------------------------------------------------------
         * RIGHT PANEL
         * ---------------------------------------------------------------- */}
        <div className="col-span-7 rounded border border-gray-300 bg-white">
          <VaccinationsTimeline
            vaccinations={vaccinations}
            selectedVaccination={selectedVaccination}
          />
        </div>
      </div>

      {/* --------------------------------------------------------------------
       * REGISTER DIALOG
       * ------------------------------------------------------------------ */}
      <RegisterVaccinationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        patientId={patientId}
      />
    </>
  );
}