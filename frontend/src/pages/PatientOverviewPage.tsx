// src/pages/PatientOverviewPage.tsx
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { PatientBanner } from "../components/patient-overview/PatientBanner";
import { InfoSourceSelector } from "../components/patient-overview/InfoSourceSelector";
import { MedicationWidget } from "../components/patient-overview/MedicationWidget";

import { ReferralsWidget } from "../components/patient-overview/ReferralsWidget";
import { OrdersWidget } from "../components/patient-overview/OrdersWidget";
import { ClinicalParametersWidget } from "../components/patient-overview/ClinicalParametersWidget";
import { FluidBalanceWidget } from "../components/patient-overview/FluidBalanceWidget";
import { ResultsWidget } from "../components/patient-overview/ResultsWidget";

import { ClinicalLogDialog } from "../features/patient-overview/dialogs/ClinicalLogDialog";
import { ClinicalUpdateDialog } from "../features/patient-overview/dialogs/ClinicalUpdateDialog";
import { ClinicalRegisterDialog } from "../features/patient-overview/dialogs/ClinicalRegisterDialog";
import { AddOrderDialog } from "../features/patient-overview/dialogs/AddOrderDialog";
import { ReferralDetailsDialog } from "../features/patient-overview/dialogs/ReferralDetailsDialog";
import { AddReferralDialog } from "../features/patient-overview/dialogs/AddReferralDialog";
import { CareOverviewWidget } from "../components/patient-overview/CareOverviewWidget";

import type {
  InfoSource,
  Referral,
  ReferralStatus,
  Order,
  OrderResult,
  ClinicalParameter,
  ClinicalParameterName,
  ClinicalLogEntry,
  FluidBalanceEntry,
  OrderForm,
  ClinicalRegisterForm,
  ClinicalUpdateForm,
} from "../features/patient-overview/types";

import {
  CONSCIOUSNESS_OPTIONS,
  MOCK_CLINICAL_LOGS,
  MOCK_FLUID_BALANCE,
  MOCK_ORDER_RESULTS,
  MOCK_REFERRALS,
  MOCK_ORDERS,
  MOCK_CARE_CONTACTS,
} from "../features/patient-overview/mockData";

import {
  FluidBalanceDetailsDialog,
  type FluidBalanceDayModel,
} from "../features/patient-overview/dialogs/FluidBalanceDetailsDialog";

import { AddFluidDialog } from "../features/patient-overview/dialogs/AddFluidDialog";
import { calcAlert, FLUID_SLOTS, latestEntry, makeFluidDayMock } from "../features/patient-overview/helpers";

// -----------------------------
// Helpers
// -----------------------------


const toDisplayValue = (name: ClinicalParameterName, entry?: ClinicalLogEntry) => {
  if (!entry) return "-";
  switch (name) {
    case "Respiratory rate":
      return `${entry.value} / min`;
    case "SpO₂":
      return `${entry.value} % (${entry.note ?? "0 L"})`;
    case "Pulse":
      return `${entry.value} / min`;
    case "Blood pressure":
      return `${entry.value} mmHg`;
    case "Body temperature":
      return `${entry.value} °C`;
    default:
      return entry.value;
  }
};

// -----------------------------
// Fluid balance details mock (Cosmic-like table)
// -----------------------------


