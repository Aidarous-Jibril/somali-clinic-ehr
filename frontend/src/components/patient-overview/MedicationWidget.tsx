// src/components/patient-overview/MedicationWidget.tsx
import { useEffect, useMemo, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { buildMedicationSections } from "../../features/patient-overview/mappers/medication.mapper";
import { buildVaccinationSections } from "../../features/patient-overview/mappers/vaccination.mapper";

import { useCompleteVaccination, useDeclineVaccination } from "../../hooks/vaccination/useUpdateVaccination";
import { usePauseMedication } from "../../hooks/medications/usePauseMedication";
import { useStopMedication } from "../../hooks/medications/useStopMedication";
import { useResumeMedication } from "../../hooks/medications/useResumeMedication";

import { formatDateTime } from "../../utils/dateFormat";
import { AddTreatmentDialog } from "../../features/patient-overview/dialogs/AddTreatmentDialog";
import { formatMedicationDose } from "../../features/patient-overview/helpers";
import { AddButton } from "./common/AddButton";
import { useNavigate } from "react-router-dom";

/* ========= TYPES ========= */
type ViewMode = "medications" | "vaccinations";

type Props = {
  medications: any[];
  vaccinations: any[];
  patientId: string;
  clinicId: string;
  encounterId?: string;
};

/* ========= HELPERS ========= */
const countItems = (sections: { items: unknown[] }[]) =>
  sections.reduce((sum, s) => sum + s.items.length, 0);

const buildInitialExpandedState = (sections: any[]) => {
  const expanded: Record<string, boolean> = {};
  sections.forEach((section) => {
    expanded[section.id] =
      section.id === "currentMeds" || section.id === "currentVacc";
  });
  return expanded;
};

/* ========= COMPONENT ========= */
export const MedicationWidget: React.FC<Props> = ({
  medications,
  vaccinations,
  patientId,
  clinicId,
  encounterId,
}) => {
  const navigate = useNavigate();
  /* ===== Mutations ===== */
  const declineVaccination = useDeclineVaccination();
  const completeVaccination = useCompleteVaccination();

  const pauseMedication = usePauseMedication(patientId);
  const stopMedication = useStopMedication(patientId);
  const resumeMedication = useResumeMedication(patientId);

  /* ===== State ===== */
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return ( (localStorage.getItem("patient-overview-view-mode") as ViewMode) || "medications" );
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  /* ===== Sections ===== */
  const medicationSections = useMemo(
    () => buildMedicationSections(medications),
    [medications]
  );

  const vaccinationSections = useMemo(
    () => buildVaccinationSections(vaccinations),
    [vaccinations]
  );

  const activeSections =
    viewMode === "medications" ? medicationSections : vaccinationSections;

  /* ===== Expansion ===== */
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    buildInitialExpandedState(activeSections)
  );

  useEffect(() => {
    setExpanded(buildInitialExpandedState(activeSections));
  }, [activeSections]);

  /* ===== Counts ===== */
  const medicationCount = countItems(medicationSections);
  const vaccinationCount = countItems(vaccinationSections);

  /* ===== Handlers ===== */
  const toggleSection = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const switchView = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem("patient-overview-view-mode", mode);
    setMenuOpen(false);
  };

  /* ===== RENDER ===== */
  return (
    <div className="rounded border border-gray-200 bg-white text-sm">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
        {/* <h2 className="text-base font-semibold">
          {viewMode === "medications" ? "Medication" : "Vaccines"}
        </h2> */}
<h2
  className="cursor-pointer text-base font-semibold text-blue-600 hover:underline"
  onClick={() =>
    viewMode === "medications" &&
    navigate(`/patients/${patientId}/medications`)
  }
>
  {viewMode === "medications" ? "Medication" : "Vaccines"}
</h2>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-green-600 px-3 py-0.5 text-xs font-semibold text-white"> Approved</span>

          {/* Add */}
          <AddButton
            onClick={() => setOpenDialog(true)}
            title={viewMode === "medications" ? "New medication" : "New vaccination"}
          />

          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
            >
              <MoreVertIcon fontSize="small" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 z-20 mt-1 w-40 rounded border bg-white text-xs shadow-lg"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button
                  onClick={() => switchView("medications")}
                  className={`flex w-full justify-between px-3 py-2 hover:bg-gray-50 ${
                    viewMode === "medications" ? "font-semibold" : ""
                  }`}
                >
                  Medication
                  <span>{medicationCount}</span>
                </button>

                <button
                  onClick={() => switchView("vaccinations")}
                  className={`flex w-full justify-between px-3 py-2 hover:bg-gray-50 ${
                    viewMode === "vaccinations" ? "font-semibold" : ""
                  }`}
                >
                  Vaccines
                  <span>{vaccinationCount}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== TABLE HEADER ===== */}
      <div className="grid grid-cols-12 border-b bg-gray-50 px-3 py-1.5 text-[11px] font-semibold uppercase text-gray-600">
        <div className="col-span-6">Product</div> 
        <div className="col-span-3"> {viewMode === "medications" ? "Strength" : "Manufacturer"}</div>
        <div className="col-span-3">Dose</div>
      </div>

      {/* ===== SECTIONS ===== */}
      {activeSections.map((section: any) => {
        const isOpen = expanded[section.id];

        return (
          <div key={section.id}>
            {/* Section header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="flex w-full justify-between border-b bg-gray-50 px-3 py-2 text-[11px] font-semibold hover:bg-gray-100"
            >
              {section.title} ({section.items.length})
              <span className={isOpen ? "rotate-90" : ""}>▶</span>
            </button>

            {/* Items */}
            {isOpen &&
              section.items.map((item: any, index: number) => (
                <div
                  key={item.id}
                  className={`grid grid-cols-12 px-3 py-1.5 text-xs ${
                    index % 2 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  {/* Name */}
                  <div className="col-span-6">{item.name}</div>

                  {/* Strength */}
                  <div className="col-span-3">{viewMode === "medications" ? item.strength : item.manufacturer}</div>
                  {/* Dose + Actions */}
                  <div className="col-span-3 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span>
                        {viewMode === "medications" ? formatMedicationDose(item) : item.dose}
                        {viewMode === "vaccinations" && item.administeredAt && (
                          <span className="text-[10px] text-gray-500"> {formatDateTime(item.administeredAt)}</span>)}
                      </span>

                      {/*  Dates */}
                      {viewMode === "medications" && item.startDate && (
                        <span className="text-[10px] text-gray-500"> Started: {formatDateTime(item.startDate)}</span>
                      )}

                      {viewMode === "medications" &&
                        item.status === "ended" &&
                        item.endDate && (
                          <span className="text-[10px] text-gray-500">
                            Ended: {formatDateTime(item.endDate)}
                          </span>
                        )}
                      </div>

                    {/* ===== ACTIONS ===== */}
                    <div className="flex gap-1">
                      {/* Vaccinations */}
                      {viewMode === "vaccinations" &&
                        item.status === "active" && (
                          <>
                            <button
                              onClick={() =>
                                completeVaccination.mutate(item.id)
                              }
                              className="text-green-600"
                              title="Complete"
                            >
                              ✔
                            </button>

                            <button
                              onClick={() =>
                                declineVaccination.mutate(item.id)
                              }
                              className="text-red-600"
                              title="Decline"
                            >
                              ✖
                            </button>
                          </>
                        )}

                      {/* Medications */}
                      {viewMode === "medications" && (
                        <>
                          {item.status === "active" && (
                            <>
                              <button
                                onClick={() =>
                                  pauseMedication.mutate(item.id)
                                }
                                className="text-yellow-600"
                                title="Pause"
                              >
                                ⏸
                              </button>

                              <button
                                onClick={() =>
                                  stopMedication.mutate(item.id)
                                }
                                className="text-red-600"
                                title="End"
                              >
                                ⛔
                              </button>
                            </>
                          )}

                          {item.status === "paused" && (
                            <>
                              <button
                                onClick={() =>
                                  resumeMedication.mutate(item.id)
                                }
                                className="text-green-600"
                                title="Resume"
                              >
                                ▶
                              </button>

                              <button
                                onClick={() =>
                                  stopMedication.mutate(item.id)
                                }
                                className="text-red-600"
                                title="End"
                              >
                                ⛔
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}

            {/* Empty */}
            {isOpen && section.items.length === 0 && (
              <div className="px-3 py-2 text-xs text-gray-500">
                No items in this category.
              </div>
            )}
          </div>
        );
      })}

      {/* ===== DIALOG ===== */}
      <AddTreatmentDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        type={viewMode}
        patientId={patientId}
        clinicId={clinicId}
        encounterId={encounterId}
      />
    </div>
  );
};

export default MedicationWidget;