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
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { MessageSquareText } from "lucide-react";

import type {
  MedicationGroup,
  Medication,
  MedicationScheduleItem,
  DoseRef,
  DoseStatus,
  DoseMeta,
} from "../../../features/medications/types";



import {
  toMinutes,
  buildDayRange,
  roundNowTo,
  toISODate,
  toHHmm,
  toDateTimeLocal,
  doseKey,
  doseRefKey,
  splitDoseLabel,
  directiveStripeStyle,
  isDirective,
  isInHandoverRange,
  buildHandoverLines,
  createPrnDoseBase,
  doseDateTime,
} from "./dispensing.utils";

import { DispensingTimeline } from "./DispensingTimeline";
import { DosePillIcon } from "./DosePillIcon";
import { AdminActionDialog } from "./AdminActionDialog";
import { InfusionDialog } from "./InfusionDialog";
import { InfusionRunningDose } from "./InfusionRunningDose";


import { InfusionEndDialog } from "./InfusionEndDialog";
import { DoseContextMenu, type DoseContextMenuAction } from "./DoseContextMenu";
import { DEFAULT_HANDOVER_TO_ID, DEFAULT_SIGNER_ID, MOCK_HANDOVER_TO, MOCK_SIGNERS } from "../../../features/medications/mockData";

