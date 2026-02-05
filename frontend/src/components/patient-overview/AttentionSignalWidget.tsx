// src/components/patient-overview/AttentionSignalWidget.tsx
import React, { useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Popover,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import FlagIcon from "@mui/icons-material/Flag";
import type { AttentionCategory, AttentionSignalEntry } from "../../features/patient-overview/types";
import { AttentionSignalCreateDialog } from "../../features/patient-overview/dialogs/AttentionSignalCreateDialog";
import { AttentionSignalAnnulDialog } from "../../features/patient-overview/dialogs/AttentionSignalAnnulDialog";
import { MOCK_ATTENTION_SIGNALS } from "../../features/patient-overview/mockData";


/* ============= TYPE =============== */
type Props = {
  entries?: AttentionSignalEntry[];
};

const CATEGORY_ORDER: AttentionCategory[] = [
  "Hypersensitivity",
  "Medical Condition and Treatment",
  "Infection",
  "Non-routine Care Deviation"
]

/* ========================================================
 * COMPONENT
 * ====================================================== */
export const AttentionSignalWidget: React.FC<Props> = ({ entries }) => {
  const [data, setData] = useState<AttentionSignalEntry[]>(entries ?? MOCK_ATTENTION_SIGNALS);

  // Popover summary
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // Full dialog
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(data[0]?.id ?? "");

  // Filters
  const [showEnded, setShowEnded] = useState(false);
  const [showCancelled, setShowCancelled] = useState(false);

  // Create / annul dialogs
  const [openCreate, setOpenCreate] = useState(false);
  const [openAnnul, setOpenAnnul] = useState(false);

  // “Fler alternativ”
  const [moreAnchor, setMoreAnchor] = useState<HTMLElement | null>(null);

  const filtered = useMemo(() => {
    return data.filter((x) => {
      if (x.status === "active") return true;
      if (x.status === "ended") return showEnded;
      if (x.status === "cancelled") return showCancelled;
      return false;
    });
  }, [data, showEnded, showCancelled]);

  const grouped = useMemo(() => {
    const g: Record<string, AttentionSignalEntry[]> = {};
    for (const c of CATEGORY_ORDER) g[c] = [];
    for (const item of filtered) g[item.category] = [...(g[item.category] ?? []), item];
    return g;
  }, [filtered]);

  const selected = useMemo(() => data.find((x) => x.id === selectedId), [data, selectedId]);

  const openPopover = Boolean(anchorEl);

  const activeCount = useMemo(() => data.filter((x) => x.status === "active").length, [data]);

  const handleOpenFromPopover = (id: string) => {
    setSelectedId(id);
    setAnchorEl(null);
    setOpen(true);
  };

  const handleCreate = (entry: AttentionSignalEntry) => {
    setData((prev) => [entry, ...prev]);
    setSelectedId(entry.id);
    setOpen(true);
  };

  const handleAnnulSelected = (reason: string) => {
    if (!selected) return;
    setData((prev) =>
      prev.map((x) =>
        x.id === selected.id
          ? {
              ...x,
              status: "cancelled",
              description: reason ? `${x.description ?? ""}\nMakulera: ${reason}`.trim() : x.description,
            }
          : x
      )
    );
  };

  return (
    <>
      {/* Icon in banner */}
      <Tooltip
        title={
          <div style={{ maxWidth: 320 }}>
            The attention alert displays a summary of important medical information for the selected patient.
          </div>
        }
      >
        <IconButton
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.55)",
            borderRadius: "8px",
            width: 34,
            height: 34,
          }}
        >
          <NewReleasesIcon fontSize="large" />
        </IconButton>
      </Tooltip>

      {/* Summary popover (like screenshot #2) */}
      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <div className="min-w-[360px] p-2 text-xs">
          <div className="mb-2 flex items-center justify-between">
            <div className="font-semibold text-gray-800">Attention signal</div>
            <Button size="small" onClick={() => setOpenCreate(true)}>
              New…
            </Button>
          </div>

          <div className="rounded border border-gray-200 bg-white">
            {CATEGORY_ORDER.map((cat) => {
              const items = grouped[cat] ?? [];
              if (!items.length) return null;

              return (
                <div key={cat} className="border-b border-gray-100 last:border-b-0">
                  <div className="px-3 py-2 text-[11px] font-semibold text-gray-700">{cat}</div>

                  {items.map((it) => (
                    <button
                      key={it.id}
                      className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-[11px] hover:bg-blue-50"
                      onClick={() => handleOpenFromPopover(it.id)}
                      type="button"
                    >
                      <div className="flex items-center gap-2">
                        {it.flags?.some((f) => f.kind === "flag") ? (
                          <FlagIcon fontSize="inherit" className="text-orange-600" />
                        ) : (
                          <span className="inline-block h-3 w-3 rounded-full bg-gray-200" />
                        )}
                        <span className={it.status !== "active" ? "text-gray-400" : "text-gray-900"}>
                          {it.title}
                        </span>
                      </div>
                      {it.status === "cancelled" ? (
                        <span className="rounded bg-gray-100 px-2 py-[2px] text-[10px] text-gray-600">Makul.</span>
                      ) : it.status === "ended" ? (
                        <span className="rounded bg-gray-100 px-2 py-[2px] text-[10px] text-gray-600">Avsl.</span>
                      ) : null}
                    </button>
                  ))}
                </div>
              );
            })}

            {!filtered.length && (
              <div className="px-3 py-3 text-[11px] text-gray-500">No attention signals to display.</div>
            )}
          </div>

          <div className="mt-2 flex items-center gap-4 px-1 text-[11px] text-gray-600">
            <span>Aktive: {activeCount}</span>
            <label className="flex items-center gap-1">
              <Checkbox size="small" checked={showEnded} onChange={(e) => setShowEnded(e.target.checked)} />
              Show completed
            </label>
            <label className="flex items-center gap-1">
              <Checkbox size="small" checked={showCancelled} onChange={(e) => setShowCancelled(e.target.checked)} />
              Show cancelled
            </label>
          </div>
        </div>
      </Popover>

      {/* Full dialog (like screenshot #3/#4) */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="lg">
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Attention signal</span>
            <span className="text-sm text-gray-500">({activeCount} aktiva)</span>
          </div>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <div className="grid gap-3 md:grid-cols-[280px_minmax(0,1fr)]">
            {/* Left navigation */}
            <div className="rounded border border-gray-200 bg-white">
              {CATEGORY_ORDER.map((cat) => {
                const items = grouped[cat] ?? [];
                if (!items.length) return null;

                return (
                  <div key={cat} className="border-b border-gray-100 last:border-b-0">
                    <div className="px-3 py-2 text-[12px] font-semibold text-gray-700">{cat}</div>
                    {items.map((it) => {
                      const active = it.id === selectedId;
                      return (
                        <button
                          key={it.id}
                          className={
                            "flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] hover:bg-blue-50 " +
                            (active ? "bg-yellow-50" : "")
                          }
                          onClick={() => setSelectedId(it.id)}
                          type="button"
                        >
                          <span className="inline-block h-3 w-3 rounded-full bg-gray-200" />
                          <span className={it.status !== "active" ? "text-gray-400" : "text-gray-900"}>
                            {it.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}

              <div className="p-2">
                <div className="flex items-center gap-3 text-[11px] text-gray-600">
                  <label className="flex items-center gap-1">
                    <Checkbox size="small" checked={showEnded} onChange={(e) => setShowEnded(e.target.checked)} />
                    Show completed
                  </label>
                  <label className="flex items-center gap-1">
                    <Checkbox size="small" checked={showCancelled} onChange={(e) => setShowCancelled(e.target.checked)} />
                    Show cancelled
                  </label>
                </div>

                <div className="mt-2">
                  <Button variant="outlined" size="small" onClick={() => setOpenCreate(true)}>
                    New…
                  </Button>
                </div>
              </div>
            </div>

            {/* Right details */}
            <div className="rounded border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-4 py-3">
                <div className="text-lg font-semibold">{selected?.title ?? "Välj en registrering"}</div>
                <div className="mt-1 text-sm text-gray-600">
                  {selected?.category ?? ""}{" "}
                  {selected?.status !== "active" ? (
                    <span className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700">
                      {selected?.status === "ended" ? "Completed" : "Canceled"}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-3 p-4 md:grid-cols-2">
                <div>
                  <div className="text-[12px] font-semibold text-gray-700">Severity</div>
                  <div className="text-[12px] text-gray-800">{selected?.severity ?? "-"}</div>
                </div>
                <div>
                  <div className="text-[12px] font-semibold text-gray-700">Degree of certainty</div>
                  <div className="text-[12px] text-gray-800">{selected?.certainty ?? "-"}</div>
                </div>

                <div className="md:col-span-2">
                  <div className="text-[12px] font-semibold text-gray-700">Description</div>
                  <div className="whitespace-pre-line text-[12px] text-gray-800">{selected?.description ?? "-"}</div>
                </div>

                <div className="md:col-span-2">
                  <div className="text-[12px] font-semibold text-gray-700">Länkar</div>
                  {selected?.links?.length ? (
                    <ul className="list-inside list-disc text-[12px] text-blue-700">
                      {selected.links.map((l) => (
                        <li key={l.label}>
                          <button type="button" className="underline">
                            {l.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-[12px] text-gray-500">-</div>
                  )}
                </div>

                <div className="md:col-span-2 grid gap-2 rounded border border-gray-100 bg-gray-50 p-3 md:grid-cols-2">
                  <div>
                    <div className="text-[12px] font-semibold text-gray-700">Healthcare professionals</div>
                    <div className="text-[12px] text-gray-800">{selected?.assessedBy ?? "-"}</div>
                  </div>
                  <div>
                    <div className="text-[12px] font-semibold text-gray-700">Assessment date</div>
                    <div className="text-[12px] text-gray-800">{selected?.assessedAt ?? "-"}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-[12px] font-semibold text-gray-700">Healthcare contact</div>
                    <div className="text-[12px] text-gray-800">{selected?.careContact ?? "-"}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-[12px] font-semibold text-gray-700">Unit</div>
                    <div className="text-[12px] text-gray-800">{selected?.unit ?? "-"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>

        <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>
          <div className="flex items-center gap-2">
            <Button variant="outlined" onClick={() => setOpenCreate(true)}>
              New assessment
            </Button>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outlined"
              onClick={(e) => setMoreAnchor(e.currentTarget)}
              disabled={!selected}
            >
              More options
            </Button>
          </div>

          <Menu
            open={Boolean(moreAnchor)}
            anchorEl={moreAnchor}
            onClose={() => setMoreAnchor(null)}
          >
            <MenuItem
              onClick={() => {
                setMoreAnchor(null);
                // placeholder action
              }}
            >
              View assessment information
            </MenuItem>
            <MenuItem
              onClick={() => {
                setMoreAnchor(null);
                // placeholder action
              }}
            >
              Resign (correct)
            </MenuItem>
            <MenuItem
              onClick={() => {
                setMoreAnchor(null);
                setOpenAnnul(true);
              }}
            >
              Cancel
            </MenuItem>
          </Menu>
        </DialogActions>
      </Dialog>

      {/* Create */}
      <AttentionSignalCreateDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreate={handleCreate}
      />

      {/* Annul */}
      <AttentionSignalAnnulDialog
        open={openAnnul}
        title={selected?.title}
        onClose={() => setOpenAnnul(false)}
        onConfirm={handleAnnulSelected}
      />
    </>
  );
};
