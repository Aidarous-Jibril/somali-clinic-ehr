// //src/components/laboratory/LaboratoryDetails.tsx
// import React from "react";

// import LaboratoryStatusBadge from "./LaboratoryStatusBadge";
// import type { LaboratoryWorklistItem } from "../../features/laboratory/types";
// import WorklistStatusBadge from "../worklist/WorklistStatusBadge";

// type Props = {
//   sample: LaboratoryWorklistItem | null;
// };

// const LaboratoryDetails: React.FC<Props> = ({ sample }) => {
//   return (
//     <section className="rounded border border-gray-300 bg-white">
//       <header className="border-b border-gray-200 px-3 py-2">
//         <div className="text-[13px] font-semibold">
//           Ordered analyses / investigations
//         </div>

//         <div className="text-[11px] text-gray-500">
//           {sample ? `${sample.patientName} • ${sample.orderingUnit}` : "Select an item"}
//         </div>
//       </header>

//       <div className="p-3">
//         {!sample ? (
//           <div className="text-[11px] text-gray-500">
//             Pick an item from the worklist.
//           </div>
//         ) : (
//           <div className="space-y-3">

//             {/* Sample Status */}
//             <div className="flex items-center gap-2">
//               <span className="text-[11px] font-semibold text-gray-600">
//                 Status:
//               </span>

//               {/* <LaboratoryStatusBadge
//                 status={(sample.sample?.status ?? sample.status) as any}
//               /> */}
//               <WorklistStatusBadge
//                 status={sample?.sample?.status}
//             />
//             </div>

//             {/* Sample Type */}
//             <div className="text-[11px]">
//               <span className="font-semibold">
//                 Sample type:
//               </span>{" "}
//               {sample.sample?.sampleType ?? "-"}
//             </div>

//             {/* Barcode */}
//             <div className="text-[11px]">
//               <span className="font-semibold">
//                 Barcode:
//               </span>{" "}
//               {sample.sample?.barcode ?? "-"}
//             </div>

//             {/* Analyses */}
//             {sample.analyses.length === 0 ? (
//               <div className="rounded border border-dashed border-gray-300 p-4 text-[11px] text-gray-500">
//                 No analyses available.
//               </div>
//             ) : (
//               sample.analyses.map((analysis) => (
//                 <div
//                   key={analysis.id}
//                   className="rounded border border-gray-300 p-3"
//                 >
//                   <div className="font-semibold">
//                     {analysis.analysis}
//                   </div>

//                   <div className="text-xs text-gray-500">
//                     {analysis.category}
//                   </div>

//                   <div className="text-xs text-blue-600">
//                     {analysis.code}
//                   </div>

//                   <div className="mt-2">
//                     {/* <LaboratoryStatusBadge
//                       status={analysis.status as any}
//                     /> */}
//                     <WorklistStatusBadge
//                         status={sample?.sample?.status}
//                     />
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default LaboratoryDetails;



//src/components/laboratory/LaboratoryDetails.tsx

import React from "react";

import WorklistStatusBadge from "../worklist/WorklistStatusBadge";

import type {
  LaboratoryWorklistItem,
} from "../../features/laboratory/types";

type Props = {
  sample: LaboratoryWorklistItem | null;
};

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleString()
    : "-";

const LaboratoryDetails: React.FC<Props> = ({
  sample,
}) => {
  if (!sample) {
    return (
      <section className="rounded border border-gray-300 bg-white">
        <header className="border-b px-4 py-3">
          <div className="text-sm font-semibold">
            Ordered analyses / investigations
          </div>

          <div className="text-xs text-gray-500">
            Select a worklist item
          </div>
        </header>

        <div className="p-4 text-sm text-gray-500">
          Pick an item from the worklist.
        </div>
      </section>
    );
  }

  return (
    <section className="rounded border border-gray-300 bg-white">

      <header className="border-b px-4 py-3">

        <div className="text-sm font-semibold">
          Ordered analyses / investigations
        </div>

        <div className="text-xs text-gray-500">
          {sample.patientName} • {sample.orderingUnit}
        </div>

      </header>

      <div className="space-y-5 p-4">

        {/* Sample */}

        <div className="rounded border bg-gray-50 p-3">

          <div className="flex items-center justify-between">

            <div>

              <div className="text-xs text-gray-500">
                Sample
              </div>

              <div className="font-medium">
                {sample.sample?.sampleType ?? "-"}
              </div>

            </div>

            <WorklistStatusBadge
              status={sample.sample?.status}
            />

          </div>

        </div>

        {/* Sample Information */}

        <div>

          <div className="mb-3 text-sm font-semibold">
            Sample Information
          </div>

          <div className="grid grid-cols-2 gap-3">

            <Info
              label="Barcode"
              value={sample.sample?.barcode}
            />

            <Info
              label="Sample Type"
              value={sample.sample?.sampleType}
            />

            <Info
              label="Collected"
              value={formatDate(sample.sample?.collectedAt)}
            />

            <Info
              label="Received"
              value={formatDate(sample.sample?.receivedAt)}
            />

            <Info
              label="Processed"
              value={formatDate(sample.sample?.processedAt)}
            />

            <Info
              label="Completed"
              value={formatDate(sample.sample?.completedAt)}
            />

          </div>

        </div>

        {/* Analyses */}

        <div>

          <div className="mb-3 text-sm font-semibold">
            Requested Analyses ({sample.analyses.length})
          </div>

          <div className="space-y-2">

            {sample.analyses.map((analysis) => (

              <div
                key={analysis.id}
                className="rounded border p-3"
              >

                <div className="flex justify-between">

                  <div>

                    <div className="font-medium">
                      {analysis.analysis}
                    </div>

                    <div className="text-xs text-gray-500">
                      {analysis.category}
                    </div>

                    <div className="text-xs text-blue-600">
                      {analysis.code}
                    </div>

                  </div>

                  <WorklistStatusBadge
                    status={analysis.status}
                  />

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
};

type InfoProps = {
  label: string;
  value?: React.ReactNode;
};

const Info: React.FC<InfoProps> = ({
  label,
  value,
}) => (
  <div>
    <div className="text-xs text-gray-500">
      {label}
    </div>

    <div className="mt-1 rounded border bg-gray-50 px-3 py-2 text-sm">
      {value || "-"}
    </div>
  </div>
);

export default LaboratoryDetails;