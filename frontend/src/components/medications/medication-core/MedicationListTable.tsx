// src/components/medications/medication-core/MedicationListTable.tsx

import React, { useMemo, useState } from "react";
import {
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import type {
  MedicationGroup,
  PresentationMode,
  PrnAction,
} from "../../../features/medications/types";

/* ============================================================================
 * Types
 * ========================================================================== */

interface MedicationListTableProps {
  groups: MedicationGroup[];
  presentation: PresentationMode;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onPrnCreateDose: (
    medId: string,
    action: PrnAction,
    doseLabel?: string,
    comment?: string
  ) => void;
}

/* ============================================================================
 * Component
 * ========================================================================== */

export function MedicationListTable({
  groups,
  presentation,
  selectedId,
  onSelect,
  onPrnCreateDose,
}: MedicationListTableProps) {
  /* ------------------------------------------------------------------------
   * Derived state
   * ---------------------------------------------------------------------- */

  const prnIds = useMemo(() => {
    const ids = new Set<string>();
    groups.forEach((g) =>
      g.items.forEach((m) => {
        if (m.group === "prn") ids.add(m.id);
      })
    );
    return ids;
  }, [groups]);

  /* ------------------------------------------------------------------------
   * Local state
   * ---------------------------------------------------------------------- */

  const [menuState, setMenuState] = useState<{
    open: boolean;
    x: number;
    y: number;
    medId: string | null;
  }>({
    open: false,
    x: 0,
    y: 0,
    medId: null,
  });

  const [dialog, setDialog] = useState<{
    open: boolean;
    action: PrnAction | null;
    medId: string | null;
  }>({
    open: false,
    action: null,
    medId: null,
  });

  const [doseLabel, setDoseLabel] = useState("");
  const [comment, setComment] = useState("");

  /* ------------------------------------------------------------------------
   * Handlers
   * ---------------------------------------------------------------------- */

  function openPrnMenu(e: React.MouseEvent, medId: string) {
    e.preventDefault();
    setMenuState({ open: true, x: e.clientX, y: e.clientY, medId });
  }

  function closeMenu() {
    setMenuState((s) => ({ ...s, open: false }));
  }

  function openDialog(action: PrnAction) {
    if (!menuState.medId) return;
    closeMenu();
    setDoseLabel("");
    setComment("");
    setDialog({ open: true, action, medId: menuState.medId });
  }

  function saveDialog() {
    if (!dialog.medId || !dialog.action) return;

    if (
      (dialog.action === "administer" ||
        dialog.action === "selfAdmin") &&
      !doseLabel.trim()
    ) {
      return;
    }

    onPrnCreateDose(dialog.medId, dialog.action, doseLabel, comment);
    setDialog({ open: false, action: null, medId: null });
  }

  const dialogTitle =
    dialog.action === "add"
      ? "Add PRN dose"
      : dialog.action === "prepare"
      ? "Prepare PRN dose"
      : dialog.action === "selfAdmin"
      ? "Self-administer PRN dose"
      : "Administer PRN dose";

  /* ------------------------------------------------------------------------
   * Render
   * ---------------------------------------------------------------------- */

  return (
    <div className="h-full overflow-auto border-r border-gray-200">
      {/* TABLE */}
      <table className="w-full border-collapse text-[11px]">
        <thead className="sticky top-0 z-10 bg-gray-50">
          <tr className="text-gray-600">
            <th className="w-7 px-2 py-1" />
            <th className="px-2 py-1 text-left">Medication</th>
            <th className="px-2 py-1 text-left">Dosing</th>
            <th className="w-10 px-2 py-1">Σ</th>
            <th className="w-10 px-2 py-1" />
            <th className="w-28 px-2 py-1 text-left">Start</th>
          </tr>
        </thead>

        <tbody>
          {groups.map((group) => (
            <React.Fragment key={group.key}>
              <tr className="bg-gray-100">
                <td colSpan={6} className="px-2 py-1 font-semibold">
                  {group.title} [{group.items.length}]
                </td>
              </tr>

              {group.items.map((med) => {
                const isSelected = med.id === selectedId;
                const isPrn = prnIds.has(med.id);

                return (
                  <tr
                    key={med.id}
                    className={`cursor-pointer border-b border-gray-100 ${
                      isSelected ? "bg-blue-50" : "hover:bg-blue-50"
                    }`}
                    onClick={() => onSelect(med.id)}
                    onContextMenu={
                      isPrn ? (e) => openPrnMenu(e, med.id) : undefined
                    }
                  >
                    <td className="px-2 py-1">
                      <input type="checkbox" />
                    </td>

                    <td className="px-2 py-1">
                      <Tooltip title={med.tooltip} arrow>
                        <div className="font-medium text-gray-900">
                          {med.name}
                          {presentation === "large" && med.strength
                            ? `, ${med.strength}`
                            : ""}
                          {isPrn && (
                            <span className="ml-2 text-[10px] text-gray-500">
                              (PRN)
                            </span>
                          )}
                        </div>
                      </Tooltip>
                    </td>

                    <td className="px-2 py-1">{med.dosingText}</td>
                    <td className="px-2 py-1 text-gray-400" />

                    <td className="px-2 py-1">
                      <Tooltip title={med.tooltip} arrow>
                        <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                      </Tooltip>
                    </td>

                    <td className="px-2 py-1 text-gray-600">
                      {med.startDate || "—"}
                    </td>
                  </tr>
                );
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* PRN MENU */}
      <Menu
        open={menuState.open}
        onClose={closeMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          menuState.open
            ? { top: menuState.y, left: menuState.x }
            : undefined
        }
      >
        <MenuItem onClick={() => openDialog("add")}>Add new dose…</MenuItem>
        <MenuItem onClick={() => openDialog("prepare")}>
          Prepare new dose…
        </MenuItem>
        <MenuItem onClick={() => openDialog("administer")}>
          Administer new dose…
        </MenuItem>
        <MenuItem onClick={() => openDialog("selfAdmin")}>
          Self-administer new dose…
        </MenuItem>
      </Menu>

      {/* PRN DIALOG */}
      <Dialog open={dialog.open} onClose={() => setDialog({ open: false, action: null, medId: null })} maxWidth="sm" fullWidth>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent dividers>
          <TextField
            label={dialog.action === "administer" || dialog.action === "selfAdmin"
              ? "Administered dose (required)"
              : "Dose label (optional)"}
            size="small"
            value={doseLabel}
            onChange={(e) => setDoseLabel(e.target.value)}
            fullWidth
          />
          <TextField
            label="Comment (optional)"
            size="small"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            multiline
            minRows={3}
            fullWidth
            className="mt-3"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ open: false, action: null, medId: null })}>
            Cancel
          </Button>
          <Button variant="contained" onClick={saveDialog}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
