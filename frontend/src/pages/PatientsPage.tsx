// src/pages/PatientsPage.tsx
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { usePatients } from "../hooks/patient/usePatients";
import { useAuth } from "../context/AuthContext";
import CreatePatientDialog from "../features/patient/dialogs/CreatePatientDialog";

import type { CreatePatientPayload, Patient, } from "../features/patient/types";

import { useCreatePatient } from "../hooks/patient/useCreatePatient";
import { useNurseScopedPatients } from "../hooks/nurse/useNurseScopedPatients";

export default function PatientsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [openCreate, setOpenCreate] = useState(false);

  const q = searchParams.get("q")?.toLowerCase().trim() || "";
  const scope = searchParams.get("scope");

  const { data: allPatients = [], isLoading } = usePatients();

  const { data: scopedPatients = [] } = useNurseScopedPatients(scope || undefined);

  const createPatientMutation = useCreatePatient();

  const patients = useMemo(() => {
    if (!(scope && user?.role === "Nurse")) {
      return allPatients;
    }

    return scopedPatients.map((p: any) => ({
      id: p.patientId ?? p.id,
      mrn: p.mrn ?? "-",
      firstName:
        p.firstName ??
        p.fullName?.split(" ")[0] ??
        p.patientName?.split(" ")[0] ??
        "",
      lastName:
        p.lastName ??
        p.fullName?.split(" ").slice(1).join(" ") ??
        p.patientName?.split(" ").slice(1).join(" ") ??
        "",
      phone: p.phone ?? "-",
      gender: p.gender ?? "unknown",

      urgent: p.urgent ?? false,
      alertType: p.alertType ?? null,
      overdue: p.overdue ?? false,
    }));
  }, [scope, user?.role, scopedPatients, allPatients]);

  const filteredPatients = useMemo(() => {
    const searched = !q
      ? patients
      : patients.filter((p: Patient) =>
          [
            p.mrn,
            p.phone,
            p.firstName,
            p.lastName,
            `${p.firstName} ${p.lastName}`,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(q)
            )
        );

    return [...searched].sort((a: any, b: any) => {
      const score = (p: any) =>
        p.urgent || p.alertType || p.overdue ? 1 : 0;

      const priorityDiff = score(b) - score(a);

      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      const nameA =
        `${a.firstName} ${a.lastName}`.toLowerCase();

      const nameB =
        `${b.firstName} ${b.lastName}`.toLowerCase();

      return nameA.localeCompare(nameB);
    });
  }, [patients, q]);

  const getPriorityBadge = (patient: any) => {
    if (
      patient.urgent ||
      patient.alertType ||
      patient.overdue
    ) {
      return (
        <span className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
          Critical
        </span>
      );
    }

    return (
      <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
        Normal
      </span>
    );
  };

  const getStatusLabel = (patient: any) => {
    if (patient.alertType) return patient.alertType;
    if (patient.overdue) return "Overdue";
    if (patient.urgent) return "Urgent referral";

    return "-";
  };

  const handleCreatePatient = ( form: Omit<CreatePatientPayload, "clinicId"> ) => {
    if (!user?.clinicId) return;

    createPatientMutation.mutate(
      {
        ...form,
        clinicId: user.clinicId,
      },
      {
       onSuccess: (createdPatient: any) => {
        navigate(`/patients/${createdPatient.id}`);
      }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="p-6">Loading patients...</div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Patients
          </h1>

          <p className="text-sm text-gray-500">
            {q
              ? `Search results for "${q}"`
              : "All patients"}
          </p>
        </div>

        <button
          onClick={() => setOpenCreate(true)}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          + New Patient
        </button>
      </div>

      {/* Table */}
      {filteredPatients.length === 0 ? (
        <div className="rounded-lg border bg-white p-6 text-gray-500">
          No patients found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3">MRN</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredPatients.map((patient: any) => (
                <tr
                  key={patient.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    {patient.mrn}
                  </td>

                  <td className="px-4 py-3">
                    {patient.firstName}{" "}
                    {patient.lastName}
                  </td>

                  <td className="px-4 py-3">
                    {patient.phone}
                  </td>

                  <td className="px-4 py-3 capitalize">
                    {patient.gender}
                  </td>

                  <td className="px-4 py-3">
                    {getPriorityBadge(patient)}
                  </td>

                  <td className="px-4 py-3">
                    {getStatusLabel(patient)}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() =>
                        navigate(
                          `/patients/${patient.id}`
                        )
                      }
                      className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create dialog */}
      <CreatePatientDialog
        open={openCreate}
        loading={createPatientMutation.isPending}
        onClose={() => setOpenCreate(false)}
        onSave={handleCreatePatient}
      />
    </div>
  );
}