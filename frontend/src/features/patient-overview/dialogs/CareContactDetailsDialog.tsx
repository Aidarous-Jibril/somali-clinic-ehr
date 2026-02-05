// src/components/patient-overview/dialogs/CareContactDetailsDialog.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import type { CareContactEntry } from "../../../features/patient-overview/types";

type Props = {
  open: boolean;
  dateLabel: string; // e.g. "tis 21 sep. 2021"
  entries: CareContactEntry[];
  onClose: () => void;
};

export const CareContactDetailsDialog: React.FC<Props> = ({
  open,
  dateLabel,
  entries,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <span>{dateLabel}</span>
        <IconButton onClick={onClose} aria-label="Close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <div className="rounded border border-gray-200">
          <table className="w-full border-collapse text-[12px]">
            <thead className="bg-gray-50">
              <tr className="text-gray-600">
                <th className="border-b border-gray-200 px-3 py-2 text-left font-medium">
                  TYP
                </th>
                <th className="border-b border-gray-200 px-3 py-2 text-left font-medium">
                  ENHET
                </th>
                <th className="border-b border-gray-200 px-3 py-2 text-left font-medium">
                  ANSVARIG PERSONAL
                </th>
                <th className="border-b border-gray-200 px-3 py-2 text-left font-medium">
                  ROLL
                </th>
              </tr>
            </thead>

            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-3 text-gray-500">
                    Inga kontakter för denna dag.
                  </td>
                </tr>
              ) : (
                entries.map((e, idx) => (
                  <tr
                    key={e.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border-b border-gray-100 px-3 py-2">
                      {e.visitType}
                    </td>
                    <td className="border-b border-gray-100 px-3 py-2">
                      {e.unit}
                    </td>
                    <td className="border-b border-gray-100 px-3 py-2">
                      {e.responsible}
                    </td>
                    <td className="border-b border-gray-100 px-3 py-2">
                      {e.role}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};
