// src/components/dashboard/ReferralsSummaryCard.tsx
import React, { useMemo } from "react";
import type { ReferralDirection, ReferralItem, SummaryCardModel } from "../../features/dashboard/types";
import { SummaryCard } from "./SummaryCard";

type Props = {
  title: string;
  direction: ReferralDirection;
  referrals: ReferralItem[];
  onOpen: () => void;
};

export const ReferralsSummaryCard: React.FC<Props> = ({ title, direction, referrals, onOpen }) => {
  const model: SummaryCardModel = useMemo(() => {
    const list = referrals.filter((r) => r.direction === direction);

    const count = (status: any) => list.filter((r) => r.status === status).length;

    const rows = [
      { label: "Saved", value: count("Saved"), muted: count("Saved") === 0 },
      { label: "Not assessed", value: count("Not assessed"), muted: count("Not assessed") === 0 },
      { label: "Under assessment", value: count("Under assessment"), muted: count("Under assessment") === 0 },
      { label: "Accepted", value: count("Accepted"), muted: count("Accepted") === 0 },
      { label: "Ongoing", value: count("Ongoing"), muted: count("Ongoing") === 0 },
    ];

    return {
      title,
      totalText: `Total: ${list.length}`,
      rows,
      onOpenLabel: "Open referrals list",
    };
  }, [referrals, direction, title]);

  return <SummaryCard model={model} onOpen={onOpen} />;
};
