// src/pages/PatientOverviewPage.tsx
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
import { useCreateOrder } from "../hooks/orders/useCreateOrder";
import { useUpdateOrder } from "../hooks/orders/useUpdateOrder";

import type {
  InfoSource,
  Referral,
  ReferralStatus,
  Order,
  OrderResult,
  ClinicalParameterName,
  FluidBalanceEntry,
  OrderForm,
  ClinicalUpdateForm,
} from "../features/patient-overview/types";

import {CONSCIOUSNESS_OPTIONS, } from "../features/patient-overview/mockData";
import { FluidBalanceDetailsDialog } from "../features/patient-overview/dialogs/FluidBalanceDetailsDialog";
import { AddFluidDialog } from "../features/patient-overview/dialogs/AddFluidDialog";
import { calcAlert, latestEntry,} from "../features/patient-overview/helpers";
import { usePatient } from "../hooks/patient/usePatient";
import { useOrders } from "../hooks/orders/useOrders";
import { mapUiCategoryToBackend } from "../api/utils/orderMapper";
import { useActiveEncounter } from "../hooks/encounter/useActiveEncounter";
import { toast } from "react-toastify";
import { useClinicalParameters } from "../hooks/journal/useClinicalParameters";
import { useCreateClinicalEntry } from "../hooks/journal/useCreateClinicalEntry"
// useCreateClinicalEntry";
import { buildClinicalParameterRows, mapClinicalEntriesToLogs } from "../features/patient-overview/mappers/clinical.mapper";
import { useMedications } from "../hooks/medications/useMedications";
import { useVaccinations } from "../hooks/vaccination/useVaccinations";
import { useReferrals } from "../hooks/referrals/useReferrals";
import { useUpdateReferralStatus } from "../hooks/referrals/useUpdateReferralStatus";
import { useCreateReferral } from "../hooks/referrals/useCreateReferral";
import { mapReferralToUi, mapUiStatusToBackend } from "../features/patient-overview/mappers/referral.mapper";
import { useCreateFluidBalance, useFluidBalance, } from "../hooks/encounter/useFluidBalance";
import { useLabResults } from "../hooks/labs/useLabResults";
import { useAuth } from "../context/AuthContext";
import { IncomingReferralsWidget } from "../components/patient-overview/IncomingReferralsWidget";

// -------------Page----------------
const PatientOverviewPage = () => {
  // ================== CORE ==================
  const { patientId } = useParams<{ patientId?: string }>();
  const navigate = useNavigate();

  const { data: patient, isLoading, isError } = usePatient(patientId);
  const { data: activeEncounter, isLoading: encounterLoading } = useActiveEncounter(patientId);
  const [infoSource, setInfoSource] = useState<InfoSource>("myUnit");

  const { user } = useAuth();

  // ================== ORDERS ==================
  const createOrderMutation = useCreateOrder();
  const updateOrderMutation = useUpdateOrder(activeEncounter?.id);

  const { data: orders = [] } = useOrders(activeEncounter?.id);

  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [openedOrder, setOpenedOrder] = useState<Order | null>(null);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);

  const [newOrder, setNewOrder] = useState<OrderForm>({
    category: "Chemistry",
    name: "",
    date: new Date().toLocaleDateString(),
  });

  // ================== LABS ==================
  const { data: labResultsRaw = [] } = useLabResults(patientId);

  // ================== REFERRALS ==================
  const { data: referralsRaw = [] } = useReferrals(patientId);

  const updateReferralMutation = useUpdateReferralStatus(patientId);
  const createReferralMutation = useCreateReferral({
    onSuccess: () => {
      setOpenAddReferralDialog(false);
    },
  });

  // const referrals = useMemo( () => referralsRaw.map(mapReferralToUi), [referralsRaw] );
  const referrals = useMemo(() => {
  console.log("=== RAW REFERRALS ===");
  console.log(referralsRaw);

  const mapped = referralsRaw.map(mapReferralToUi);

  console.log("=== MAPPED REFERRALS ===");
  console.log(mapped);

  return mapped;
}, [referralsRaw]);

  const [referralFilterAnchor, setReferralFilterAnchor] = useState<HTMLElement | null>(null);
  const [selectedReferralStatuses, setSelectedReferralStatuses] = useState< ReferralStatus[]>(["Unassessed", "Accepted", "In progress", "Completed"]);
  const allReferralStatuses: ReferralStatus[] = [ "Unassessed", "Accepted","In progress", "Completed", ];

  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [openAddReferralDialog, setOpenAddReferralDialog] = useState(false);

  // ================== MEDICATION ==================
  const { data: medications = [] } = useMedications(patientId);
  const { data: vaccinations = [] } = useVaccinations(patientId);

  // ================== CLINICAL ==================
  const { data: clinicalEntries = [] } = useClinicalParameters(activeEncounter?.id);
  const createClinicalMutation = useCreateClinicalEntry();

 
  const clinicalLogs = useMemo( () => mapClinicalEntriesToLogs(clinicalEntries), [clinicalEntries],);
  const clinicalParameters = useMemo( () => buildClinicalParameterRows(clinicalLogs),[clinicalLogs],); 

  // ================== FLUID ==================
  const { data: fluidRaw = [] } = useFluidBalance(patientId!);
  const createFluidMutation = useCreateFluidBalance();


