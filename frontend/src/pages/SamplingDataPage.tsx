import React, { useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";

import { mockSamplingWorklist } from "../features/sampling/mockData";
import type { SamplingWorklistItem, TubeGroup } from "../features/sampling/types";

type PrintDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (opts: { printRequisition: boolean; printLabels: boolean }) => void;
};

const PrintDialog: React.FC<PrintDialogProps> = ({ open, onClose, onConfirm }) => {
  const [printRequisition, setPrintRequisition] = useState(true);
  const [printLabels, setPrintLabels] = useState(true);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Print</DialogTitle>
      <DialogContent>
        <Stack sx={{ mt: 1 }} spacing={1}>
          <FormControlLabel
            control={<Checkbox checked={printRequisition} onChange={(e) => setPrintRequisition(e.target.checked)} />}
            label="Print sampling requisition"
          />
          <FormControlLabel
            control={<Checkbox checked={printLabels} onChange={(e) => setPrintLabels(e.target.checked)} />}
            label="Print labels"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => onConfirm({ printRequisition, printLabels })}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const SamplingDataPage: React.FC = () => {
  const [rows, setRows] = useState<SamplingWorklistItem[]>(mockSamplingWorklist);
  const [selectedId, setSelectedId] = useState<string>(mockSamplingWorklist[0]?.id ?? "");
  const selected = useMemo(() => rows.find((r) => r.id === selectedId) ?? null, [rows, selectedId]);

  // Filters (top)
  const [scope, setScope] = useState<"selected" | "all">("all");
  const [fromDate, setFromDate] = useState("2020-12-18");
  const [toDate, setToDate] = useState("2021-03-17");
  const [orderingUnit, setOrderingUnit] = useState("Medical ward 1");
  const [showPerformed, setShowPerformed] = useState(false);
  const [showExtended, setShowExtended] = useState(true);

  // Middle panel state
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // Print dialog
  const [openPrint, setOpenPrint] = useState(false);

  const visibleRows = useMemo(() => {
    // MVP: we don’t actually filter by date/time in this mock; but we keep the UI.
    const base = rows.filter((r) => (showPerformed ? true : !r.sent));
    if (scope === "selected" && selected) return base.filter((r) => r.personId === selected.personId);
    if (orderingUnit) return base.filter((r) => r.orderingUnit === orderingUnit);
    return base;
  }, [rows, scope, selected, orderingUnit, showPerformed]);

  const toggleGroup = (g: TubeGroup) => {
    setOpenGroups((prev) => ({ ...prev, [g.id]: !(prev[g.id] ?? true) }));
  };

  const updateSelected = (patch: Partial<SamplingWorklistItem>) => {
    if (!selected) return;
    setRows((prev) => prev.map((r) => (r.id === selected.id ? { ...r, ...patch } : r)));
  };

  const handleSend = () => {
    if (!selected) return;
    // Cosmic-like: after sending, it disappears from the worklist
    setRows((prev) => prev.map((r) => (r.id === selected.id ? { ...r, sent: true } : r)));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-[16px] font-semibold">Sampling data</div>
        <div className="text-xs text-gray-500">Unit worklist (Cosmic-like)</div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(360px,1.15fr)_minmax(0,2fr)_minmax(340px,1.1fr)]">
        {/* LEFT: Worklist */}
        <section className="rounded border border-gray-300 bg-white">
          <header className="border-b border-gray-200 px-3 py-2">
            <div className="text-[13px] font-semibold">Worklist</div>
            <div className="text-[11px] text-gray-500">Pending sampling orders</div>
          </header>

          <div className="px-2 py-2">
            <div className="grid grid-cols-[140px_150px_1fr_150px_110px] gap-2 border-b border-gray-100 pb-1 text-[10px] uppercase tracking-wide text-gray-500">
              <div>Date</div>
              <div>Person ID</div>
              <div>Name</div>
              <div>Specialty</div>
              <div>RID</div>
            </div>

            <div className="max-h-[70vh] overflow-auto">
              {visibleRows.length === 0 ? (
                <div className="px-2 py-3 text-[11px] text-gray-500">No items.</div>
              ) : (
                visibleRows.map((r) => {
                  const isSelected = r.id === selectedId;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedId(r.id)}
                      className={
                        "grid w-full grid-cols-[140px_150px_1fr_150px_110px] gap-2 px-2 py-2 text-left text-[11px] hover:bg-blue-50 " +
                        (isSelected ? "bg-blue-50" : "bg-white")
                      }
                    >
                      <div className="truncate">
                        <span className="mr-2 text-gray-600">{r.dateTime}</span>
                        {r.printed ? (
                          <span className="inline-block rounded bg-gray-200 px-1.5 py-0.5 text-[10px] text-gray-700">
                            Printed
                          </span>
                        ) : null}
                      </div>
                      <div className="truncate text-gray-700">{r.personId}</div>
                      <div className="truncate font-medium">{r.patientName}</div>
                      <div className="truncate text-gray-700">{r.specialty}</div>
                      <div className="truncate text-gray-700">{r.rid}</div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* TOP BAR spanning middle+right */}
        <section className="lg:col-span-2 rounded border border-gray-300 bg-white">
          <div className="flex flex-wrap items-center gap-3 px-3 py-2">
            <div className="text-[12px] font-semibold text-gray-700">View</div>

            <RadioGroup
              row
              value={scope}
              onChange={(e) => setScope(e.target.value as "selected" | "all")}
            >
              <FormControlLabel value="selected" control={<Radio size="small" />} label="Selected patient" />
              <FormControlLabel value="all" control={<Radio size="small" />} label="All patients" />
            </RadioGroup>

            <TextField
              label="From"
              size="small"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              sx={{ minWidth: 140 }}
            />
            <TextField
              label="To"
              size="small"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              sx={{ minWidth: 140 }}
            />

            <TextField
              label="Ordering unit"
              size="small"
              select
              value={orderingUnit}
              onChange={(e) => setOrderingUnit(e.target.value)}
              sx={{ minWidth: 220 }}
            >
              <MenuItem value="Medical ward 1">Medical ward 1</MenuItem>
              <MenuItem value="Emergency department">Emergency department</MenuItem>
              <MenuItem value="Stroke ward">Stroke ward</MenuItem>
            </TextField>

            <FormControlLabel
              control={<Checkbox checked={showPerformed} onChange={(e) => setShowPerformed(e.target.checked)} />}
              label="Show sent/performed"
            />

            <Button variant="outlined" size="small">
              Update
            </Button>

            <div className="ml-auto flex items-center gap-2">
              <FormControlLabel
                control={<Checkbox checked={showExtended} onChange={(e) => setShowExtended(e.target.checked)} />}
                label="Show extended information"
              />
            </div>
          </div>
        </section>

        {/* MIDDLE: Ordered analyses */}
        <section className="rounded border border-gray-300 bg-white">
          <header className="border-b border-gray-200 px-3 py-2">
            <div className="text-[13px] font-semibold">Ordered analyses / investigations</div>
            <div className="text-[11px] text-gray-500">
              {selected ? `${selected.patientName} • ${selected.orderingUnit}` : "Select an item"}
            </div>
          </header>

          <div className="p-3">
            {!selected ? (
              <div className="text-[11px] text-gray-500">Pick an item from the worklist.</div>
            ) : (
              <div className="space-y-2">
                {selected.tubeGroups.map((g) => {
                  const isOpen = openGroups[g.id] ?? true;

                  return (
                    <div key={g.id} className="rounded border border-gray-200">
                      <button
                        type="button"
                        onClick={() => toggleGroup(g)}
                        className="flex w-full items-center justify-between bg-gray-50 px-2 py-2 text-left text-[11px] font-semibold hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-2">
                          <span className={"transition-transform " + (isOpen ? "rotate-90" : "")}>▶</span>
                          <span>{g.label}</span>
                        </div>
                        <span className="text-[11px] text-gray-500">{g.analyses.length}</span>
                      </button>

                      {isOpen ? (
                        <div className="px-3 py-2">
                          {g.analyses.map((a) => (
                            <div key={a} className="flex items-center gap-2 py-1 text-[11px]">
                              <span className="inline-block h-2 w-2 rounded bg-gray-300" />
                              <span className="truncate">{a}</span>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <footer className="border-t border-gray-200 px-3 py-2 text-right">
            <Button variant="outlined" size="small" disabled>
              Split order
            </Button>
            <Button variant="outlined" size="small" disabled sx={{ ml: 1 }}>
              Sampling instructions
            </Button>
          </footer>
        </section>

        {/* RIGHT: Admin panel */}
        <section className="rounded border border-gray-300 bg-white">
          <header className="border-b border-gray-200 px-3 py-2">
            <div className="text-[13px] font-semibold">Administrative</div>
            <div className="text-[11px] text-gray-500">Adjust metadata + sampling time</div>
          </header>

          <div className="p-3">
            {!selected ? (
              <div className="text-[11px] text-gray-500">Select a worklist item.</div>
            ) : (
              <Stack spacing={2}>
                <TextField
                  label="Requester"
                  size="small"
                  value={selected.requester}
                  onChange={(e) => updateSelected({ requester: e.target.value })}
                  disabled={!showExtended}
                />
                <TextField
                  label="Ordering unit"
                  size="small"
                  value={selected.orderingUnit}
                  onChange={(e) => updateSelected({ orderingUnit: e.target.value })}
                  disabled={!showExtended}
                />
                <TextField
                  label="Response recipient"
                  size="small"
                  value={selected.responseRecipient}
                  onChange={(e) => updateSelected({ responseRecipient: e.target.value })}
                  disabled={!showExtended}
                />
                <TextField
                  label="Response recipient unit"
                  size="small"
                  value={selected.responseRecipientUnit}
                  onChange={(e) => updateSelected({ responseRecipientUnit: e.target.value })}
                  disabled={!showExtended}
                />
                <TextField
                  label="Paying unit"
                  size="small"
                  value={selected.payingUnit}
                  onChange={(e) => updateSelected({ payingUnit: e.target.value })}
                  disabled={!showExtended}
                />
                <TextField
                  label="Order identity"
                  size="small"
                  value={selected.orderIdentity}
                  onChange={(e) => updateSelected({ orderIdentity: e.target.value })}
                  disabled={!showExtended}
                />

                <div className="grid grid-cols-2 gap-2">
                  <TextField
                    label="Planned sampling date"
                    size="small"
                    value={selected.plannedSamplingDate}
                    onChange={(e) => updateSelected({ plannedSamplingDate: e.target.value })}
                    disabled={!showExtended}
                  />
                  <TextField
                    label="Planned time"
                    size="small"
                    value={selected.plannedSamplingTime}
                    onChange={(e) => updateSelected({ plannedSamplingTime: e.target.value })}
                    disabled={!showExtended}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <TextField
                    label="Sampling date"
                    size="small"
                    value={selected.samplingDate}
                    onChange={(e) => updateSelected({ samplingDate: e.target.value })}
                  />
                  <TextField
                    label="Sampling time"
                    size="small"
                    value={selected.samplingTime}
                    onChange={(e) => updateSelected({ samplingTime: e.target.value })}
                  />
                </div>

                <div className="rounded border border-gray-200 p-2">
                  <div className="text-[11px] font-semibold text-gray-700">Priority</div>
                  <RadioGroup
                    value={selected.priority}
                    onChange={(e) => updateSelected({ priority: e.target.value as any })}
                  >
                    <FormControlLabel value="Routine" control={<Radio size="small" />} label="Routine" />
                    <FormControlLabel value="Urgent" control={<Radio size="small" />} label="Urgent" />
                    <FormControlLabel value="Stat" control={<Radio size="small" />} label="Stat" />
                  </RadioGroup>
                </div>

                <TextField
                  label="Sampler comment"
                  size="small"
                  multiline
                  minRows={2}
                  value={selected.samplerComment ?? ""}
                  onChange={(e) => updateSelected({ samplerComment: e.target.value })}
                />
                <TextField
                  label="Requester comment"
                  size="small"
                  multiline
                  minRows={2}
                  value={selected.requesterComment ?? ""}
                  onChange={(e) => updateSelected({ requesterComment: e.target.value })}
                  disabled={!showExtended}
                />

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Button variant="outlined" size="small">
                    Medical info
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setOpenPrint(true)}
                  >
                    Print
                  </Button>

                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleSend}
                    disabled={selected.sent}
                  >
                    Send
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSelectedId(visibleRows[0]?.id ?? "")}
                  >
                    Close
                  </Button>
                </div>

                <div className="text-[11px] text-gray-500">
                  {selected.sent
                    ? "This item has been sent and will disappear unless “Show sent/performed” is enabled."
                    : "After sending, the item is removed from the worklist (Cosmic-like)."}
                </div>
              </Stack>
            )}
          </div>
        </section>
      </div>

      <PrintDialog
        open={openPrint}
        onClose={() => setOpenPrint(false)}
        onConfirm={(opts) => {
          // MVP: treat print as “printed = true”
          if (selected) updateSelected({ printed: true });
          setOpenPrint(false);
          // you can also log opts.printRequisition / opts.printLabels
          void opts;
        }}
      />
    </div>
  );
};

export default SamplingDataPage;
