// src/features/patient/dialogs/CreatePatientDialog.tsx

import { useMemo, useState, useEffect } from "react";

import CloseIcon from "@mui/icons-material/Close";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import BadgeIcon from "@mui/icons-material/Badge";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import CakeIcon from "@mui/icons-material/Cake";
import WcIcon from "@mui/icons-material/Wc";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import FingerprintIcon from "@mui/icons-material/Fingerprint";

type Props = {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onSave: (data: {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    phone?: string;
    email?: string;
    nationalId?: string;
  }) => void;
};

export default function CreatePatientDialog({
  open,
  loading = false,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "male",
    dateOfBirth: "",
    phone: "",
    email: "",
    nationalId: "",
  });

  const [touched, setTouched] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setTouched(false);
      setForm({
        firstName: "",
        lastName: "",
        gender: "male",
        dateOfBirth: "",
        phone: "",
        email: "",
        nationalId: "",
      });
    }
  }, [open]);

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const age = useMemo(() => {
    if (!form.dateOfBirth) return "";

    const dob = new Date(form.dateOfBirth);
    const now = new Date();

    let years = now.getFullYear() - dob.getFullYear();
    const monthDiff = now.getMonth() - dob.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && now.getDate() < dob.getDate())
    ) {
      years--;
    }

    return years >= 0 ? `${years} years` : "";
  }, [form.dateOfBirth]);

  const errors = {
    firstName: !form.firstName.trim(),
    lastName: !form.lastName.trim(),
    dateOfBirth: !form.dateOfBirth,
  };

  const hasErrors =
    errors.firstName ||
    errors.lastName ||
    errors.dateOfBirth;

  const handleSubmit = () => {
    setTouched(true);

    if (hasErrors) return;

    onSave({
      ...form,
      phone: form.phone || undefined,
      email: form.email || undefined,
      nationalId: form.nationalId || undefined,
    });
  };

  const inputClass = (invalid?: boolean) =>
    `h-11 w-full rounded-md border px-3 text-sm outline-none transition ${
      invalid
        ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
        : "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    }`;

  const labelClass =
    "mb-1 flex items-center gap-2 text-sm font-medium text-gray-700";

  // ✅ AFTER hooks
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[95vh] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-blue-700 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white/15 p-2">
              <PersonAddAlt1Icon />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Register New Patient
              </h2>
              <p className="text-xs text-blue-100">
                Create patient record in clinic registry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-md p-2 hover:bg-white/10"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[75vh] overflow-y-auto bg-gray-50 p-6">
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            {/* Left */}
            <div className="space-y-6">
              <section className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold uppercase text-gray-500">
                  Identity Information
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>
                      <BadgeIcon fontSize="small" />
                      First name *
                    </label>

                    <input
                      className={inputClass(
                        touched && errors.firstName
                      )}
                      value={form.firstName}
                      onChange={(e) =>
                        update("firstName", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      <BadgeIcon fontSize="small" />
                      Last name *
                    </label>

                    <input
                      className={inputClass(
                        touched && errors.lastName
                      )}
                      value={form.lastName}
                      onChange={(e) =>
                        update("lastName", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      <WcIcon fontSize="small" />
                      Gender
                    </label>

                    <select
                      className={inputClass()}
                      value={form.gender}
                      onChange={(e) =>
                        update("gender", e.target.value)
                      }
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      <CakeIcon fontSize="small" />
                      Date of birth *
                    </label>

                    <input
                      type="date"
                      className={inputClass(
                        touched && errors.dateOfBirth
                      )}
                      value={form.dateOfBirth}
                      onChange={(e) =>
                        update("dateOfBirth", e.target.value)
                      }
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold uppercase text-gray-500">
                  Contact Details
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>
                      <PhoneIphoneIcon fontSize="small" />
                      Phone
                    </label>

                    <input
                      className={inputClass()}
                      value={form.phone}
                      onChange={(e) =>
                        update("phone", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      <MailOutlineIcon fontSize="small" />
                      Email
                    </label>

                    <input
                      className={inputClass()}
                      value={form.email}
                      onChange={(e) =>
                        update("email", e.target.value)
                      }
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold uppercase text-gray-500">
                  Additional Identifier
                </h3>

                <label className={labelClass}>
                  <FingerprintIcon fontSize="small" />
                  National ID
                </label>

                <input
                  className={inputClass()}
                  value={form.nationalId}
                  onChange={(e) =>
                    update("nationalId", e.target.value)
                  }
                />
              </section>
            </div>

            {/* Right */}
            <div className="space-y-6">
              <section className="rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold uppercase text-gray-500">
                  Preview
                </h3>

                <div className="space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                    {form.firstName?.[0] || "?"}
                    {form.lastName?.[0] || ""}
                  </div>

                  <div>
                    <p className="font-semibold">
                      {form.firstName || "First"}{" "}
                      {form.lastName || "Last"}
                    </p>

                    <p className="text-sm text-gray-500">
                      {form.gender}
                      {age ? ` • ${age}` : ""}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                    MRN generated automatically after save.
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t bg-white px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-md bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Create Patient"}
          </button>
        </div>
      </div>
    </div>
  );
}