// ================== UI STATE ==================
const [resultSearch, setResultSearch] = useState("");

const [openClinicalDialog, setOpenClinicalDialog] = useState(false);

const [openFluidDialog, setOpenFluidDialog] = useState(false);
const [editingFluid, setEditingFluid] = useState<FluidBalanceEntry | null>(null);

const [openClinicalLogDialog, setOpenClinicalLogDialog] = useState(false);
const [selectedClinicalName, setSelectedClinicalName] = useState<ClinicalParameterName>("NEWS2");

const [openClinicalUpdateDialog, setOpenClinicalUpdateDialog] = useState(false);

const [clinicalUpdateForm, setClinicalUpdateForm] =
  useState<ClinicalUpdateForm>({
    dateTime: new Date().toLocaleString(),
    value: "",
    note: "",
  });

const [fluidDayIndex, setFluidDayIndex] = useState(0);
const [openFluidDetails, setOpenFluidDetails] = useState(false);

// ================== DERIVED ==================
const incoming = useMemo(
  () => (referrals as Referral[]).filter((r) => r.toUnitId === user?.unitId),
  [referrals, user?.unitId]
);

const outgoing = useMemo(
  () => (referrals as Referral[]).filter((r) => r.fromUnitId === user?.unitId),
  [referrals, user?.unitId]
);

const filteredReferrals = useMemo(
  () =>
    outgoing.filter((r) =>
      selectedReferralStatuses.includes(r.status)
    ),
  [outgoing, selectedReferralStatuses]
);


const resultsForOrders = useMemo<OrderResult[]>(() => {
  return (labResultsRaw as any[]).map((r) => ({
    id: r.id,
    orderId: r.orderId,
    category: r.order?.category ?? "Other",
    name: r.order?.name ?? "",
    result: r.value,
    date: r.resultDate,
    flag: r.flag,
    status: "final",
    orderStatus: r.order?.status,
  }));
}, [labResultsRaw]);

const fluidBalanceEntries = useMemo<FluidBalanceEntry[]>(() => {
  return (fluidRaw as any[])
    .sort(
      (a, b) =>
        new Date(b.measuredAt).getTime() - new Date(a.measuredAt).getTime(),
    )
    .map((e: any) => ({
      id: e.id,
      label: e.label,
      period: e.period,
      intakeMl: e.intakeMl,
      outputMl: e.outputMl,
      balance: `${e.balanceMl >= 0 ? "+" : ""}${e.balanceMl} ml`,
      measuredAt: e.measuredAt,
      details: e.details,
    }));
}, [fluidRaw]);


// ================== REFERRALS ==================
const handleToggleReferralStatus = (status: ReferralStatus) => {
  setSelectedReferralStatuses((prev) =>
    prev.includes(status)
      ? prev.filter((s) => s !== status)
      : [...prev, status],
  );
};

const handleCreateReferral = (form: any) => {
  if (!patient) return;

  createReferralMutation.mutate({
    clinicId: patient.clinicId,
    patientId: patient.id,
    encounterId: activeEncounter?.id,
    toUnitId: form.toUnitId,
    fromClinicId: form.fromClinicId,
    fromUnitId: form.fromUnitId,
    sentByStaffId: form.sentByStaffId,
    urgent: form.urgent,
    hasAdditionalInfo: form.hasAdditionalInfo,
    details: form.details,
  });
};

const handleUpdateReferralStatus = (id: string, status: ReferralStatus) => {
  updateReferralMutation.mutate({
    id,
    status: mapUiStatusToBackend(status),
  });
};

