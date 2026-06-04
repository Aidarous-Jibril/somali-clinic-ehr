import React from "react";

import SamplingStatusBadge from "./SamplingStatusBadge";
import TubeGroupPanel from "./TubeGroupPanel";
import type { SamplingWorklistItem } from "../../features/sampling/types";


type Props = {
  sample: SamplingWorklistItem | null;
};

const SamplingDetails: React.FC<Props> = ({ sample,}) => {
    console.log("sample:", sample)
  return (
    <section className="rounded border border-gray-300 bg-white">
      <header className="border-b border-gray-200 px-3 py-2">
        <div className="text-[13px] font-semibold">
          Ordered analyses / investigations
        </div>

        <div className="text-[11px] text-gray-500">
          {sample
            ? `${sample.patientName} • ${sample.orderingUnit}`
            : "Select an item"}
        </div>
      </header>

      <div className="p-3">
        {!sample ? (
          <div className="text-[11px] text-gray-500">
            Pick an item from the worklist.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-gray-600">
                Status:
              </span>

              <SamplingStatusBadge
                status={sample?.status}
              />
            </div>

            <div className="text-[11px]">
              <span className="font-semibold">
                Sample type:
              </span>{" "}
              {sample.sampleType}
            </div>

            <div className="text-[11px]">
              <span className="font-semibold">
                Barcode:
              </span>{" "}
              {sample.barcode || "-"}
            </div>

            {sample.tubeGroups?.length ? (
              sample.tubeGroups.map(
                (group) => (
                  <TubeGroupPanel
                    key={group.id}
                    group={group}
                  />
                )
              )
            ) : (
              <div className="rounded border border-dashed border-gray-300 p-4 text-[11px] text-gray-500">
                No analyses available yet.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SamplingDetails;