export function DispensingView({ groups }: { groups: MedicationGroup[] }) {
  const [signedBy, setSignedBy] = useState<string>(
    MOCK_SIGNERS.some((s) => s.id === DEFAULT_SIGNER_ID)
      ? DEFAULT_SIGNER_ID
      : MOCK_SIGNERS[0].id
  );

  const allMeds = useMemo(
    () => groups.flatMap((g) => g.items).filter(Boolean),
    [groups]
  );

  const days = useMemo(() => buildDayRange("2024-12-11", 1), []);
  const dayWidth = 900;
  const rowHeight = 62;
  const width = days.length * dayWidth;

  const [selectedDoses, setSelectedDoses] = useState<DoseRef[]>([]);
  const primarySelected: DoseRef | null =
    selectedDoses.length > 0 ? selectedDoses[selectedDoses.length - 1] : null;

  const selectedMedId = primarySelected?.medId ?? null;

  const [menuState, setMenuState] = useState<{
    open: boolean;
    x: number;
    y: number;
    payload: DoseRef | null;
  }>({ open: false, x: 0, y: 0, payload: null });

  const [prnMenuState, setPrnMenuState] = useState<{
    open: boolean;
    x: number;
    y: number;
    medId: string | null;
  }>({ open: false, x: 0, y: 0, medId: null });

  const [adminOpen, setAdminOpen] = useState(false);
  const [adminKind, setAdminKind] = useState<"administer" | "selfAdmin" | "skip">("administer");

  const [includedKeys, setIncludedKeys] = useState<Record<string, boolean>>({});
  const [adminDoseByKey, setAdminDoseByKey] = useState<Record<string, string>>({});

  const [handoverOpen, setHandoverOpen] = useState(false);
  const [handoverToId, setHandoverToId] = useState<string>(
    MOCK_HANDOVER_TO.some((x) => x.id === DEFAULT_HANDOVER_TO_ID)
      ? DEFAULT_HANDOVER_TO_ID
      : MOCK_HANDOVER_TO[0].id
  );
  const [handoverNote, setHandoverNote] = useState<string>("");
  const [handoverIncludedKeys, setHandoverIncludedKeys] = useState<Record<string, boolean>>({});

  const [handoverFrom, setHandoverFrom] = useState<string>("2024-12-11T00:00");
  const [handoverTo, setHandoverTo] = useState<string>("2024-12-11T23:59");

  const [infusionOpen, setInfusionOpen] = useState(false);
  const [infusionMode, setInfusionMode] = useState<"prepare" | "start">("prepare");

  const [infusionEndOpen, setInfusionEndOpen] = useState(false);

  const [doseAdditionsByMedId, setDoseAdditionsByMedId] = useState<
    Record<string, MedicationScheduleItem[]>
  >({});

  const [doseStatusOverrides, setDoseStatusOverrides] = useState<Record<string, DoseStatus>>({});
  const [doseMetaOverrides, setDoseMetaOverrides] = useState<Record<string, DoseMeta>>({});

  const [adminTime, setAdminTime] = useState("2024-12-11T12:00");
  const [adminComment, setAdminComment] = useState("");
  const [adminReason, setAdminReason] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const ticks = ["08:00", "12:00", "16:00", "20:00", "00:00"];
  const inWindow = (s: MedicationScheduleItem) => days.includes(s.date);

  function effectiveStatus(medId: string, s: MedicationScheduleItem): DoseStatus {
    return doseStatusOverrides[doseKey(medId, s)] ?? (s.status ?? "planned");
  }

  function effectiveMeta(medId: string, s: MedicationScheduleItem): DoseMeta {
    return doseMetaOverrides[doseKey(medId, s)] ?? {};
  }

  function effectiveLabel(medId: string, s: MedicationScheduleItem): { l1: string; l2?: string } {
    const meta = effectiveMeta(medId, s);
    if (meta.labelLine1) return { l1: meta.labelLine1, l2: meta.labelLine2 };
    return { l1: s.label };
  }

  function effectiveSchedule(m: Medication): MedicationScheduleItem[] {
    const base = m?.schedule ?? [];
    const added = doseAdditionsByMedId[m?.id] ?? [];
    return [...base, ...added];
  }

  const directiveMeds: Medication[] = useMemo(() => {
    const real = allMeds.filter((m) => isDirective(m));
    if (real.length) return real;

    return [
      {
        id: "gd_viscotears",
        group: "generalDirective",
        name: "Viscotears",
        strength: "2 mg/g",
        dosingText: "1–2 drops single dose",
        startDate: "—",
        tooltip: "General directive: dry eyes (mock).",
        schedule: [
          {
            date: "2024-12-11",
            time: "14:45",
            label: "1–2 drops",
            status: "planned",
            tooltip: "General directive dose (mock)",
          },
        ],
      },
      {
        id: "gd_loperamid",
        group: "generalDirective",
        name: "Loperamid",
        strength: "2 mg",
        dosingText: "1 capsule single dose",
        startDate: "—",
        tooltip: "General directive: diarrhea (mock).",
        schedule: [
          {
            date: "2024-12-11",
            time: "12:00",
            label: "1 cap",
            status: "planned",
            tooltip: "General directive dose (mock)",
          },
        ],
      },
    ];
  }, [allMeds]);

  const medById = useMemo(() => {
    const map = new Map<string, Medication>();
    for (const m of allMeds) map.set(m.id, m);
    for (const m of directiveMeds) map.set(m.id, m);
    return map;
  }, [allMeds, directiveMeds]);

  function getMed(medId: string) {
    return medById.get(medId) ?? null;
  }

  function isDoseSelected(d: DoseRef) {
    const k = doseRefKey(d);
    return selectedDoses.some((x) => doseRefKey(x) === k);
  }

  function setSingleSelection(d: DoseRef | null) {
    setSelectedDoses(d ? [d] : []);
  }

  function toggleSelection(d: DoseRef) {
    const k = doseRefKey(d);
    setSelectedDoses((prev) => {
      const exists = prev.some((x) => doseRefKey(x) === k);
      if (exists) return prev.filter((x) => doseRefKey(x) !== k);
      return [...prev, d];
    });
  }

  function handleDoseClick(e: React.MouseEvent, d: DoseRef) {
    const multi = e.ctrlKey || e.metaKey;
    if (multi) toggleSelection(d);
    else setSingleSelection(d);
  }

  function openDoseContextMenu(e: React.MouseEvent, medId: string, item: MedicationScheduleItem) {
    e.preventDefault();
    const d: DoseRef = { medId, item };
    if (!isDoseSelected(d)) setSingleSelection(d);
    setMenuState({ open: true, x: e.clientX, y: e.clientY, payload: d });
  }

  function closeDoseMenu() {
    setMenuState((s) => ({ ...s, open: false }));
  }

  function openPrnMenu(e: React.MouseEvent, medId: string) {
    e.preventDefault();
    setPrnMenuState({ open: true, x: e.clientX, y: e.clientY, medId });
  }

  function closePrnMenu() {
    setPrnMenuState((s) => ({ ...s, open: false }));
  }

  function setStatusForDoses(doses: DoseRef[], next: DoseStatus) {
    setDoseStatusOverrides((prev) => {
      const out = { ...prev };
      for (const d of doses) out[doseRefKey(d)] = next;
      return out;
    });
  }

  function setMetaForDose(d: DoseRef, patch: Partial<DoseMeta>) {
    const k = doseRefKey(d);
    setDoseMetaOverrides((prev) => ({
      ...prev,
      [k]: { ...(prev[k] ?? {}), ...patch },
    }));
  }

  function setMetaForDoses(doses: DoseRef[], patch: Partial<DoseMeta>) {
    setDoseMetaOverrides((prev) => {
      const out = { ...prev };
      for (const d of doses) {
        const k = doseRefKey(d);
        out[k] = { ...(out[k] ?? {}), ...patch };
      }
      return out;
    });
  }

  function clearMetaFlagsForDoses(doses: DoseRef[], flags: (keyof DoseMeta)[]) {
    setDoseMetaOverrides((prev) => {
      const out = { ...prev };
      for (const d of doses) {
        const k = doseRefKey(d);
        const cur = out[k] ?? {};
        const next = { ...cur };
        flags.forEach((f) => delete (next as any)[f]);
        out[k] = next;
      }
      return out;
    });
  }

  function createPrnDose(medId: string): MedicationScheduleItem {
    const now = roundNowTo(5);
    const date = days[0] ?? toISODate(now);
    const time = toHHmm(now);
    return createPrnDoseBase({ now, dateFallback: date, timeFallback: time });
  }

  function addPrnDose(medId: string) {
    const dose = createPrnDose(medId);
    setDoseAdditionsByMedId((prev) => ({
      ...prev,
      [medId]: [...(prev[medId] ?? []), dose],
    }));
    setSingleSelection({ medId, item: dose });
    return dose;
  }

  function isDoseRequiringAdminDose(med: Medication | null) {
    if (!med) return true;
    if (isDirective(med)) return true;

    if (med.group === "prn") return true;
    const txt = `${med.dosingText} ${med.strength ?? ""} ${med.tooltip}`.toLowerCase();
    return (
      txt.includes("ml") ||
      txt.includes("injection") ||
      txt.includes("intraven") ||
      txt.includes("iv") ||
      txt.includes("drop")
    );
  }

  function isInfusionMed(med: Medication | null) {
    if (!med) return false;
    const txt = `${med.dosingText ?? ""} ${med.tooltip ?? ""} ${med.name ?? ""}`.toLowerCase();
    return (
      txt.includes("infusion") ||
      txt.includes("intraven") ||
      txt.includes("iv") ||
      txt.includes("ml/h") ||
      txt.includes("ml / h")
    );
  }

  function openInfusion(mode: "prepare" | "start") {
    if (!primarySelected) return;
    setInfusionMode(mode);
    setInfusionOpen(true);
  }

  function saveInfusion(patch: Partial<DoseMeta>) {
    if (!primarySelected) return;

    // starting infusion => given + running
    if (patch.infusionRunning) {
      setStatusForDoses([primarySelected], "given");
    }

    setMetaForDose(primarySelected, patch);
    setInfusionOpen(false);
  }

  function saveInfusionEnd(payload: {
    endAt: string;
    infusedMl: number;
    totalInfusedMl?: number;
    comment?: string;
  }) {
    if (!primarySelected) return;

    // End infusion => keep meta.startAt etc, set end data, set running false
    setStatusForDoses([primarySelected], "given");

    setMetaForDose(primarySelected, {
      infusionRunning: false,
      infusionEndAt: payload.endAt,
      infusionInfusedMl: payload.infusedMl,
      infusionTotalInfusedMl: payload.totalInfusedMl,
      comment: payload.comment,
    });

    setInfusionEndOpen(false);
  }

  const missedMeds = useMemo(() => {
    return allMeds.filter((m) =>
      effectiveSchedule(m).some((s) => inWindow(s) && effectiveStatus(m?.id, s) === "missed")
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allMeds, days, doseStatusOverrides, doseAdditionsByMedId]);

  const administrationMeds = useMemo(() => {
    const missedIds = new Set(missedMeds.map((m) => m?.id));
    return allMeds.filter((m) => !missedIds.has(m?.id) && m?.group === "current");
  }, [allMeds, missedMeds]);

  const prnMeds = useMemo(() => allMeds.filter((m) => m?.group === "prn"), [allMeds]);

  const leftGroups = useMemo(
    () => [
      { key: "missed", title: "Missed administrations", items: missedMeds, headerClass: "bg-red-600 text-white" },
      { key: "admin", title: "Administrations", items: administrationMeds, headerClass: "bg-gray-100 text-gray-800" },
      { key: "prn", title: "PRN (as needed)", items: prnMeds, headerClass: "bg-gray-100 text-gray-800" },
      { key: "dir", title: "General directives", items: directiveMeds, headerClass: "bg-gray-100 text-gray-800" },
    ],
    [missedMeds, administrationMeds, prnMeds, directiveMeds]
  );

  function openActionDialog(kind: "administer" | "selfAdmin" | "skip") {
    if (!selectedDoses.length) return;

    setAdminKind(kind);
    setFormError(null);
    setAdminOpen(true);

    setSignedBy(
      MOCK_SIGNERS.some((s) => s.id === DEFAULT_SIGNER_ID) ? DEFAULT_SIGNER_ID : MOCK_SIGNERS[0].id
    );

    const inc: Record<string, boolean> = {};
    const doseMap: Record<string, string> = {};

    for (const d of selectedDoses) {
      const k = doseRefKey(d);
      inc[k] = true;

      const med = getMed(d.medId);
      const needsDose = isDoseRequiringAdminDose(med);
      const currentLabel = effectiveLabel(d.medId, d.item).l1 ?? d.item.label ?? "";
      doseMap[k] = needsDose ? "" : currentLabel;
    }

    setIncludedKeys(inc);
    setAdminDoseByKey(doseMap);

    if (selectedDoses.length === 1) {
      const one = selectedDoses[0];
      setAdminTime(`${one.item?.date}T${one.item?.time}`);
      const meta = effectiveMeta(one.medId, one.item);
      setAdminComment(meta.comment ?? "");
      setAdminReason(kind === "skip" ? meta.skipReason ?? "" : meta.deviationReason ?? "");
      if (meta.signedById) setSignedBy(meta.signedById);
    } else {
      setAdminComment("");
      setAdminReason("");
      setAdminTime("2024-12-11T12:00");
    }
  }

  function applyHandoverRangeUpdate(nextFrom: string, nextTo: string) {
    setHandoverIncludedKeys((prev) => {
      const out: Record<string, boolean> = { ...prev };
      for (const d of selectedDoses) {
        const k = doseRefKey(d);
        out[k] = isInHandoverRange(d, nextFrom, nextTo);
      }
      return out;
    });

    const inRange = selectedDoses.filter((d) => isInHandoverRange(d, nextFrom, nextTo));
    const lines = buildHandoverLines(inRange, getMed);

    setHandoverNote(
      inRange.length <= 1
        ? `Please follow up: ${lines[0]?.replace(/^- /, "") ?? ""}`
        : `Please follow up on these doses:\n${lines.join("\n")}`
    );
  }

  function openHandoverDialog() {
    if (!selectedDoses.length) return;

    setHandoverOpen(true);

    const inc: Record<string, boolean> = {};
    for (const d of selectedDoses) inc[doseRefKey(d)] = true;
    setHandoverIncludedKeys(inc);

    setHandoverToId(
      MOCK_HANDOVER_TO.some((x) => x.id === DEFAULT_HANDOVER_TO_ID)
        ? DEFAULT_HANDOVER_TO_ID
        : MOCK_HANDOVER_TO[0].id
    );

    const dts = selectedDoses.map(doseDateTime).filter(Boolean) as Date[];
    if (dts.length) {
      const min = new Date(Math.min(...dts.map((x) => x.getTime())));
      const max = new Date(Math.max(...dts.map((x) => x.getTime())));
      setHandoverFrom(toDateTimeLocal(min));
      setHandoverTo(toDateTimeLocal(max));
    } else {
      setHandoverFrom("2024-12-11T00:00");
      setHandoverTo("2024-12-11T23:59");
    }

    const lines = buildHandoverLines(selectedDoses, getMed);

    setHandoverNote(
      selectedDoses.length === 1
        ? `Please follow up: ${lines[0]?.replace(/^- /, "") ?? ""}`
        : `Please follow up on these doses:\n${lines.join("\n")}`
    );

    setSignedBy(
      MOCK_SIGNERS.some((s) => s.id === DEFAULT_SIGNER_ID) ? DEFAULT_SIGNER_ID : MOCK_SIGNERS[0].id
    );
  }

  function getIncludedDoses(inc: Record<string, boolean>, doses: DoseRef[]): DoseRef[] {
    return doses.filter((d) => inc[doseRefKey(d)] !== false);
  }

  function saveDialog() {
    const doses = getIncludedDoses(includedKeys, selectedDoses);
    if (!doses.length) {
      setFormError("Select at least one dose.");
      return;
    }

    if (adminKind === "skip") {
      const reason = adminReason.trim();
      const comment = adminComment.trim();

      if (!reason && !comment) {
        setFormError("Please enter a reason or a comment.");
        return;
      }

      setStatusForDoses(doses, "skipped");
      clearMetaFlagsForDoses(doses, ["prepared", "selfAdmin"]);

      setMetaForDoses(doses, {
        skipReason: reason || undefined,
        comment: comment || undefined,
        signedById: signedBy || undefined,
        deviationReason: undefined,
      });

      setAdminOpen(false);
      return;
    }

    for (const d of doses) {
      const med = getMed(d.medId);
      const needsDose = isDoseRequiringAdminDose(med);
      const k = doseRefKey(d);
      const v = (adminDoseByKey[k] ?? "").trim();
      if (needsDose && !v) {
        setFormError("Enter administered dose for all selected PRN/directives/injections.");
        return;
      }
    }

    setStatusForDoses(doses, "given");
    clearMetaFlagsForDoses(doses, ["prepared"]);

    for (const d of doses) {
      const k = doseRefKey(d);
      const doseVal = (adminDoseByKey[k] ?? "").trim();

      setMetaForDose(d, {
        selfAdmin: adminKind === "selfAdmin",
        signedById: signedBy || undefined,
        comment: adminComment.trim() ? adminComment.trim() : undefined,
        deviationReason: adminReason.trim() ? adminReason.trim() : undefined,
        skipReason: undefined,
      });

      if (doseVal) setMetaForDose(d, { labelLine1: doseVal });
    }

    setAdminOpen(false);
  }

  function saveHandover() {
    const included = getIncludedDoses(handoverIncludedKeys, selectedDoses);
    const doses = included.filter((d) => isInHandoverRange(d, handoverFrom, handoverTo));
    if (!doses.length) return;

    const note = handoverNote.trim();
    setMetaForDoses(doses, {
      handoverToId: handoverToId || undefined,
      handoverNote: note || undefined,
      signedById: signedBy || undefined,
    });

    setHandoverOpen(false);
  }

  const selectedMed = primarySelected ? getMed(primarySelected.medId) : null;

  const SignedByBlock = (
    <div className="mt-4">
      <FormControl size="small" fullWidth>
        <InputLabel id="signed-by-label">Signed by</InputLabel>
        <Select
          labelId="signed-by-label"
          label="Signed by"
          value={signedBy}
          onChange={(e) => setSignedBy(String(e.target.value))}
        >
          {MOCK_SIGNERS.map((s) => (
            <MenuItem key={s.id} value={s.id}>
              {s.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div className="mt-3 text-sm text-gray-600">
        Selected signer:{" "}
        <span className="font-medium text-gray-800">
          {MOCK_SIGNERS.find((s) => s.id === signedBy)?.name ?? "—"}
        </span>
      </div>
    </div>
  );

  const selectionHint =
    "Tip: Ctrl/⌘ + click doses to select multiple (then Handover/Skip/Administer applies to all selected).";

  const handoverVisibleDoses = useMemo(() => {
    if (!handoverOpen) return selectedDoses;
    return selectedDoses.filter((d) => isInHandoverRange(d, handoverFrom, handoverTo));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handoverOpen, selectedDoses, handoverFrom, handoverTo]);

  const primaryMedForMenu = primarySelected ? getMed(primarySelected.medId) : null;
  const primaryMetaForMenu =
    primarySelected && primarySelected.item
      ? effectiveMeta(primarySelected.medId, primarySelected.item)
      : ({} as DoseMeta);

  const isInfForMenu = isInfusionMed(primaryMedForMenu);

  const infusionCanStart = !!primaryMetaForMenu.prepared && !primaryMetaForMenu.infusionRunning;
  const infusionCanEnd = !!primaryMetaForMenu.infusionRunning && !!primaryMetaForMenu.infusionStartAt;

  function onDoseMenuAction(action: DoseContextMenuAction) {
    switch (action) {
      case "infusionPrepare":
        openInfusion("prepare");
        return;
      case "infusionStart":
        openInfusion("start");
        return;
      case "infusionEnd":
        setInfusionEndOpen(true);
        return;

      case "prepare":
        setStatusForDoses(selectedDoses, "planned");
        setMetaForDoses(selectedDoses, { prepared: true, selfAdmin: false });
        return;

      case "administer":
        openActionDialog("administer");
        return;

      case "skip":
        openActionDialog("skip");
        return;

      case "selfAdmin":
        openActionDialog("selfAdmin");
        return;

      case "note":
        setMetaForDoses(selectedDoses, { comment: "Note (mock)" });
        return;

      case "handover":
        openHandoverDialog();
        return;

      case "viewLog":
      default:
        return;
    }
  }

  return (
    <div className="h-full grid grid-cols-[minmax(380px,0.9fr)_minmax(0,1.6fr)]">
      {/* LEFT LIST */}
      <div className="h-full overflow-auto border-r border-gray-200">
        <table className="w-full border-collapse text-[11px]">
          <thead className="sticky top-0 z-10 bg-gray-50">
            <tr className="text-gray-600">
              <th className="w-7 border-b border-gray-200 px-2 py-1 text-left font-normal"></th>
              <th className="border-b border-gray-200 px-2 py-1 text-left font-normal">
                Medication
              </th>
              <th className="border-b border-gray-200 px-2 py-1 text-left font-normal">
                Dosing
              </th>
              <th className="w-10 border-b border-gray-200 px-2 py-1 text-left font-normal">
                Σ
              </th>
              <th className="w-28 border-b border-gray-200 px-2 py-1 text-left font-normal">
                Start
              </th>
            </tr>
          </thead>

          <tbody>
            {leftGroups.map((g) => (
              <React.Fragment key={g.key}>
                <tr className={g.headerClass}>
                  <td colSpan={5} className="border-b border-gray-200 px-2 py-1 font-semibold">
                    {g.title} [{g.items.length}]
                  </td>
                </tr>

                {g.items.map((m) => {
                  const isSel = m?.id === selectedMedId;

                  const schedule = effectiveSchedule(m);
                  const hasMissed = schedule.some(
                    (s) => inWindow(s) && effectiveStatus(m?.id, s) === "missed"
                  );
                  const directive = isDirective(m);

                  return (
                    <tr
                      key={m?.id}
                      className={
                        "cursor-pointer border-b border-gray-100 hover:bg-blue-50 " +
                        (isSel ? "bg-blue-50" : "bg-white")
                      }
                      style={directive ? directiveStripeStyle() : undefined}
                      onClick={() => {
                        const first = schedule[0];
                        if (first) setSingleSelection({ medId: m?.id, item: first });
                        else setSingleSelection({ medId: m?.id, item: { date: days[0], time: "00:00", label: "" } });
                      }}
                      onContextMenu={(e) => {
                        if (m?.group === "prn") openPrnMenu(e, m?.id);
                      }}
                      title={m?.group === "prn" ? "Right-click for PRN actions" : undefined}
                    >
                      <td className="px-2 py-1">
                        <input type="checkbox" />
                      </td>

                      <td className="px-2 py-1">
                        <Tooltip title={m?.tooltip} arrow placement="top">
                          <div className="inline-flex items-center gap-2">
                            {hasMissed ? (
                              <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-600" title="Missed" />
                            ) : (
                              <span className="inline-block h-2.5 w-2.5 rounded-full bg-gray-300" />
                            )}
                            <span className="font-medium text-gray-900">
                              {directive ? "General directive: " : ""}
                              {m?.name}
                              {m?.strength ? <span className="text-gray-600">, {m?.strength}</span> : null}
                            </span>
                          </div>
                        </Tooltip>
                      </td>

                      <td className="px-2 py-1 text-gray-700">{m?.dosingText}</td>
                      <td className="px-2 py-1 text-gray-500"></td>
                      <td className="px-2 py-1 text-gray-600">{m?.startDate || "—"}</td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* RIGHT TIMELINE */}
      <div className="h-full flex flex-col bg-white">
        <DispensingTimeline days={days} dayWidth={dayWidth} ticks={ticks} selectionHint={selectionHint} />

        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <div style={{ minWidth: width }}>
            {leftGroups.flatMap((g) => g.items).map((m) => {
              const isRowSelected = m?.id === selectedMedId;
              const items = effectiveSchedule(m).filter(inWindow);
              const directive = isDirective(m);

              return (
                <div
                  key={m?.id}
                  className={"relative border-b border-gray-100 " + (isRowSelected ? "bg-blue-50" : "bg-white")}
                  style={directive ? directiveStripeStyle() : undefined}
                >
                  <div style={{ height: rowHeight }}>
                    {days.map((_, i) => (
                      <div
                        key={m?.id + "day" + i}
                        className="absolute top-0 h-full border-l border-gray-50"
                        style={{ left: i * dayWidth }}
                      />
                    ))}

                    {items.map((s, idx) => {
                      const dayIndex = days.indexOf(s.date);
                      if (dayIndex === -1) return null;

                      const x = dayIndex * dayWidth + (toMinutes(s.time) / (24 * 60)) * dayWidth;

                      const dref: DoseRef = { medId: m?.id, item: s };
                      const isSelectedDose = isDoseSelected(dref);

                      const status = effectiveStatus(m?.id, s);
                      const meta = effectiveMeta(m?.id, s);
                      const lbl = effectiveLabel(m?.id, s);
                      const split = splitDoseLabel(lbl.l1);

                      const textClass =
                        status === "missed"
                          ? "text-red-700"
                          : status === "notNeeded" || status === "skipped"
                          ? "text-gray-400"
                          : "text-gray-800";

                      const handoverToName = meta.handoverToId
                        ? MOCK_HANDOVER_TO.find((x) => x.id === meta.handoverToId)?.name
                        : undefined;

                      const extraNote = meta.skipReason
                        ? ` • Skipped: ${meta.skipReason}`
                        : meta.deviationReason
                        ? ` • Reason: ${meta.deviationReason}`
                        : meta.comment
                        ? ` • Note: ${meta.comment}`
                        : meta.handoverNote || handoverToName
                        ? ` • Handover: ${handoverToName ?? "—"}`
                        : "";

                      const tip =
                        (s.tooltip ??
                          `${m?.name}${m?.strength ? ` ${m?.strength}` : ""} — ${s.date} ${s.time} (${status})`) +
                        extraNote;

                      const hasAnyNote =
                        !!meta.comment ||
                        !!meta.skipReason ||
                        !!meta.deviationReason ||
                        !!meta.handoverNote ||
                        !!meta.handoverToId;

                      const medObj = getMed(dref.medId);
                      const isInf = isInfusionMed(medObj);

                      // render infusion widget if running OR ended
                      const showInfusionWidget =
                        isInf && !!meta.infusionStartAt && (meta.infusionRunning || !!meta.infusionEndAt);

                      if (showInfusionWidget) {
                        return (
                          <InfusionRunningDose
                            key={m?.id + s.date + s.time + idx}
                            days={days}
                            dayWidth={dayWidth}
                            dose={dref}
                            med={medObj}
                            meta={meta}
                            isSelected={isSelectedDose}
                            onClick={(e) => handleDoseClick(e, dref)}
                            onContextMenu={(e) => openDoseContextMenu(e, m?.id, s)}
                          />
                        );
                      }

                      return (
                        <Tooltip key={m?.id + s.date + s.time + idx} title={tip} arrow placement="top">
                          <div
                            onClick={(e) => handleDoseClick(e, dref)}
                            onContextMenu={(e) => openDoseContextMenu(e, m?.id, s)}
                            className={
                              "absolute top-2 -translate-x-1/2 cursor-pointer select-none " +
                              (isSelectedDose ? "ring-2 ring-blue-500 rounded-sm" : "")
                            }
                            style={{ left: x }}
                          >
                            <div className={"text-[10px] " + textClass}>{s.time}</div>

                            <div className={"flex items-center gap-1 text-[11px] " + textClass}>
                              <DosePillIcon status={status} prepared={meta.prepared} selfAdmin={meta.selfAdmin} />

                              <div className="font-semibold leading-3">
                                {split.amount ? (
                                  <div className="flex items-baseline gap-1">
                                    <span className="font-semibold">{split.amount}</span>
                                    {split.rest ? <span className="font-medium">{split.rest}</span> : null}
                                  </div>
                                ) : (
                                  <div>{split.raw || lbl.l1}</div>
                                )}
                                {lbl.l2 ? <div>{lbl.l2}</div> : null}
                              </div>

                              {hasAnyNote ? (
                                <MessageSquareText
                                  className={`h-3.5 w-3.5 ${
                                    meta.handoverToId || meta.handoverNote
                                      ? "text-indigo-600"
                                      : status === "skipped" || meta.skipReason
                                      ? "text-amber-600"
                                      : "text-gray-500"
                                  }`}
                                  title={
                                    meta.handoverToId || meta.handoverNote
                                      ? "Handover"
                                      : status === "skipped" || meta.skipReason
                                      ? "Skipped"
                                      : "Note"
                                  }
                                />
                              ) : null}
                            </div>
                          </div>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* bottom action bar */}
        <div className="border-t border-gray-200 bg-gray-50 px-3 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <button className="rounded border border-gray-300 bg-white px-3 py-1 text-xs">Scan</button>

            <button
              className={
                "rounded border px-3 py-1 text-xs " +
                (selectedDoses.length
                  ? "border-gray-300 bg-white"
                  : "border-gray-200 bg-gray-100 text-gray-400")
              }
              disabled={!selectedDoses.length}
              onClick={openHandoverDialog}
            >
              Handover{selectedDoses.length > 1 ? ` (${selectedDoses.length})` : ""}
            </button>

            <button className="rounded border border-gray-300 bg-white px-3 py-1 text-xs">
              Register...
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className={
                "rounded border px-3 py-1 text-xs " +
                (selectedDoses.length
                  ? "border-gray-300 bg-white"
                  : "border-gray-200 bg-gray-100 text-gray-400")
              }
              disabled={!selectedDoses.length}
              onClick={() => openActionDialog("skip")}
            >
              Skip{selectedDoses.length > 1 ? ` (${selectedDoses.length})` : ""}
            </button>

            <button
              className={
                "rounded border px-3 py-1 text-xs" +
                (selectedDoses.length
                  ? " border-gray-300 bg-white"
                  : " border-gray-200 bg-gray-100 text-gray-400")
              }
              disabled={!selectedDoses.length}
              onClick={() => {
                setStatusForDoses(selectedDoses, "planned");
                setMetaForDoses(selectedDoses, { prepared: true, selfAdmin: false });
              }}
            >
              Prepare{selectedDoses.length > 1 ? ` (${selectedDoses.length})` : ""}
            </button>

            <button
              className={
                "rounded px-3 py-1 text-xs " +
                (selectedDoses.length ? "bg-blue-600 text-white" : "bg-gray-300 text-white")
              }
              disabled={!selectedDoses.length}
              onClick={() => openActionDialog("administer")}
            >
              Administer{selectedDoses.length > 1 ? ` (${selectedDoses.length})` : ""}
            </button>

            <button
              className={
                "rounded border px-3 py-1 text-xs " +
                (selectedDoses.length
                  ? "border-gray-300 bg-white"
                  : "border-gray-200 bg-gray-100 text-gray-400")
              }
              disabled={!selectedDoses.length}
              onClick={() => openActionDialog("selfAdmin")}
            >
              Self-admin{selectedDoses.length > 1 ? ` (${selectedDoses.length})` : ""}
            </button>
          </div>
        </div>
      </div>

      {/* Dose context menu (split) */}
      <DoseContextMenu
        open={menuState.open}
        x={menuState.x}
        y={menuState.y}
        onClose={closeDoseMenu}
        onAction={onDoseMenuAction}
        showInfusionActions={isInfForMenu}
        infusionCanStart={infusionCanStart}
        infusionCanEnd={infusionCanEnd}
      />

      {/* PRN row context menu */}
      <Menu
        open={prnMenuState.open}
        onClose={() => setPrnMenuState((s) => ({ ...s, open: false }))}
        anchorReference="anchorPosition"
        anchorPosition={prnMenuState.open ? { top: prnMenuState.y, left: prnMenuState.x } : undefined}
      >
        <MenuItem
          onClick={() => {
            const medId = prnMenuState.medId;
            closePrnMenu();
            if (!medId) return;
            addPrnDose(medId);
          }}
        >
          Add new dose…
        </MenuItem>

        <MenuItem
          onClick={() => {
            const medId = prnMenuState.medId;
            closePrnMenu();
            if (!medId) return;
            const dose = addPrnDose(medId);
            const k = doseKey(medId, dose);
            setDoseStatusOverrides((prev) => ({ ...prev, [k]: "planned" }));
            setDoseMetaOverrides((prev) => ({ ...prev, [k]: { ...(prev[k] ?? {}), prepared: true } }));
          }}
        >
          Prepare new dose…
        </MenuItem>

        <MenuItem
          onClick={() => {
            const medId = prnMenuState.medId;
            closePrnMenu();
            if (!medId) return;
            addPrnDose(medId);
            openActionDialog("administer");
          }}
        >
          Administer new dose…
        </MenuItem>
      </Menu>

      <AdminActionDialog
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        onSave={saveDialog}
        adminKind={adminKind}
        selectedDoses={selectedDoses}
        primarySelected={primarySelected}
        selectedMed={selectedMed}
        includedKeys={includedKeys}
        setIncludedKeys={setIncludedKeys}
        adminDoseByKey={adminDoseByKey}
        setAdminDoseByKey={setAdminDoseByKey}
        adminTime={adminTime}
        setAdminTime={setAdminTime}
        adminComment={adminComment}
        setAdminComment={setAdminComment}
        adminReason={adminReason}
        setAdminReason={setAdminReason}
        formError={formError}
        setFormError={setFormError}
        SignedByBlock={SignedByBlock}
        getMed={getMed}
        doseRefKey={doseRefKey}
        isDirective={isDirective}
        isDoseRequiringAdminDose={isDoseRequiringAdminDose}
      />

      <InfusionDialog
        open={infusionOpen}
        mode={infusionMode}
        onClose={() => setInfusionOpen(false)}
        onSave={saveInfusion}
        dose={primarySelected}
        med={primarySelected ? getMed(primarySelected.medId) : null}
        meta={primarySelected ? effectiveMeta(primarySelected.medId, primarySelected.item) : {}}
        defaultDateTimeLocal={
          primarySelected ? `${primarySelected.item.date}T${primarySelected.item.time}` : "2024-12-11T12:00"
        }
      />

      <InfusionEndDialog
        open={infusionEndOpen}
        onClose={() => setInfusionEndOpen(false)}
        onSave={saveInfusionEnd}
        dose={primarySelected}
        med={primarySelected ? getMed(primarySelected.medId) : null}
        meta={primarySelected ? effectiveMeta(primarySelected.medId, primarySelected.item) : {}}
        SignedByBlock={SignedByBlock}
      />

      {/* Handover dialog */}
      <Dialog open={handoverOpen} onClose={() => setHandoverOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Handover (Överlämna)
          {selectedDoses.length > 1 ? ` (${selectedDoses.length})` : ""}
        </DialogTitle>

        <DialogContent dividers>
          <div className="mb-4 flex flex-wrap items-end gap-2">
            <TextField
              label="From"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={handoverFrom}
              onChange={(e) => setHandoverFrom(e.target.value)}
              size="small"
            />
            <TextField
              label="To"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={handoverTo}
              onChange={(e) => setHandoverTo(e.target.value)}
              size="small"
            />
            <Button variant="outlined" onClick={() => applyHandoverRangeUpdate(handoverFrom, handoverTo)} size="small">
              Update
            </Button>
            <div className="text-xs text-gray-500">
              Shows only doses within the selected time range.
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[260px_1fr]">
            <div className="rounded border border-gray-200 bg-white">
              <div className="border-b bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700">
                {selectedDoses.length > 1 ? "Selected doses" : "Ordered medication"}
              </div>

              <div className="p-3 text-xs text-gray-800 space-y-2">
                {selectedDoses.length <= 1 ? (
                  <>
                    <div className="font-semibold">
                      {selectedMed ? selectedMed.name : "—"}
                      {selectedMed?.strength ? (
                        <span className="font-normal text-gray-600"> • {selectedMed.strength}</span>
                      ) : null}
                    </div>

                    <div className="text-gray-700">{selectedMed?.dosingText ?? ""}</div>

                    <div className="rounded border border-gray-200 bg-gray-50 p-2">
                      <div className="text-[11px] text-gray-600">Dose</div>
                      <div className="font-semibold">
                        {primarySelected?.item?.date} {primarySelected?.item?.time}
                      </div>
                      <div className="text-gray-700">{primarySelected?.item?.label ?? ""}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-[11px] text-gray-500">
                      Showing: {handoverVisibleDoses.length} of {selectedDoses.length}
                    </div>

                    <div className="max-h-[340px] overflow-auto space-y-2">
                      {handoverVisibleDoses.length === 0 ? (
                        <div className="rounded border border-gray-200 bg-gray-50 p-2 text-gray-600">
                          No selected doses are within this time range. Adjust From/To and click Update.
                        </div>
                      ) : (
                        handoverVisibleDoses.map((d) => {
                          const k = doseRefKey(d);
                          const med = getMed(d.medId);
                          const name = med ? `${med.name}${med.strength ? ` • ${med.strength}` : ""}` : d.medId;
                          return (
                            <label key={k} className="flex items-start gap-2 rounded border border-gray-200 bg-gray-50 p-2">
                              <input
                                type="checkbox"
                                className="mt-0.5"
                                checked={handoverIncludedKeys[k] !== false}
                                onChange={(e) =>
                                  setHandoverIncludedKeys((prev) => ({ ...prev, [k]: e.target.checked }))
                                }
                              />
                              <div className="min-w-0">
                                <div className="font-semibold text-gray-900 truncate">{name}</div>
                                <div className="text-gray-700">
                                  {d.item.date} {d.item.time} — {d.item.label}
                                </div>
                              </div>
                            </label>
                          );
                        })
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <div className="grid grid-cols-1 gap-3">
                <FormControl size="small" fullWidth>
                  <InputLabel id="handover-to-label">Handover to</InputLabel>
                  <Select
                    labelId="handover-to-label"
                    label="Handover to"
                    value={handoverToId}
                    onChange={(e) => setHandoverToId(String(e.target.value))}
                  >
                    {MOCK_HANDOVER_TO.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Message / note"
                  size="small"
                  value={handoverNote}
                  onChange={(e) => setHandoverNote(e.target.value)}
                  multiline
                  minRows={6}
                  helperText="Keep it short: what to follow up, what to monitor, etc. (mock)"
                />

                {SignedByBlock}
              </div>
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setHandoverOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={saveHandover}
            disabled={!selectedDoses.length || handoverVisibleDoses.length === 0}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