// ================== ORDERS ==================
const openEditOrder = (order: Order) => {
  setEditingOrderId(order.id);

  setNewOrder({
    category: order.category ?? "",
    name: order.name ?? "",
    date: order.date ?? "",
    plannedDate: order.plannedDate ?? "",
    requester: order.requester ?? "",
    careContact: order.careContact,
    orderingUnit: order.orderingUnit,
    plannedTime: order.plannedTime,
    repeat: order.repeat ?? "Never",
    performer: order.performer ?? "",
    addition: order.addition ?? "",
    comment: order.comment ?? "",
  });

  setOpenOrderDialog(true);
};

const handleOpenOrder = (order: Order) => {
  setOpenedOrder(order);

  setNewOrder({
    category: order.category ?? "Chemistry",
    name: order.name ?? "",
    date: order.date ?? "",
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

// ================== CLINICAL ==================

const handleOpenClinicalLog = (name: ClinicalParameterName) => {
  setSelectedClinicalName(name);
  setOpenClinicalLogDialog(true);
};

const openUpdateDialogForName = (name: ClinicalParameterName) => {
  setSelectedClinicalName(name);
  const entry = latestEntry(clinicalLogs, name);

  setClinicalUpdateForm({
    dateTime: new Date().toLocaleString(),
    value: entry?.value ?? "",
    note: name === "SpO₂" ? entry?.note || "0 L" : entry?.note ?? "",
  });

  setOpenClinicalUpdateDialog(true);
};

const openUpdateDialogForSelected = () =>
  openUpdateDialogForName(selectedClinicalName);

const handleSaveClinicalUpdate = () => {
  if (!activeEncounter) return;

  const value = clinicalUpdateForm.value.trim();
  if (!value) return;

  const mapNameToBackend: Record<ClinicalParameterName, string> = {
    NEWS2: "NEWS2",
    AVPU: "consciousness",
    "Respiratory rate": "respiratory_rate",
    "SpO₂": "spo2",
    Pulse: "pulse",
    "Blood pressure": "blood_pressure",
    "Body temperature": "temperature",
  };

  createClinicalMutation.mutate({
    encounterId: activeEncounter.id,
    name: mapNameToBackend[selectedClinicalName],
    value,
    note: clinicalUpdateForm.note,
    recordedBy: "Current user",
  });

  setOpenClinicalUpdateDialog(false);
};


  // ================== FLUID ==================

// derived (belongs here, not global DERIVED)
const fluidDays = useMemo(() => {
  const grouped: Record<string, any[]> = {};

  fluidBalanceEntries.forEach((e: any) => {
    const day = new Date(e.measuredAt).toISOString().split("T")[0];

    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(e);
  });

  return Object.entries(grouped)
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([date, entries]) => {
      const totalIn = entries.reduce((s, e) => s + e.intakeMl, 0);
      const totalOut = entries.reduce((s, e) => s + e.outputMl, 0);

      return {
        date,
        title: `Fluid balance for ${date}`,
        totalIn,
        totalOut,
        balance: totalIn - totalOut,
        entries,
      };
    });
}, [fluidBalanceEntries]);

// navigation
const goPrevFluidDay = () =>
  setFluidDayIndex((i) => Math.min(i + 1, fluidDays.length - 1));

const goNextFluidDay = () =>
  setFluidDayIndex((i) => Math.max(i - 1, 0));

const goTodayFluidDay = () => setFluidDayIndex(0);

// handlers
  const openCreateFluid = () => {
    setEditingFluid(null);
    setOpenFluidDialog(true);
  };

  const openEditFluid = (id: string) => {
    const found = fluidBalanceEntries.find((x) => x.id === id) ?? null;
    setEditingFluid(found);
    setOpenFluidDialog(true);
  };

  const closeFluidDialog = () => {
    setOpenFluidDialog(false);
    setEditingFluid(null);
  };

  // For dialog defaults
  const defaultLabel = editingFluid?.label ?? "Today";
  const defaultPeriod = editingFluid?.period ?? "05:00–04:59";

  if (!patientId) return <div className="p-6">Select a patient</div>;
  if (isLoading) return <div className="p-6">Loading patient...</div>;
  if (isError || !patient) return <div className="p-6">Patient not found</div>;
  if (encounterLoading) return <div className="p-6">Loading encounter...</div>;

  return (
    <div className="space-y-4">
      {/* <EncounterHeader encounter={activeEncounter} /> */}

      <div className="flex items-start justify-between gap-3">
        <PatientBanner patient={patient} onHomeCareClick={() => {}} />

        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => navigate(`/patients/${patientId}/journal`)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Open Journal
          </button>

          <button
            onClick={() => navigate(`/patients/${patientId}/consents`)}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
          >
            Consent Management
          </button>
        </div>
      </div>
      <InfoSourceSelector
        value={infoSource}
        onChange={setInfoSource}
        onUpdate={() => {}}
      />

      {/* TOP ROW */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1.2fr)_minmax(0,1.2fr)]">
        {patientId && (
          <MedicationWidget
            medications={medications}
            vaccinations={vaccinations}
            patientId={patientId}
            clinicId={patient.clinicId} 
            encounterId={activeEncounter?.id} 
          />
        )}

        <OrdersWidget
          orders={orders}
          encounterId={activeEncounter?.id!}
          patientId={patientId!}
          onAddClick={() => {
            if (!activeEncounter) {
              toast.error("Start an encounter before placing orders");
              return;
            }
            setEditingOrderId(null);
            setOpenedOrder(null);
            setOpenOrderDialog(true);
          }}
          onEditOrder={openEditOrder}
          onOpenOrder={handleOpenOrder}
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
          onSelectIndex={(i) => setFluidDayIndex(i)}
          onOpenDetails={() => setOpenFluidDetails(true)}
        />

        <ResultsWidget
          results={resultsForOrders}
          search={resultSearch}
          onSearchChange={setResultSearch}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-1">
        <IncomingReferralsWidget
          referrals={incoming}
          onOpenReferral={setSelectedReferral}
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-1">
        {/* <CareOverviewWidget /> */}
      </div>

      {/* FLUID DETAILS (Cosmic-like) */}
      <FluidBalanceDetailsDialog
        open={openFluidDetails}
        day={
          fluidDays[fluidDayIndex] ?? {
            title: "No data",
            slots: [],
            rows: [],
            plannedMedicationFluids: [],
          }
        }
        entries={fluidDays[fluidDayIndex]?.entries ?? []}
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
        onClose={() => setOpenClinicalDialog(false)}
        onRegister={(form) => {
          if (!activeEncounter) return;

          const payloads = [
            { name: "NEWS2", value: form.news2 },
            { name: "respiratory_rate", value: form.respiratoryRate },
            {
              name: "spo2",
              value: form.oxygenSaturation,
              note: form.oxygenLiters,
            },
            { name: "pulse", value: form.pulseRate },
            { name: "temperature", value: form.temperature },
            {
              name: "blood_pressure",
              value: `${form.systolicBP}/${form.diastolicBP}`,
            },
            { name: "consciousness", value: form.consciousness },
          ];

          payloads.forEach((p) => {
            if (!p.value) return;

            createClinicalMutation.mutate({
              encounterId: activeEncounter.id,
              name: p.name,
              value: p.value,
              note: p.note,
              recordedBy: "Current user",
            });
          });

          setOpenClinicalDialog(false);
        }}
        consciousnessOptions={CONSCIOUSNESS_OPTIONS}
        user={user}
      />

      <AddOrderDialog
        open={openOrderDialog}
        mode={openedOrder ? "view" : editingOrderId ? "edit" : "create"}
        encounter={activeEncounter}
        editingOrder={openedOrder}

        onClose={() => {
          setOpenOrderDialog(false);
          setEditingOrderId(null);
          setOpenedOrder(null);
        }}

        onSave={(form) => {
          if (!patient || !activeEncounter) return;

          const payload = {
            patientId: patient.id,
            encounterId: activeEncounter.id,
            category: mapUiCategoryToBackend(form.category),
            code: form.name,
            name: form.name,
          };

          if (editingOrderId) {
            updateOrderMutation.mutate({
              id: editingOrderId,
              payload,
            });
          } else {
            createOrderMutation.mutate(payload);
          }

          setOpenOrderDialog(false);
        }}
      />

      <ReferralDetailsDialog
        referral={selectedReferral}
        onClose={() => setSelectedReferral(null)}
        onUpdateStatus={handleUpdateReferralStatus}
      />
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
        onSave={(data) => {
          if (!patient || !activeEncounter) return;

          createFluidMutation.mutate({
            patientId: patient.id,
            encounterId: activeEncounter.id,
            measuredAt: new Date(data.measuredAt),

            label: data.label,
            period: data.period,

            oralMl: data.oralMl,
            enteralMl: data.enteralMl,

            urineMl: data.urineMl,
            bleedingMl: data.bleedingMl,
            faecesMl: data.faecesMl,
            vomitingMl: data.vomitingMl,
          });

          closeFluidDialog();
        }}
      />
    </div>
  );
};

export default PatientOverviewPage;