// -----------------------------
// Page
// -----------------------------
const PatientOverviewPage = () => {
  const { patientId } = useParams<{ patientId?: string }>();

  const patient = {
    id: patientId ?? "19 141414-1414",
    name: "Testsson, Namn",
    age: 78,
    unit: "Stroke ward",
  };

  const [infoSource, setInfoSource] = useState<InfoSource>("myUnit");

  // Referrals
  const [referrals, setReferrals] = useState<Referral[]>(MOCK_REFERRALS);
  const [referralFilterAnchor, setReferralFilterAnchor] = useState<HTMLElement | null>(null);
  const [selectedReferralStatuses, setSelectedReferralStatuses] = useState<ReferralStatus[]>([
    "Unassessed",
    "Accepted",
    "In progress",
    "Completed",
  ]);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const allReferralStatuses: ReferralStatus[] = ["Unassessed", "Accepted", "In progress", "Completed"];
  const [openAddReferralDialog, setOpenAddReferralDialog] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  const handleToggleReferralStatus = (status: ReferralStatus) => {
    setSelectedReferralStatuses((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]));
  };

  const filteredReferrals = useMemo(
    () => referrals.filter((r) => selectedReferralStatuses.includes(r.status)),
    [referrals, selectedReferralStatuses]
  );

  // Orders + results
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [orderResults, setOrderResults] = useState<OrderResult[]>(MOCK_ORDER_RESULTS);
  const [resultSearch, setResultSearch] = useState("");

  // Clinical
  const [clinicalLogs, setClinicalLogs] = useState<Record<ClinicalParameterName, ClinicalLogEntry[]>>(MOCK_CLINICAL_LOGS);

  const clinicalParameters: ClinicalParameter[] = useMemo(() => {
    const names: ClinicalParameterName[] = [
      "NEWS2",
      "AVPU",
      "Respiratory rate",
      "SpO₂",
      "Pulse",
      "Blood pressure",
      "Body temperature",
    ];

    return names.map((name) => {
      const latest = latestEntry(clinicalLogs, name);
      return {
        name,
        value: toDisplayValue(name, latest),
        date: latest?.dateTime ?? "-",
        alert: name === "NEWS2" ? calcAlert("NEWS2", latest?.value ?? "") : false,
      };
    });
  }, [clinicalLogs]);

  // Fluid entries (registered values)
  const [fluidBalanceEntries, setFluidBalanceEntries] = useState<FluidBalanceEntry[]>(MOCK_FLUID_BALANCE);

  // Fluid details dialog mock days
  const fluidDays = useMemo<FluidBalanceDayModel[]>(
    () => [
      makeFluidDayMock({
        title: "Fluid balance for 04-15 06:00 – 04-16 05:59",
        oralMl: 100,
        medFluidMl: 1000,
        totalOutMl: 500,
        planned: [
          { name: "Cloxacillin Stragen", volumeMl: 100 },
          { name: "Paracetamol Fresenius Kabi", volumeMl: null, isStarred: true },
        ],
      }),
      makeFluidDayMock({
        title: "Fluid balance for 04-14 06:00 – 04-15 05:59",
        oralMl: 0,
        medFluidMl: 1000,
        totalOutMl: 300,
        planned: [{ name: "Planned from medication", volumeMl: 100 }],
      }),
    ],
    []
  );

  const [fluidDayIndex, setFluidDayIndex] = useState(0);
  const [openFluidDetails, setOpenFluidDetails] = useState(false);

  const goPrevFluidDay = () => setFluidDayIndex((i) => Math.max(0, i - 1));
  const goNextFluidDay = () => setFluidDayIndex((i) => Math.min(fluidDays.length - 1, i + 1));
  const goTodayFluidDay = () => setFluidDayIndex(0);

  // Dialog state
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [openClinicalDialog, setOpenClinicalDialog] = useState(false);

  // Fluid register/edit dialog
  const [openFluidDialog, setOpenFluidDialog] = useState(false);
  const [editingFluid, setEditingFluid] = useState<FluidBalanceEntry | null>(null);

  const [openClinicalLogDialog, setOpenClinicalLogDialog] = useState(false);
  const [selectedClinicalName, setSelectedClinicalName] = useState<ClinicalParameterName>("NEWS2");

  const [openClinicalUpdateDialog, setOpenClinicalUpdateDialog] = useState(false);
  const [clinicalUpdateForm, setClinicalUpdateForm] = useState<ClinicalUpdateForm>({
    dateTime: new Date().toLocaleString(),
    value: "",
    note: "",
  });

  // Forms
  const [newOrder, setNewOrder] = useState<OrderForm>({
    category: "Chemistry",
    name: "",
    orderedBy: "",
    date: new Date().toLocaleDateString(),
  });

  const [newClinicalForm, setNewClinicalForm] = useState<ClinicalRegisterForm>({
    dateTime: new Date().toLocaleString(),
    news2: "",
    respiratoryRate: "",
    oxygenSaturation: "",
    hasOxygen: "no",
    oxygenLiters: "",
    systolicBP: "",
    diastolicBP: "",
    pulseRate: "",
    temperature: "",
    consciousness: "Alert",
    note: "",
  });

  // Handlers
