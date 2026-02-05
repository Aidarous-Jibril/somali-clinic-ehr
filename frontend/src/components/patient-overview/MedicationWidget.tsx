// src/components/patient-overview/MedicationWidget.tsx
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import {
  MOCK_MEDICATION_SECTIONS,
  MOCK_VACCINATION_SECTIONS,
} from "../../features/patient-overview/mockData";

/* ========================================================
 * TYPES
 * ====================================================== */

type ViewMode = "medications" | "vaccinations";

/* ========================================================
 * HELPERS
 * ====================================================== */

// Initialize which sections are expanded by default
const buildInitialExpandedState = (): Record<string, boolean> => {
  const expanded: Record<string, boolean> = {};

  [...MOCK_MEDICATION_SECTIONS, ...MOCK_VACCINATION_SECTIONS].forEach(
    (section) => {
      expanded[section.id] =
        section.id === "currentMeds" || section.id === "currentVacc";
    }
  );

  return expanded;
};

const countItems = (sections: { items: unknown[] }[]) =>
  sections.reduce((sum, s) => sum + s.items.length, 0);

/* ========================================================
 * COMPONENT
 * ====================================================== */

export const MedicationWidget: React.FC = () => {
  // View state (medications vs vaccinations)
  const [viewMode, setViewMode] = useState<ViewMode>("medications");

  // 3-dot menu state
  const [menuOpen, setMenuOpen] = useState(false);

  // Section expansion state
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    buildInitialExpandedState
  );

  /* ----------------------------------------------------
   * Derived data
   * -------------------------------------------------- */

  const activeSections =
    viewMode === "medications"
      ? MOCK_MEDICATION_SECTIONS
      : MOCK_VACCINATION_SECTIONS;

  const medicationCount = countItems(MOCK_MEDICATION_SECTIONS);
  const vaccinationCount = countItems(MOCK_VACCINATION_SECTIONS);

  /* ----------------------------------------------------
   * Handlers
   * -------------------------------------------------- */

  const toggleSection = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  /* ----------------------------------------------------
   * Render
   * -------------------------------------------------- */

  return (
    <div className="rounded border border-gray-200 bg-white text-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
        <h2 className="text-base font-semibold">
          {viewMode === "medications" ? "Medication" : "Vaccines"}
        </h2>

        <div className="flex items-center gap-2">
          {/* Approval badge (mocked) */}
          <span className="rounded-full bg-green-600 px-3 py-0.5 text-xs font-semibold text-white">
            Approved
          </span>

          {/* View selector (3-dot menu) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
            >
              <MoreVertIcon fontSize="small" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded border border-gray-200 bg-white text-xs shadow-lg"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => {
                    setViewMode("medications");
                    setMenuOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left hover:bg-gray-50 ${
                    viewMode === "medications" ? "font-semibold" : ""
                  }`}
                >
                  <span>Medication</span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px]">
                    {medicationCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setViewMode("vaccinations");
                    setMenuOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left hover:bg-gray-50 ${
                    viewMode === "vaccinations" ? "font-semibold" : ""
                  }`}
                >
                  <span>Vaccines</span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px]">
                    {vaccinationCount}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-12 border-b border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-600">
        <div className="col-span-6">Product</div>
        <div className="col-span-3">Strength</div>
        <div className="col-span-3">Dose</div>
      </div>

      {/* Sections */}
      {activeSections.map((section) => {
        const isOpen = expanded[section.id];

        return (
          <div key={section.id}>
            {/* Section header */}
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className="flex w-full items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2 text-left text-[11px] font-semibold hover:bg-gray-100"
            >
              <span>
                {section.title} ({section.items.length})
              </span>

              <span
                className={
                  "inline-block leading-none text-gray-700 transition-transform " +
                  (isOpen ? "rotate-90" : "")
                }
                aria-hidden="true"
              >
                ▶
              </span>
            </button>

            {/* Section items */}
            {isOpen &&
              section.items.map((item, index) => (
                <div
                  key={item.id}
                  className={`grid grid-cols-12 px-3 py-1.5 text-xs ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <div className="col-span-6 pr-2">
                    <span
                      className="cursor-help border-b border-dotted border-gray-400"
                      title={item.info || ""}
                    >
                      {item.product}
                    </span>
                  </div>
                  <div className="col-span-3 pr-2">{item.strength}</div>
                  <div className="col-span-3">{item.dose}</div>
                </div>
              ))}

            {/* Empty state */}
            {isOpen && section.items.length === 0 && (
              <div className="px-3 py-2 text-[11px] text-gray-500">
                No items in this category.
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MedicationWidget;
