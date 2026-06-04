// src/components/dashboard/ReferralsSummaryCard.tsx
import React, { useMemo } from "react";
import type {
  ReferralDirection,
  ReferralItem,
} from "../../features/dashboard/types";

type Props = {
  title: string;
  direction: ReferralDirection;
  referrals: ReferralItem[];
  onOpen?: () => void;
};

export const ReferralsSummaryCard: React.FC<Props> = ({
  title,
  direction,
  referrals,
  onOpen,
}) => {
  const { list, rows } = useMemo(() => {
    const filtered = referrals.filter((r) => r.direction === direction);

    const count = (status: string) =>
      filtered.filter((r) => r.status === status).length;

    return {
      list: filtered,
      rows: [
        { label: "Unassessed", value: count("Unassessed") },
        { label: "Accepted", value: count("Accepted") },
        { label: "In progress", value: count("In progress") },
        { label: "Completed", value: count("Completed") },
      ],
    };
  }, [referrals, direction]);

  return (
    <section className="rounded border border-gray-300 bg-white">
      {/* HEADER */}
      <header
        className={`flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-1.5 text-[13px] font-semibold ${
          onOpen ? "cursor-pointer hover:bg-gray-100" : ""
        }`}
        onClick={onOpen}
      >
        <span>{title}</span>
        <span className="text-gray-500">Total: {list.length}</span>
      </header>

      {/* ROWS */}
      <div className="grid grid-cols-[1fr_auto] gap-y-1 px-3 py-2 text-xs">
        {rows.map((r) => (
          <React.Fragment key={r.label}>
            <span className={r.value === 0 ? "text-gray-400" : ""}>
              {r.label}
            </span>
            <span
              className={`text-right font-medium ${
                r.value === 0 ? "text-gray-400" : ""
              }`}
            >
              {r.value}
            </span>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};