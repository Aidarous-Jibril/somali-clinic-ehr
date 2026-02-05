// src/components/patient-overview/ClinicalParametersWidget.tsx/**
import React, { useState } from "react";
import { IconButton, Popover, Tooltip } from "@mui/material";

import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import type {
  ClinicalParameter,
  ClinicalParameterName,
  ContextMenuPosition,
} from "../../features/patient-overview/types";

/* ========================================================
 * PROPS
 * ====================================================== */

type Props = {
  rows: ClinicalParameter[];
  onAddClick: () => void;
  onOpenLog: (name: ClinicalParameterName) => void;
  onRequestUpdate: (name: ClinicalParameterName) => void;
};

/* ========================================================
 * COMPONENT
 * ====================================================== */

export const ClinicalParametersWidget: React.FC<Props> = ({
  rows,
  onAddClick,
  onOpenLog,
  onRequestUpdate,
}) => {
  /* ----------------------------
   * Context menu state
   * -------------------------- */

  const [menuPosition, setMenuPosition] = useState<ContextMenuPosition | null>(
    null
  );
  const [selectedName, setSelectedName] =
    useState<ClinicalParameterName>("NEWS2");

  /* ----------------------------
   * Handlers
   * -------------------------- */

  const openContextMenu = (
    event: React.MouseEvent<HTMLTableRowElement>,
    name: ClinicalParameterName
  ) => {
    event.preventDefault();
    setSelectedName(name);
    setMenuPosition({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
    });
  };

  const closeContextMenu = () => setMenuPosition(null);

  /* ======================================================
   * RENDER
   * ====================================================== */

  return (
    <section className="rounded border border-gray-300 bg-white text-xs">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 px-3 py-2 text-[13px] font-semibold">
        <div className="flex items-center gap-2">
          <MonitorHeartIcon fontSize="small" />
          <span>Clinical parameters</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="rounded border border-gray-300 bg-gray-50 px-2 py-1 text-[11px] hover:bg-gray-100">
            My unit
          </button>

          <Tooltip title="Register clinical parameters">
            <IconButton
              size="small"
              sx={{ color: "#1d4ed8" }}
              onClick={onAddClick}
            >
              <AddCircleOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </header>

      {/* Table */}
      <div className="px-3 py-2">
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr className="text-gray-500">
              <th className="py-1 pr-2 text-left font-normal">Parameter</th>
              <th className="py-1 pr-2 text-left font-normal">Value</th>
              <th className="py-1 text-left font-normal">Date</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.name}
                className="cursor-pointer hover:bg-blue-50"
                onClick={() => onOpenLog(row.name)}
                onContextMenu={(e) => openContextMenu(e, row.name)}
              >
                <td className="py-1 pr-2 align-top">{row.name}</td>

                <td className="py-1 pr-2 align-top">
                  {row.alert ? (
                    <span className="inline-flex items-center rounded bg-yellow-100 px-2 py-[2px] font-semibold text-yellow-900">
                      {row.value}
                    </span>
                  ) : (
                    row.value
                  )}
                </td>

                <td className="py-1 align-top text-gray-600">
                  {row.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-2 text-[11px] text-gray-500">
          Click a row for log & trend. Right-click for actions.
        </p>
      </div>

      {/* Context menu */}
      <Popover
        open={Boolean(menuPosition)}
        onClose={closeContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          menuPosition
            ? { top: menuPosition.mouseY, left: menuPosition.mouseX }
            : undefined
        }
      >
        <div className="min-w-[260px] py-1 text-xs">
          <button
            className="block w-full px-3 py-2 text-left hover:bg-blue-50"
            onClick={() => {
              closeContextMenu();
              onAddClick();
            }}
          >
            Record clinical parameters
          </button>

          <button
            className="block w-full px-3 py-2 text-left hover:bg-blue-50"
            onClick={() => {
              closeContextMenu();
              onRequestUpdate(selectedName);
            }}
          >
            Update / delete parameter
          </button>

          <button
            className="block w-full px-3 py-2 text-left hover:bg-blue-50"
            onClick={() => {
              closeContextMenu();
              onOpenLog(selectedName);
            }}
          >
            Open log
          </button>
        </div>
      </Popover>
    </section>
  );
};
