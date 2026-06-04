// src/pages/ConsentManagementPage.tsx
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Checkbox,
  Chip,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { toast } from "react-toastify";

import { useAuth } from "../context/AuthContext";
import RegisterConsentDialog from "../features/consent/dialogs/RegisterConsentDialog";
import type {
  ConsentRecord,
  ConsentStatus,
} from "../features/consent/types";
import { useConsents } from "../hooks/consent/useConsents";
import { useCreateConsent } from "../hooks/consent/useCreateConsent";
import { useUpdateConsentStatus } from "../hooks/consent/useUpdateConsentStatus";

const STATUS_OPTIONS: ConsentStatus[] = [
  "active",
  "ended",
  "upcoming",
  "cancelled",
];

const formatLabel = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const normalizeStatus = (status: string) =>
  status.toLowerCase() as ConsentStatus;

const getChipVariant = (status: ConsentStatus) =>
  status === "active" ? "filled" : "outlined";

export default function ConsentManagementPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const { user } = useAuth();

  const [statusFilter, setStatusFilter] = useState<ConsentStatus[]>([
    "active",
  ]);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [selectedConsentId, setSelectedConsentId] = useState<string | null>(
    null
  );

  const {
    data: consents = [],
    isLoading,
    refetch,
  } = useConsents(patientId);

  const createConsent = useCreateConsent();
  const updateConsent = useUpdateConsentStatus();

  const organizationLine = user?.unitName
    ? `Somali Clinic - ${user.unitName}`
    : "Somali Clinic";

  const filteredConsents = useMemo(() => {
    if (!statusFilter.length) return consents;

    return consents.filter((consent) =>
      statusFilter.includes(normalizeStatus(consent.status))
    );
  }, [consents, statusFilter]);

  const activeCount = useMemo(
    () =>
      consents.filter(
        (consent) => normalizeStatus(consent.status) === "active"
      ).length,
    [consents]
  );

  const openMenu = (
    event: React.MouseEvent<HTMLElement>,
    consentId: string
  ) => {
    setMenuAnchor(event.currentTarget);
    setSelectedConsentId(consentId);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setSelectedConsentId(null);
  };

  const handleCreate = async (
    payload: Omit<
      ConsentRecord,
      "id" | "status" | "clinicId" | "patientId"
    >
  ) => {
    if (!patientId || !user?.clinicId) return;

    try {
      await createConsent.mutateAsync({
        ...payload,
        clinicId: user.clinicId,
        patientId,
      });

      toast.success("Consent created");
      setRegisterOpen(false);
      refetch();
    } catch {
      toast.error("Failed to create consent");
    }
  };

  const handleStatusUpdate = async (status: ConsentStatus) => {
    if (!selectedConsentId) return;

    try {
      await updateConsent.mutateAsync({
        id: selectedConsentId,
        status,
      });

      toast.success("Consent updated");
      closeMenu();
      refetch();
    } catch {
      toast.error("Failed to update consent");
    }
  };

  if (!patientId) {
    return (
      <div className="p-6 text-sm text-red-600">
        Patient ID missing
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Consent management
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Manage patient consents
          </Typography>
        </div>

        <div className="flex items-center gap-2">
          <Typography variant="body2" color="text.secondary">
            Active:
          </Typography>

          <Chip label={String(activeCount)} size="small" />
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Typography variant="body2" sx={{ width: 60 }}>
          Status
        </Typography>

        <Select
          multiple
          size="small"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as ConsentStatus[])
          }
          renderValue={(selected) =>
            (selected as string[]).map(formatLabel).join(", ")
          }
          sx={{
            minWidth: 280,
            backgroundColor: "white",
          }}
        >
          {STATUS_OPTIONS.map((status) => (
            <MenuItem key={status} value={status}>
              <Checkbox checked={statusFilter.includes(status)} />
              <ListItemText primary={formatLabel(status)} />
            </MenuItem>
          ))}
        </Select>
      </div>

      {/* Card */}
      <div className="flex justify-center">
        <div className="w-full max-w-3xl rounded-lg border bg-white shadow-sm">
          {/* Card Header */}
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <Typography variant="h6" sx={{ fontWeight: 650 }}>
                Shared health record
              </Typography>

              <Typography variant="caption" color="text.secondary">
                {organizationLine}
              </Typography>
            </div>

            <Button
              startIcon={<AddIcon />}
              onClick={() => setRegisterOpen(true)}
              sx={{ textTransform: "none" }}
            >
              Register consent
            </Button>
          </div>

          {/* Table Header */}
          <div className="border-t bg-gray-50 px-6 py-2">
            <div className="grid grid-cols-[1fr_1fr_140px_40px] gap-4 text-xs text-gray-600">
              <div>Start date</div>
              <div>End date</div>
              <div>Status</div>
              <div />
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y">
            {isLoading ? (
              <div className="px-6 py-10 text-center text-sm text-gray-500">
                Loading...
              </div>
            ) : filteredConsents.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-gray-500">
                No consents found.
              </div>
            ) : (
              filteredConsents.map((consent) => {
                const status = normalizeStatus(consent.status);

                return (
                  <div key={consent.id} className="px-6 py-3">
                    <div className="grid grid-cols-[1fr_1fr_140px_40px] items-center gap-4">
                      <div className="text-sm">{consent.startDate}</div>

                      <div className="text-sm">{consent.endDate}</div>

                      <Chip
                        label={formatLabel(status)}
                        variant={getChipVariant(status)}
                        size="small"
                      />

                      <div className="flex justify-end">
                        <IconButton
                          size="small"
                          onClick={(event) =>
                            openMenu(event, consent.id)
                          }
                        >
                          <MoreHorizIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-6">
            <div className="inline-block rounded border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700">
              Here you can view consents for the selected patient.
            </div>
          </div>
        </div>
      </div>

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
      >
        <MenuItem onClick={closeMenu}>View details</MenuItem>
        <MenuItem onClick={() => handleStatusUpdate("ended")}>
          End consent
        </MenuItem>
        <MenuItem onClick={() => handleStatusUpdate("cancelled")}>
          Cancel consent
        </MenuItem>
      </Menu>

      {/* Register Dialog */}
      <RegisterConsentDialog
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onRegister={handleCreate}
        organizationLine={organizationLine}
      />
    </div>
  );
}