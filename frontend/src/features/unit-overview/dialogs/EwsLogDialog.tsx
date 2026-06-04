// src/features/unit-overview/dialogs/EwsLogDialog.tsx
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import type { Inpatient } from "../types";
import { useClinicalParameters } from "../../../hooks/journal/useClinicalParameters";

type Props = {
  open: boolean;
  patient: Inpatient | null;
  onClose: () => void;
};

export default function EwsLogDialog({
  open,
  patient,
  onClose,
}: Props) {
  const { data = [], isLoading } =
    useClinicalParameters(patient?.encounterId);

  const rows = data.filter(
    (item: any) => item.name === "NEWS2"
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>EWS log</DialogTitle>

      <DialogContent>
        {patient && (
          <div className="mb-3 text-sm font-medium">
            {patient.name} ({patient.nationalId})
          </div>
        )}

        <div className="rounded border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Score</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={2} className="p-3">
                    Loading...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={2} className="p-3">
                    No values found
                  </td>
                </tr>
              ) : (
                rows.map((row: any) => (
                  <tr key={row.id} className="border-t">
                    <td className="p-2">
                      {new Date(
                        row.recordedAt
                      ).toLocaleString()}
                    </td>

                    <td className="p-2">
                      {row.value}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}