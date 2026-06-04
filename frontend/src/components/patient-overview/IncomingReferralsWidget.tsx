import type { Referral } from "../../features/patient-overview/types";

type Props = {
  referrals: Referral[];
  onOpenReferral: (r: Referral) => void;
};

export const IncomingReferralsWidget: React.FC<Props> = ({
  referrals,
  onOpenReferral,
}) => {
  return (
    <section className="rounded border border-gray-300 bg-white text-xs">
      {/* HEADER */}
      <header className="flex items-center justify-between border-b px-3 py-2">
        <span className="font-semibold text-[13px]">
          Incoming referrals
        </span>

        {/* count badge */}
        {referrals.length > 0 && (
          <span className="text-[11px] text-gray-500">
            {referrals.length}
          </span>
        )}
      </header>

      {/* LIST */}
      <div className="min-h-[200px] max-h-[400px] overflow-auto">
        {referrals.length === 0 ? (
          <div className="p-3 text-gray-500">
            No incoming referrals
          </div>
        ) : (
          referrals.map((r) => (
            <button
              key={r.id}
              onClick={() => onOpenReferral(r)}
              className="flex w-full justify-between gap-2 px-3 py-2 text-left hover:bg-blue-50"
            >
              {/* LEFT */}
              <div className="flex-1">
                <div className="font-semibold text-[11px] text-gray-900">
                  {r.from}
                </div>

                <div className="text-[11px] text-gray-600">
                  From: {r.sentByName ?? "-"} {r.sentByRole ? ` (${r.sentByRole})` : ""}
                </div>

                {r.hasAdditionalInfo && (
                  <div className="text-[11px] text-blue-700 underline mt-1">
                    Complementary answer
                  </div>
                )}
              </div>

              {/* RIGHT */}
              <div className="flex flex-col items-end text-[11px]">
                {/* STATUS */}
                <span
                    className={
                        "px-2 py-0.5 rounded-full text-[10px] font-semibold " +
                        (r.status === "Unassessed"
                        ? "bg-blue-100 text-blue-700"
                        : r.status === "Accepted"
                        ? "bg-green-100 text-green-700"
                        : r.status === "In progress"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-gray-100 text-gray-700")
                    }
                    >
                    {r.status}
                </span>

                {/* DATE */}
                <div className="text-gray-500">
                  {r.date}
                </div>

                {/* URGENT */}
                {r.urgent && (
                  <span className="mt-1 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                    Acute
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </section>
  );
};