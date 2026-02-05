// src/pages/MedicationsPage.tsx
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import type {
  MedicationTabKey,
  PresentationMode,
  MedicationScheduleItem,
  AdministrationStatus,
  Medication,
  NutritionStatusFilter,
} from "../features/medications/types";
import { favoriteTemplatesMock, medicationGroupsMock } from "../features/medications/mockData";

import { MedicationsTabs } from "../components/medications/medication-core/MedicationsTabs";
import { MedicationsToolbar } from "../components/medications/medication-core/MedicationsToolbar";
import { MedicationListTable } from "../components/medications/medication-core/MedicationListTable";
import { MedicationScheduleGrid } from "../components/medications/medication-core/MedicationScheduleGrid";

import { DispensingView } from "../components/medications/dispensing/DispensingView";

import { VaccinationsToolbar } from "../components/medications/vaccinations/VaccinationsToolbar";
import { VaccinationsView } from "../components/medications/vaccinations/VaccinationsView";

// Nutrition
import { NutritionToolbar } from "../components/medications/nutrition/NutritionToolbar";
import { NutritionProductsView } from "../components/medications/nutrition/NutritionProductsView";
import { PrescriptionOverviewView } from "../components/medications/prescriptions/PrescriptionOverviewView";

// NEW tab (Cosmic-like)
import { NewOrdersView } from "../components/medications/new/NewOrdersView";

const MOCK_START_DATE = "2024-12-11";

/** Key for overrides (stable for PRN via uid) */
function doseKey(medId: string, item: MedicationScheduleItem) {
  if (item.uid) return `${medId}|${item.uid}`;
  return `${medId}|${item.date}|${item.time}|${item.label ?? ""}`;
}

/** Use "now" time but keep mock date so it shows in your current mock window */
function roundedNowTimeHHmm(stepMin = 15) {
  const d = new Date();
  const h = String(d.getHours()).padStart(2, "0");
  const mRaw = d.getMinutes();
  const mRounded = Math.floor(mRaw / stepMin) * stepMin;
  const m = String(mRounded).padStart(2, "0");
  return `${h}:${m}`;
}

function makePrnDose(params: {
  action: "add" | "prepare" | "administer" | "selfAdmin";
  doseLabel?: string;
  comment?: string;
}): MedicationScheduleItem {
  const time = roundedNowTimeHHmm(15);

  const status: AdministrationStatus =
    params.action === "prepare"
      ? "prepared"
      : params.action === "selfAdmin"
      ? "selfAdmin"
      : params.action === "administer"
      ? "given"
      : "planned";

  const label =
    (params.doseLabel && params.doseLabel.trim()) ||
    (params.action === "prepare" ? "Prepared PRN" : "PRN dose");

  const tooltipParts = [
    `PRN dose`,
    `Time: ${MOCK_START_DATE} ${time}`,
    `Status: ${status}`,
    params.comment?.trim() ? `Comment: ${params.comment.trim()}` : "",
  ].filter(Boolean);

  return {
    uid: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    date: MOCK_START_DATE,
    time,
    label,
    status,
    tooltip: tooltipParts.join(" • "),
  };
}

type SelectedDose = {
  medId: string;
  item: MedicationScheduleItem;
  key: string;
};

