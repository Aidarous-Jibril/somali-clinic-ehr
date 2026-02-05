// src/components/dashboard/PatientQuickActionsMenu.tsx
import React from "react";

type Props = {
  open: boolean;
  anchor: { mouseX: number; mouseY: number } | null;
  onClose: () => void;

  onOpenPatientOverview: () => void;
  onOpenAnalysis: () => void;
  onOpenJournal: () => void;
  onOpenSchedule: () => void;
  onOpenVisitList: () => void;
};

export const PatientQuickActionsMenu: React.FC<Props> = ({
  open,
  anchor,
  onClose,
  onOpenPatientOverview,
  onOpenAnalysis,
  onOpenJournal,
  onOpenSchedule,
  onOpenVisitList,
}) => {
  if (!open || !anchor) return null;

  return (
    <div
      className="fixed z-50 w-64 rounded border border-gray-300 bg-white text-xs shadow-md"
      style={{ top: anchor.mouseY, left: anchor.mouseX }}
      onClick={(e) => e.stopPropagation()}
    >
      <button className="block w-full px-3 py-2 text-left hover:bg-blue-50" onClick={() => { onOpenPatientOverview(); onClose(); }}>
        Open patient overview
      </button>
      <button className="block w-full px-3 py-2 text-left hover:bg-blue-50" onClick={() => { onOpenAnalysis(); onClose(); }}>
        Analysis
      </button>
      <button className="block w-full px-3 py-2 text-left hover:bg-blue-50" onClick={() => { onOpenJournal(); onClose(); }}>
        Journal
      </button>
      <button className="block w-full px-3 py-2 text-left hover:bg-blue-50" onClick={() => { onOpenSchedule(); onClose(); }}>
        Schedule (Tidbok)
      </button>
      <button className="block w-full px-3 py-2 text-left hover:bg-blue-50" onClick={() => { onOpenVisitList(); onClose(); }}>
        Visit list (Besökslista)
      </button>
    </div>
  );
};
