// src/components/patient-overview/ReferralsWidget.tsx
import React from "react";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Popover,
  Tooltip,
} from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";

import type {
  Referral,
  ReferralStatus,
} from "../../features/patient-overview/types";

/* ================ PROPS ================== */
type Props = {
  filteredReferrals: Referral[];
  allReferralStatuses: ReferralStatus[];
  selectedReferralStatuses: ReferralStatus[];

  onToggleStatus: (status: ReferralStatus) => void;
  onOpenReferral: (referral: Referral) => void;

  referralFilterAnchor: HTMLElement | null;
  onOpenFilter: (anchorEl: HTMLElement) => void;
  onCloseFilter: () => void;

  onAddClick?: () => void;
};


/* ================ COMPONENT ================== */
export const ReferralsWidget: React.FC<Props> = ({
  filteredReferrals,
  allReferralStatuses,
  selectedReferralStatuses,
  onToggleStatus,
  onOpenReferral,
  referralFilterAnchor,
  onOpenFilter,
  onCloseFilter,
  onAddClick,
}) => {
  return (
    <>
      {/* ========= MAIN CARD ========= */}
      <section className="rounded border border-gray-300 bg-white text-xs">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
          <span className="text-[13px] font-semibold">Referrals</span>

          <div className="flex items-center gap-1">
            <Tooltip title="Filter">
              <IconButton
                size="small"
                sx={{ color: "#1f2937" }}
                onClick={(e) => onOpenFilter(e.currentTarget)}
              >
                <FilterListIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Add referral">
              <IconButton
                size="small"
                sx={{ color: "#1d4ed8" }}
                onClick={onAddClick}
                disabled={!onAddClick}
              >
                <AddCircleOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        </header>

        {/* List */}
        <div className="max-h-64 overflow-auto divide-y divide-gray-200">
          {filteredReferrals.length === 0 ? (
            <div className="px-3 py-3 text-[11px] text-gray-500">
              No referrals match current filter.
            </div>
          ) : (
            filteredReferrals.map((referral) => (
              <button
                key={referral.id}
                type="button"
                onClick={() => onOpenReferral(referral)}
                className="flex w-full items-stretch gap-2 bg-white px-3 py-2 text-left hover:bg-blue-50"
              >
                {/* Left: Referral info */}
                <div className="flex-1">
                  <div className="text-[11px] font-semibold text-gray-900">
                    To: {referral.to}
                  </div>
                  <div className="text-[11px] text-gray-600">
                    From: {referral.from}
                  </div>
                  <div className="text-[11px] text-gray-600">
                    Sent by: {referral.sentByName} ({referral.sentByRole})
                  </div>

                  {referral.hasAdditionalInfo && (
                    <div
                      className="mt-1 text-[11px] text-blue-700 underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenReferral(referral);
                      }}
                    >
                      Complementary answer
                    </div>
                  )}
                </div>

                {/* Right: Status */}
                <div className="flex flex-col items-end justify-between text-[11px]">
                  <div
                    className={
                      "font-semibold " +
                      (referral.status === "Unassessed"
                        ? "text-blue-700"
                        : referral.status === "Accepted"
                        ? "text-green-700"
                        : referral.status === "In progress"
                        ? "text-orange-700"
                        : "text-gray-700")
                    }
                  >
                    {referral.status}
                  </div>

                  <div className="text-gray-600">{referral.date}</div>

                  {referral.urgent && (
                    <span className="mt-1 inline-flex rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                      Acute
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </section>

      {/* ========= FILTER POPOVER ========= */}
      <Popover
        open={Boolean(referralFilterAnchor)}
        anchorEl={referralFilterAnchor}
        onClose={onCloseFilter}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <div className="min-w-[180px] px-3 py-2 text-xs">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-semibold text-gray-800">
              Filter by referral status
            </span>
            <IconButton size="small" onClick={onCloseFilter}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>

          <FormGroup>
            {allReferralStatuses.map((status) => (
              <FormControlLabel
                key={status}
                control={
                  <Checkbox
                    size="small"
                    checked={selectedReferralStatuses.includes(status)}
                    onChange={() => onToggleStatus(status)}
                  />
                }
                label={status}
                sx={{
                  ".MuiFormControlLabel-label": { fontSize: "11px" },
                }}
              />
            ))}
          </FormGroup>
        </div>
      </Popover>
    </>
  );
};
