// src/pages/PatientsPage.tsx

import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { usePatients } from "../hooks/patient/usePatients";
import { useAuth } from "../context/AuthContext";
import CreatePatientDialog from "../features/patient/dialogs/CreatePatientDialog";
import type { CreatePatientPayload, Patient } from "../features/patient/types";
import { useCreatePatient } from "../hooks/patient/useCreatePatient";



export default function PatientsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [openCreate, setOpenCreate] = useState(false);

  const q = searchParams.get("q")?.toLowerCase().trim() || "";

  const { data: patients = [], isLoading } = usePatients();
  const createPatientMutation = useCreatePatient();

  const filteredPatients = useMemo(() => {
    const list = !q
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
              String(value).toLowerCase().includes(q)
            )
        );

    return [...list].sort(
      (a: Patient, b: Patient) => {
        const nameA =
          `${a.firstName} ${a.lastName}`.toLowerCase();

        const nameB =
          `${b.firstName} ${b.lastName}`.toLowerCase();

        return nameA.localeCompare(nameB);
      }
    );
  }, [patients, q]);

  const handleCreatePatient = (
    form: Omit<CreatePatientPayload, "clinicId">
  ) => {
    if (!user?.clinicId) return;

    createPatientMutation.mutate(
      {
        ...form,
        clinicId: user.clinicId,
      },
      {
        onSuccess: (createdPatient: Patient) => {
          setOpenCreate(false);
          navigate(`/patients/${createdPatient.id}`);
        },
      }
    );
  };

  if (isLoading) {
    return <div className="p-6">Loading patients...</div>;
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
                <th className="px-4 py-3 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredPatients.map(
                (patient: Patient) => (
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
                      {patient.phone || "-"}
                    </td>

                    <td className="px-4 py-3 capitalize">
                      {patient.gender}
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
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog */}
      <CreatePatientDialog
        open={openCreate}
        loading={createPatientMutation.isPending}
        onClose={() => setOpenCreate(false)}
        onSave={handleCreatePatient}
      />
    </div>
  );
}