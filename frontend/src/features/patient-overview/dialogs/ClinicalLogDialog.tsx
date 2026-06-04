// src/components/patient-overview/dialogs/ClinicalLogDialog.tsx
import React, { useMemo } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { ClinicalLogEntry, ClinicalParameterName } from "../../../features/patient-overview/types";

function MiniLineChart({ points, width = 640, height = 220, }: {
  points: { xLabel: string; y: number }[];
  width?: number;
  height?: number;
}) {
  const padding = 28;
  const w = width - padding * 2;
  const h = height - padding * 2;

  const ys = points.map((p) => p.y);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const span = Math.max(1, maxY - minY);

  const xFor = (i: number) =>
    padding + (points.length === 1 ? w / 2 : (i / (points.length - 1)) * w);
  const yFor = (y: number) => padding + (1 - (y - minY) / span) * h;

  const d = points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${xFor(i).toFixed(1)} ${yFor(p.y).toFixed(1)}`
    )
    .join(" ");

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Trend chart">
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke="#e5e7eb"
      />
      <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e5e7eb" />

      <path d={d} fill="none" stroke="#2563eb" strokeWidth={2} />
      {points.map((p, i) => (
        <circle key={p.xLabel + i} cx={xFor(i)} cy={yFor(p.y)} r={4} fill="#2563eb" />
      ))}

      <text x={padding} y={padding - 8} fontSize="11" fill="#6b7280">
        {maxY}
      </text>
      <text x={padding} y={height - padding + 18} fontSize="11" fill="#6b7280">
        {minY}
      </text>
    </svg>
  );
}

type Props = {
  open: boolean;
  name: ClinicalParameterName;
  entries: ClinicalLogEntry[];
  isNews2Alert: (rawValue: string) => boolean;
  onClose: () => void;
  onUpdateClick: () => void;
};

export const ClinicalLogDialog: React.FC<Props> = ({
  open,
  name,
  entries,
  isNews2Alert,
  onClose,
  onUpdateClick,
}) => {
  const numericSeries = useMemo(() => {
    return entries
      .map((x) => {
        const n = Number(String(x.value).replace(",", "."));
        return { x, n, ok: !Number.isNaN(n) };
      })
      .filter((p) => p.ok)
      .map((p) => ({ xLabel: p.x.dateTime, y: p.n }));
  }, [entries]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
        <span>{name}</span>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <div className="space-y-4">
          {numericSeries.length >= 1 ? (
            <div className="rounded border border-gray-200 bg-white p-2">
              <MiniLineChart points={numericSeries} />
            </div>
          ) : (
            <div className="rounded border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
              No numeric values available for graph. Showing log only.
            </div>
          )}

          <div className="rounded border border-gray-200">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-50">
                <tr className="text-gray-600">
                  <th className="border-b border-gray-200 px-3 py-2 text-left font-medium">Date / time</th>
                  <th className="border-b border-gray-200 px-3 py-2 text-left font-medium">Value</th>
                  <th className="border-b border-gray-200 px-3 py-2 text-left font-medium">Entered by</th>
                  <th className="border-b border-gray-200 px-3 py-2 text-left font-medium">Note</th>
                </tr>
              </thead>

              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td className="px-3 py-3 text-gray-500" colSpan={4}>
                      No entries.
                    </td>
                  </tr>
                ) : (
                  [...entries].slice().reverse().map((x, idx) => (
                    <tr key={x.dateTime + idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="border-b border-gray-100 px-3 py-2">{x.dateTime}</td>
                      <td className="border-b border-gray-100 px-3 py-2">
                        {name === "NEWS2" && isNews2Alert(x.value) ? (
                          <span className="rounded bg-yellow-100 px-2 py-1 font-semibold text-yellow-900">{x.value}</span>
                        ) : (
                          x.value
                        )}
                      </td>
                      <td className="border-b border-gray-100 px-3 py-2">{x.enteredBy ?? ""}</td>
                      <td className="border-b border-gray-100 px-3 py-2">{x.note ?? ""}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={onUpdateClick}>
          Update value
        </Button>
      </DialogActions>
    </Dialog>
  );
};