const handleSaveOrder = () => {
  if (!newOrder.name.trim()) return;

  // EDIT MODE
  if (editingOrderId) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === editingOrderId
          ? {
              ...o,
              category: newOrder.category,
              name: newOrder.name,
              orderedBy: newOrder.orderedBy || o.orderedBy,
              date: newOrder.date || o.date,

              careContact: newOrder.careContact,
              orderingUnit: newOrder.orderingUnit,
              plannedDate: newOrder.plannedDate,
              plannedTime: newOrder.plannedTime,
              repeat: newOrder.repeat,
              requester: newOrder.requester,
              performer: newOrder.performer,
              addition: newOrder.addition,
              comment: newOrder.comment,

              dateTime:
                newOrder.plannedDate && newOrder.plannedTime
                  ? `${newOrder.plannedDate} ${newOrder.plannedTime}`
                  : o.dateTime,
            }
          : o
      )
    );

    // Update only PENDING result rows to match (safe + realistic)
    setOrderResults((prev) =>
      prev.map((r) =>
        r.orderId === editingOrderId && r.status === "pending"
          ? { ...r, category: newOrder.category, name: newOrder.name }
          : r
      )
    );

    setEditingOrderId(null);
    setOpenOrderDialog(false);
    return;
  }

  // CREATE MODE
  const orderId = `order-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const createdOrder: Order = {
    id: orderId,
    category: newOrder.category,
    name: newOrder.name,
    orderedBy: newOrder.orderedBy || "Unknown unit",
    date: newOrder.date,

    careContact: newOrder.careContact,
    orderingUnit: newOrder.orderingUnit,
    plannedDate: newOrder.plannedDate,
    plannedTime: newOrder.plannedTime,
    repeat: newOrder.repeat,
    requester: newOrder.requester,
    performer: newOrder.performer,
    addition: newOrder.addition,
    comment: newOrder.comment,

    dateTime:
      newOrder.plannedDate && newOrder.plannedTime
        ? `${newOrder.plannedDate} ${newOrder.plannedTime}`
        : undefined,
  };

  setOrders((prev) => [createdOrder, ...prev]);

  setOrderResults((prev) => [
    {
      id: `res-${orderId}`,
      orderId,
      category: createdOrder.category,
      name: createdOrder.name,
      status: "pending",
      result: "",
      date: createdOrder.date,
    },
    ...prev,
  ]);

  setOpenOrderDialog(false);
};

  const openEditOrder = (order: Order) => {
  setEditingOrderId(order.id);

  // Prefill the same form you use for new order
  setNewOrder({
    category: order.category ?? "Chemistry",
    name: order.name ?? "",
    orderedBy: order.orderedBy ?? "",
    date: order.date ?? new Date().toLocaleDateString(),

    careContact: order.careContact,
    orderingUnit: order.orderingUnit,
    plannedDate: order.plannedDate,
    plannedTime: order.plannedTime,
    repeat: order.repeat ?? "Never",
    requester: order.requester ?? "",
    performer: order.performer ?? "",
    addition: order.addition ?? "",
    comment: order.comment ?? "",
  });

  setOpenOrderDialog(true);
};

  const resultsForOrders = useMemo<OrderResult[]>(() => {
  const byOrderId = new Map(orderResults.map((r) => [r.orderId, r]));

  return orders.map((o) => {
    const existing = byOrderId.get(o.id);
    if (existing) return existing;

    return {
      id: `pending-${o.id}`,
      orderId: o.id,
      category: o.category,
      name: o.name,
      status: "pending",
      result: "",
      date: o.date,
    };
  });
}, [orders, orderResults]);

  const handleSaveClinical = () => {
    const f = newClinicalForm;

    const append = (name: ClinicalParameterName, value: string, note?: string) => {
      if (!value.trim()) return;

      setClinicalLogs((prev) => {
        const list = prev[name] ?? [];
        return {
          ...prev,
          [name]: [
            ...list,
            {
              dateTime: f.dateTime,
              value: value.trim(),
              enteredBy: "Johan Svärd",
              note: note?.trim() ? note.trim() : undefined,
            },
          ],
        };
      });
    };

    append("NEWS2", f.news2);
    append("Respiratory rate", f.respiratoryRate);
    append("SpO₂", f.oxygenSaturation, f.hasOxygen === "yes" ? `${f.oxygenLiters || "?"} L` : "0 L");

    if (f.systolicBP.trim() || f.diastolicBP.trim()) {
      append("Blood pressure", `${f.systolicBP || "?"}/${f.diastolicBP || "?"}`);
    }

    append("Pulse", f.pulseRate);
    append("Body temperature", f.temperature);
    append("AVPU", f.consciousness);

    setOpenClinicalDialog(false);
  };

  const handleOpenClinicalLog = (name: ClinicalParameterName) => {
    setSelectedClinicalName(name);
    setOpenClinicalLogDialog(true);
  };

  const openUpdateDialogForName = (name: ClinicalParameterName) => {
    setSelectedClinicalName(name);
    const entry = latestEntry(clinicalLogs, name);
    const defaultValue = entry?.value ?? "";
    const defaultNote = entry?.note ?? "";
    setClinicalUpdateForm({
      dateTime: new Date().toLocaleString(),
      value: defaultValue,
      note: name === "SpO₂" ? defaultNote || "0 L" : defaultNote,
    });
    setOpenClinicalUpdateDialog(true);
  };

  const openUpdateDialogForSelected = () => openUpdateDialogForName(selectedClinicalName);

  const handleSaveClinicalUpdate = () => {
    const v = clinicalUpdateForm.value.trim();
    if (!v) return;

    setClinicalLogs((prev) => {
      const list = prev[selectedClinicalName] ?? [];
      const next: ClinicalLogEntry = {
        dateTime: clinicalUpdateForm.dateTime,
        value: v,
        enteredBy: "Johan Svärd",
        note: clinicalUpdateForm.note.trim() ? clinicalUpdateForm.note.trim() : undefined,
      };
      return { ...prev, [selectedClinicalName]: [...list, next] };
    });

    setOpenClinicalUpdateDialog(false);
  };

  const handleCreateReferral = (newReferral: Referral) => {
    setReferrals((prev) => [newReferral, ...prev]);
  };

  const handleUpdateReferralStatus = (id: string, status: ReferralStatus) => {
    setReferrals((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };


  // -----------------------------
  // Fluid handlers (create/edit)
  // -----------------------------
  const openCreateFluid = () => {
    setEditingFluid(null);
    setOpenFluidDialog(true);
  };

  const openEditFluid = (id: string) => {
    const found = fluidBalanceEntries.find((x) => x.id === id) ?? null;
    setEditingFluid(found);
    setOpenFluidDialog(true);
  };

  const handleSaveFluidEntry = (entry: FluidBalanceEntry) => {
    setFluidBalanceEntries((prev) => {
      const exists = prev.some((x) => x?.id === entry.id);
      return exists ? prev.map((x) => (x.id === entry.id ? entry : x)) : [entry, ...prev];
    });
    setOpenFluidDialog(false);
    setEditingFluid(null);
  };

  const closeFluidDialog = () => {
    setOpenFluidDialog(false);
    setEditingFluid(null);
  };

  // For dialog defaults
  const defaultLabel = editingFluid?.label ?? "Today";
  const defaultPeriod = editingFluid?.period ?? "05:00–04:59";

  return (
    <div className="space-y-4">
      <PatientBanner patient={patient} onHomeCareClick={() => {}} />

      <InfoSourceSelector value={infoSource} onChange={setInfoSource} onUpdate={() => {}} />

      {/* TOP ROW */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1.2fr)_minmax(0,1.2fr)]">
        <MedicationWidget />

        <OrdersWidget
          orders={orders}
          onAddClick={() => {
            setEditingOrderId(null); // ensure new mode
            setOpenOrderDialog(true);
          }}
          onEditOrder={openEditOrder}
        />

        <ReferralsWidget
          filteredReferrals={filteredReferrals}
          allReferralStatuses={allReferralStatuses}
          selectedReferralStatuses={selectedReferralStatuses}
          onToggleStatus={handleToggleReferralStatus}
          onOpenReferral={setSelectedReferral}
          referralFilterAnchor={referralFilterAnchor}
          onOpenFilter={(el) => setReferralFilterAnchor(el)}
          onCloseFilter={() => setReferralFilterAnchor(null)}
          onAddClick={() => setOpenAddReferralDialog(true)}
        />
      </div>

      {/* SECOND ROW */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ClinicalParametersWidget
          rows={clinicalParameters}
          onAddClick={() => setOpenClinicalDialog(true)}
          onOpenLog={handleOpenClinicalLog}
          onRequestUpdate={openUpdateDialogForName}
        />

        <FluidBalanceWidget
          entries={fluidBalanceEntries}
          onAddClick={openCreateFluid}
          onOpenDetails={() => setOpenFluidDetails(true)}
          onPrev={() => {
            goPrevFluidDay();
            setOpenFluidDetails(true);
          }}
          onNext={() => {
            goNextFluidDay();
            setOpenFluidDetails(true);
          }}
        />

        <ResultsWidget  results={resultsForOrders} search={resultSearch} onSearchChange={setResultSearch} />
      </div>

      <div className="grid gap-4 lg:grid-cols-1">
        <CareOverviewWidget entries={MOCK_CARE_CONTACTS} />
      </div>

      {/* FLUID DETAILS (Cosmic-like) */}
      <FluidBalanceDetailsDialog
        open={openFluidDetails}
        day={fluidDays[fluidDayIndex]}
        entries={fluidBalanceEntries}
        onClose={() => setOpenFluidDetails(false)}
        onPrev={goPrevFluidDay}
        onNext={goNextFluidDay}
        onToday={goTodayFluidDay}
        onRegister={openCreateFluid}
        onEditEntry={openEditFluid}
      />

      {/* DIALOGS */}
      <ClinicalLogDialog
        open={openClinicalLogDialog}
        name={selectedClinicalName}
        entries={clinicalLogs[selectedClinicalName] ?? []}
        isNews2Alert={(raw) => calcAlert("NEWS2", raw)}
        onClose={() => setOpenClinicalLogDialog(false)}
        onUpdateClick={openUpdateDialogForSelected}
      />

      <ClinicalUpdateDialog
        open={openClinicalUpdateDialog}
        name={selectedClinicalName}
        form={clinicalUpdateForm}
        setForm={setClinicalUpdateForm}
        onClose={() => setOpenClinicalUpdateDialog(false)}
        onSave={handleSaveClinicalUpdate}
      />

      <ClinicalRegisterDialog
        open={openClinicalDialog}
        form={newClinicalForm}
        setForm={setNewClinicalForm}
        consciousnessOptions={CONSCIOUSNESS_OPTIONS}
        onClose={() => setOpenClinicalDialog(false)}
        onRegister={handleSaveClinical}
      />

      <AddOrderDialog
        open={openOrderDialog}
        form={newOrder}
        setForm={setNewOrder}
        onClose={() => {
          setOpenOrderDialog(false);
          setEditingOrderId(null);
        }}
        onSave={handleSaveOrder}
        mode={editingOrderId ? "edit" : "create"} // add this prop (next section)
      />

      <ReferralDetailsDialog referral={selectedReferral} onClose={() => setSelectedReferral(null)} onUpdateStatus={handleUpdateReferralStatus} />
      <AddReferralDialog
        open={openAddReferralDialog}
        onClose={() => setOpenAddReferralDialog(false)}
        onSave={handleCreateReferral}
      />

      {/* REGISTER / EDIT FLUID DIALOG */}
      <AddFluidDialog
        open={openFluidDialog}
        label={defaultLabel}
        period={defaultPeriod}
        editing={editingFluid}
        onClose={closeFluidDialog}
        onSave={handleSaveFluidEntry}
      />
    </div>
  );
};

export default PatientOverviewPage;
