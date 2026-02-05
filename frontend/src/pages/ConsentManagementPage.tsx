// src/pages/ConsentManagementPage.tsx
import { useMemo, useState } from "react";
import {
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
  Typography,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";

import RegisterConsentDialog from "../features/consent/dialogs/RegisterConsentDialog";
import {
  CONSENT_STATUS_OPTIONS,
  initialConsents,
} from "../features/consent/mockData";
import type { ConsentRecord, ConsentStatus } from "../features/consent/types";

/* UI HELPERS  */
/** Maps consent status → Chip presentation **/
function statusChipVariant(status: ConsentStatus) {
  switch (status) {
    case "Active":
      return { label: "Active", variant: "filled" as const };
    case "Ended":
      return { label: "Ended", variant: "outlined" as const };
    case "Upcoming":
      return { label: "Upcoming", variant: "outlined" as const };
    case "Cancelled":
      return { label: "Cancelled", variant: "outlined" as const };
  }
}

/* PAGE COMPONENT  */
export default function ConsentManagementPage() {
  /* State  */
  // Selected status filters (multi-select)
  const [statusFilter, setStatusFilter] = useState<ConsentStatus[]>(["Active"]);

  // Consent records (mock → later backend)
  const [consents, setConsents] =
    useState<ConsentRecord[]>(initialConsents);

  // Register dialog state
  const [registerOpen, setRegisterOpen] = useState(false);

  // Row action menu state
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuConsentId, setMenuConsentId] = useState<string | null>(null);

  /* Derived data, Filter consents by selected status */
  const filteredConsents = useMemo(() => {
    if (!statusFilter.length) return consents;
    return consents.filter((c) => statusFilter.includes(c.status));
  }, [consents, statusFilter]);


  /* Static card header model  */
  /* (Later can come from backend / patient context) */
  const cardModel = useMemo(() => {
    return {
      title: "Shared health record",
      organizationLine: "REGION EDUCATION, MEDICINE DIVISION",
    };
  }, []);

  /** Count of active consents (top-right indicator) */
  const activeCount = useMemo(
    () => consents.filter((c) => c.status === "Active").length,
    [consents]
  );

  /* Handlers */
  const openMenu = (e: React.MouseEvent<HTMLElement>, consentId: string) => {
    setMenuAnchor(e.currentTarget);
    setMenuConsentId(consentId);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuConsentId(null);
  };

  const updateConsentStatus = (id: string, status: ConsentStatus) => {
    setConsents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  /* RENDER */
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Consent management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Consent Management (Cambio-inspired)
          </Typography>
        </div>

        {/* Active consent indicator */}
        <div className="flex items-center gap-2">
          <Typography variant="body2" color="text.secondary">
            Active Consent:
          </Typography>
          <Chip label={String(activeCount)} size="small" />
        </div>
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-3">
        <Typography variant="body2" sx={{ width: 60 }}>
          Status
        </Typography>

        <Select
          multiple
          size="small"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as ConsentStatus[])
          }
          renderValue={(selected) =>
            (selected as string[]).join(", ")
          }
          sx={{ minWidth: 280, backgroundColor: "white" }}
        >
          {CONSENT_STATUS_OPTIONS.map((s) => (
            <MenuItem key={s} value={s}>
              <Checkbox checked={statusFilter.includes(s)} />
              <ListItemText primary={s} />
            </MenuItem>
          ))}
        </Select>
      </div>

      {/* Main consent card */}
      <div className="flex justify-center">
        <div className="w-full max-w-3xl rounded-lg border bg-white shadow-sm">
          {/* Card header */}
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <Typography variant="h6" sx={{ fontWeight: 650 }}>
                {cardModel.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {cardModel.organizationLine}
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

          {/* Table header */}
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
            {filteredConsents.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-gray-500">
                No consents match the filter.
              </div>
            ) : (
              filteredConsents.map((c) => {
                const chip = statusChipVariant(c.status);

                return (
                  <div key={c.id} className="px-6 py-3">
                    <div className="grid grid-cols-[1fr_1fr_140px_40px] items-center gap-4">
                      <div className="text-sm">{c.startDate}</div>
                      <div className="text-sm">{c.endDate}</div>

                      <Chip
                        label={chip.label}
                        variant={chip.variant}
                        size="small"
                        sx={{ textTransform: "none" }}
                      />

                      <div className="flex justify-end">
                        <IconButton
                          size="small"
                          onClick={(e) => openMenu(e, c.id)}
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

          {/* Footer hint */}
          <div className="px-6 py-6">
            <div className="inline-block rounded border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700">
              Here you can view the consents that apply to the care unit your
              login belongs to.
            </div>
          </div>
        </div>
      </div>

      {/* Row action menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
        <MenuItem
          onClick={() => {
            // Placeholder for future details page
            closeMenu();
          }}
        >
          View details
        </MenuItem>

        <MenuItem
          onClick={() => {
            if (menuConsentId)
              updateConsentStatus(menuConsentId, "Ended");
            closeMenu();
          }}
        >
          End consent
        </MenuItem>

        <MenuItem
          onClick={() => {
            if (menuConsentId)
              updateConsentStatus(menuConsentId, "Cancelled");
            closeMenu();
          }}
        >
          Cancel consent
        </MenuItem>
      </Menu>

      {/* Register consent dialog */}
      <RegisterConsentDialog
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onRegister={(newConsent) =>
          setConsents((prev) => [newConsent, ...prev])
        }
        organizationLine={cardModel.organizationLine}
      />
    </div>
  );
}