const MedicationsPage = () => {
  const [tab, setTab] = useState<MedicationTabKey>("medicationList");
  const [mode, setMode] = useState<PresentationMode>("small");

  // meds
  const [sort, setSort] = useState("nameAsc");
  const [selectedMedId, setSelectedMedId] = useState<string | null>(null);

  // vaccinations
  const [vaxSort, setVaxSort] = useState("atcAsc");

  // nutrition
  const [nutritionFrom, setNutritionFrom] = useState("2023-07-21");
  const [nutritionTo, setNutritionTo] = useState("2025-01-21");
  const [nutritionStatus, setNutritionStatus] =
    useState<NutritionStatusFilter>("valid");

  /**
   * ✅ Base meds dataset (mutable).
   * groups below is derived from this + PRN extras + overrides.
   */
  const [baseGroups, setBaseGroups] = useState(() =>
    medicationGroupsMock.map((g: any) => ({
      ...g,
      items: (g.items ?? []).map((m: any) => ({
        ...m,
        schedule: (m.schedule ?? []).map((s: any) => ({ ...s })),
      })),
    }))
  );

  /**
   * Shared state for Medication list tab
   * - PRN-created doses
   * - status overrides
   */
  const [prnExtraDosesByMed, setPrnExtraDosesByMed] = useState<
    Record<string, MedicationScheduleItem[]>
  >({});
  const [doseStatusOverrides, setDoseStatusOverrides] = useState<
    Record<string, AdministrationStatus>
  >({});

  // Dose selection (for bottom actions like Dispensing view)
  const [selectedDose, setSelectedDose] = useState<SelectedDose | null>(null);

  // Administer dialog (for PRN/injections mock)
  const [adminDialog, setAdminDialog] = useState<{
    open: boolean;
    action: "administer" | "selfAdmin";
    medId: string | null;
    doseKey: string | null;
  }>({ open: false, action: "administer", medId: null, doseKey: null });

  const [adminDoseText, setAdminDoseText] = useState("");
  const [adminBatch, setAdminBatch] = useState("");
  const [adminComment, setAdminComment] = useState("");
  const [adminReason, setAdminReason] = useState("");

  const groups = useMemo(() => {
    // clone + sort
    const clone = baseGroups.map((g: any) => ({
      ...g,
      items: (g.items ?? []).map((m: any) => ({ ...m })),
    }));

    clone.forEach((g: any) => {
      g.items.sort((a: any, b: any) => {
        if (sort === "nameAsc")
          return (a.name + (a.strength ?? "")).localeCompare(
            b.name + (b.strength ?? "")
          );
        if (sort === "nameDesc")
          return (b.name + (b.strength ?? "")).localeCompare(
            a.name + (a.strength ?? "")
          );
        if (sort === "startDateAsc") return a.startDate.localeCompare(b.startDate);
        if (sort === "startDateDesc") return b.startDate.localeCompare(a.startDate);
        return 0;
      });

      // merge schedules + PRN extra doses + apply overrides
      g.items = g.items.map((m: any) => {
        const base = (m.schedule ?? []).map((s: any) => ({ ...s }));
        const extra = (prnExtraDosesByMed[m.id] ?? []).map((s) => ({ ...s }));

        const merged = [...base, ...extra].map((s) => {
          const k = doseKey(m.id, s);
          const override = doseStatusOverrides[k];
          return override ? { ...s, status: override } : s;
        });

        merged.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

        return { ...m, schedule: merged };
      });
    });

    return clone as any;
  }, [baseGroups, sort, prnExtraDosesByMed, doseStatusOverrides]);

  const allMeds = useMemo(() => groups.flatMap((g: any) => g.items), [groups]);

  function findMedication(medId: string): Medication | undefined {
    return allMeds.find((m: any) => m.id === medId);
  }

  /** Called from MedicationListTable when user right-clicks PRN and picks an action */
  function createPrnDose(
    medId: string,
    action: "add" | "prepare" | "administer" | "selfAdmin",
    doseLabel?: string,
    comment?: string
  ) {
    const item = makePrnDose({ action, doseLabel, comment });

    setPrnExtraDosesByMed((prev) => {
      const arr = prev[medId] ? [...prev[medId]] : [];
      arr.push(item);
      return { ...prev, [medId]: arr };
    });

    setDoseStatusOverrides((prev) => ({
      ...prev,
      [doseKey(medId, item)]: item.status ?? "planned",
    }));
  }

  function setDoseStatus(
    medId: string,
    item: MedicationScheduleItem,
    status: AdministrationStatus
  ) {
    const k = doseKey(medId, item);
    setDoseStatusOverrides((prev) => ({ ...prev, [k]: status }));
  }

  function updatePrnDoseLabelAndTooltip(
    medId: string,
    item: MedicationScheduleItem,
    newLabel: string,
    extraTooltip?: string
  ) {
    if (!item.uid) return; // only PRN-created items are editable here

    setPrnExtraDosesByMed((prev) => {
      const arr = prev[medId] ? [...prev[medId]] : [];
      const next = arr.map((x) => {
        if (x.uid !== item.uid) return x;

        const tooltip =
          (x.tooltip ? x.tooltip : `PRN dose • Time: ${x.date} ${x.time}`) +
          (extraTooltip?.trim() ? ` • ${extraTooltip.trim()}` : "");

        return { ...x, label: newLabel, tooltip };
      });
      return { ...prev, [medId]: next };
    });
  }

  // bottom actions like Dispensing view
  function onSkip() {
    if (!selectedDose) return;
    setDoseStatus(selectedDose.medId, selectedDose.item, "notNeeded");
  }

  function onPrepare() {
    if (!selectedDose) return;
    setDoseStatus(selectedDose.medId, selectedDose.item, "prepared");
  }

  function openAdminDialog(action: "administer" | "selfAdmin") {
    if (!selectedDose) return;

    const med = findMedication(selectedDose.medId);
    const requiresDose =
      med?.group === "prn" || selectedDose.item.label.toLowerCase().includes("prn");

    // If not PRN, mimic quick admin (no modal)
    if (!requiresDose) {
      setDoseStatus(
        selectedDose.medId,
        selectedDose.item,
        action === "selfAdmin" ? "selfAdmin" : "given"
      );
      return;
    }

    // PRN flow: require administered dose
    setAdminDoseText("");
    setAdminBatch("");
    setAdminComment("");
    setAdminReason("");
    setAdminDialog({
      open: true,
      action,
      medId: selectedDose.medId,
      doseKey: selectedDose.key,
    });
  }

  function saveAdminDialog() {
    if (!adminDialog.medId || !adminDialog.doseKey) return;
    if (!adminDoseText.trim()) return;

    // mark status
    const status: AdministrationStatus =
      adminDialog.action === "selfAdmin" ? "selfAdmin" : "given";

    // find currently selected dose (should match the dialog key)
    const sd = selectedDose && selectedDose.key === adminDialog.doseKey ? selectedDose : null;
    if (sd) {
      setDoseStatus(sd.medId, sd.item, status);

      // mimic Cosmic: pill label becomes administered dose text (e.g., "2mg", "2.5 ml")
      updatePrnDoseLabelAndTooltip(
        sd.medId,
        sd.item,
        adminDoseText.trim(),
        [
          adminBatch.trim() ? `Batch: ${adminBatch.trim()}` : "",
          adminComment.trim() ? `Comment: ${adminComment.trim()}` : "",
          adminReason.trim() ? `Reason: ${adminReason.trim()}` : "",
        ]
          .filter(Boolean)
          .join(" • ")
      );
    }

    setAdminDialog({ open: false, action: "administer", medId: null, doseKey: null });
  }

  // ----------------------------
  // ✅ NEW TAB: Add template to groups
  // ----------------------------

  function pickTargetGroupIndex(groupsArr: any[]) {
    const idx = groupsArr.findIndex((g) => String(g.key ?? "").toLowerCase() === "current");
    if (idx >= 0) return idx;

    const idx2 = groupsArr.findIndex((g) => {
      const t = String(g.title ?? g.name ?? "").toLowerCase();
      return t.includes("current") || t.includes("aktuell");
    });

    return idx2 >= 0 ? idx2 : 0;
  }

  function labelFromDosing(dosing?: string) {
    const d = (dosing ?? "").toLowerCase();
    if (d.includes("1000") && d.includes("ml")) return "1000 ml";
    if (d.includes("0,5") || d.includes("0.5")) return "0.5 tab";
    if (d.includes("2 tablet")) return "2 tab";
    if (d.includes("1 tablett") || d.includes("1 tabl") || d.includes("1 depott")) return "1 tab";
    if (d.includes("1 kaps") || d.includes("1 cap")) return "1 cap";
    return "Enligt schema";
  }

  function defaultTimesForTemplate(t: any): string[] {
    const dosing = String(t?.dosing ?? "").toLowerCase();
    const form = String(t?.form ?? "").toLowerCase();

    if (form.includes("infusion") || dosing.includes("ml")) return ["14:45"];
    if (dosing.includes("x 4")) return ["08:00", "12:00", "16:00", "20:00"];
    if (dosing.includes("x 3")) return ["08:00", "14:00", "20:00"];
    if (dosing.includes("x 2")) return ["08:00", "20:00"];

    // like your Cosmic dots example
    return ["12:00", "16:00", "08:00"];
  }

  function templateToMedication(templateId: string): Medication | null {
    const t = favoriteTemplatesMock.find((x) => x.id === templateId);
    if (!t) return null;

    const id = `tpl_${t.id}`;
    const name = t.product || t.templateName || "New medication";
    const strength = t.strength || undefined;
    const dosingText = t.dosing || "Enligt schema";

    const times = defaultTimesForTemplate(t);
    const label = labelFromDosing(t.dosing);

    const schedule: MedicationScheduleItem[] = times.map((time) => ({
      date: MOCK_START_DATE,
      time,
      label,
      status: "planned",
      tooltip: `${name}${strength ? ` ${strength}` : ""} • ${MOCK_START_DATE} ${time} • Template: ${t.templateName}`,
    }));

    const med: Medication = {
      id,
      group: "current", // important: shows in list + dispensing
      name,
      strength,
      dosingText,
      startDate: MOCK_START_DATE,
      tooltip: `Created from template: ${t.templateName} (${t.treatmentReason})`,
      schedule,
    };

    return med;
  }

  function addFromTemplate(templateId: string, opts?: { openList?: boolean }) {
    const med = templateToMedication(templateId);
    if (!med) return;
    
    // prevent duplicates
    let didAdd = false;

    setBaseGroups((prev) => {
      const exists = prev.some((g: any) => (g.items ?? []).some((m: any) => m.id === med.id));
      if (exists) return prev;
      
      didAdd = true;
      const next = prev.map((g: any) => ({ ...g, items: [...(g.items ?? [])] }));
      const gi = pickTargetGroupIndex(next);
      next[gi].items.push(med);
      return next;
    });

    setSelectedMedId(med.id);
    if (med.schedule?.[0]) {
      setSelectedDose({ medId: med.id, item: med.schedule[0], key: doseKey(med.id, med.schedule[0]) });
    }

    if (opts?.openList) setTab("medicationList");
    // Toasts
    const templateName =
      favoriteTemplatesMock.find((x) => x.id === templateId)?.templateName ??
      "Order";

    if (!didAdd) {
      toast.info(`Already added: ${templateName}`);
      return;
    }

    if (opts?.openList) {
      toast.success(`Signed & added: ${templateName}`);
    } else {
      toast.success(`Signed & added: ${templateName}`);
    }
  }

  return (
    <div className="space-y-3">
      {/* header + tabs */}
      <div className="rounded border border-gray-300 bg-white">
        <div className="border-b border-gray-200 px-3 py-2">
          <div className="text-sm font-semibold text-gray-900">Medications</div>
          <div className="text-[12px] text-gray-600">
            Medication list + schedule (mock v1)
          </div>
        </div>

        <MedicationsTabs value={tab} onChange={setTab} />

        {/* toolbar per tab */}
        {tab === "vaccinations" ? (
          <VaccinationsToolbar
            mode={mode}
            onModeChange={setMode}
            sort={vaxSort}
            onSortChange={setVaxSort}
          />
        ) : tab === "nutritionProducts" ? (
          <NutritionToolbar
            from={nutritionFrom}
            to={nutritionTo}
            status={nutritionStatus}
            onFromChange={setNutritionFrom}
            onToChange={setNutritionTo}
            onStatusChange={setNutritionStatus}
            onUpdate={() => {}}
          />
        ) : (
          <MedicationsToolbar
            mode={mode}
            onModeChange={setMode}
            sort={sort}
            onSortChange={setSort}
          />
        )}
      </div>

      {/* main */}
      <div className="rounded border border-gray-300 bg-white">
        {tab === "medicationList" ? (
          <div className="grid h-[520px] grid-cols-[minmax(380px,0.9fr)_minmax(0,1.6fr)]">
            <MedicationListTable
              groups={groups}
              presentation={mode}
              selectedId={selectedMedId}
              onSelect={(id) => {
                setSelectedMedId(id);
              }}
              onPrnCreateDose={createPrnDose}
            />

            <MedicationScheduleGrid
              groups={groups}
              selectedMedicationId={selectedMedId}
              selectedDoseKey={selectedDose?.key ?? null}
              onSelectDose={(medId, item) => {
                setSelectedMedId(medId);
                setSelectedDose({ medId, item, key: doseKey(medId, item) });
              }}
              onSkip={onSkip}
              onPrepare={onPrepare}
              onAdminister={() => openAdminDialog("administer")}
              onSelfAdmin={() => openAdminDialog("selfAdmin")}
            />

            {/* Admin dialog (PRN) — MUI look like Dispensing view mock */}
            {adminDialog.open ? (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
                <div className="w-full max-w-3xl rounded bg-white shadow-lg">
                  <div className="border-b px-6 py-4 text-lg font-semibold">
                    {adminDialog.action === "selfAdmin"
                      ? "Self-administer"
                      : "Administer"}
                  </div>

                  <div className="grid gap-4 p-6 md:grid-cols-2">
                    <div>
                      <div className="text-xs text-gray-500">Time</div>
                      <div className="rounded border px-3 py-2 text-sm">
                        {MOCK_START_DATE} {selectedDose?.item.time ?? ""}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500">Medication</div>
                      <div className="rounded border px-3 py-2 text-sm">
                        {adminDialog.medId
                          ? findMedication(adminDialog.medId)?.name ?? ""
                          : ""}
                      </div>
                    </div>

                    <div className="md:col-span-1">
                      <label className="block text-xs text-gray-500">
                        Administered dose
                      </label>
                      <input
                        className="mt-1 w-full rounded border px-3 py-2 text-sm outline-none focus:border-blue-500"
                        value={adminDoseText}
                        onChange={(e) => setAdminDoseText(e.target.value)}
                        placeholder="e.g. 2mg / 2.5 ml"
                      />
                      <div className="mt-1 text-[12px] text-gray-500">
                        For PRN/injections: enter volume/dose (mock).
                      </div>
                    </div>

                    <div className="md:col-span-1">
                      <label className="block text-xs text-gray-500">
                        Batch number
                      </label>
                      <input
                        className="mt-1 w-full rounded border px-3 py-2 text-sm outline-none focus:border-blue-500"
                        value={adminBatch}
                        onChange={(e) => setAdminBatch(e.target.value)}
                        placeholder="(optional)"
                      />
                    </div>

                    <div className="md:col-span-1">
                      <label className="block text-xs text-gray-500">
                        Comment
                      </label>
                      <textarea
                        className="mt-1 h-28 w-full resize-none rounded border px-3 py-2 text-sm outline-none focus:border-blue-500"
                        value={adminComment}
                        onChange={(e) => setAdminComment(e.target.value)}
                        placeholder="(optional)"
                      />
                    </div>

                    <div className="md:col-span-1">
                      <label className="block text-xs text-gray-500">
                        Reason (if deviating)
                      </label>
                      <textarea
                        className="mt-1 h-28 w-full resize-none rounded border px-3 py-2 text-sm outline-none focus:border-blue-500"
                        value={adminReason}
                        onChange={(e) => setAdminReason(e.target.value)}
                        placeholder="(optional)"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <div className="text-xs text-gray-500">
                        Log (mock): who signed, when, etc.
                      </div>
                      <div className="mt-1 h-28 rounded border bg-gray-50" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 border-t px-6 py-4">
                    <button
                      className="rounded px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
                      onClick={() =>
                        setAdminDialog({
                          open: false,
                          action: "administer",
                          medId: null,
                          doseKey: null,
                        })
                      }
                    >
                      CANCEL
                    </button>
                    <button
                      className={
                        "rounded px-5 py-2 text-sm text-white " +
                        (adminDoseText.trim()
                          ? "bg-blue-700 hover:bg-blue-800"
                          : "bg-blue-300")
                      }
                      disabled={!adminDoseText.trim()}
                      onClick={saveAdminDialog}
                    >
                      SAVE
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : tab === "dispensingView" ? (
          <div className="h-[520px]">
            <DispensingView groups={groups} />
          </div>
        ) : tab === "vaccinations" ? (
          <div className="h-[520px]">
            <VaccinationsView presentation={mode} sort={vaxSort} />
          </div>
        ) : tab === "prescriptionOverview" ? (
          <div className="h-[520px]">
            <PrescriptionOverviewView groups={groups} presentation={mode} />
          </div>
        ) : tab === "nutritionProducts" ? (
          <div className="h-[520px]">
            <NutritionProductsView
              from={nutritionFrom}
              to={nutritionTo}
              status={nutritionStatus}
            />
          </div>
        ) : tab === "new" ? (
          <div className="h-[520px]">
            <NewOrdersView
              onSign={(templateId) => {
                addFromTemplate(templateId);
              }}
              onSignAndOpenList={(templateId) => {
                addFromTemplate(templateId, { openList: true });
              }}
            />
          </div>
        ) : (
          <div className="px-4 py-6 text-sm text-gray-600">
            Placeholder for tab: <span className="font-semibold">{tab}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationsPage;
