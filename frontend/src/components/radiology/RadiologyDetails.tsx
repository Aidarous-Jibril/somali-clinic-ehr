// //src/components/radiology/RadiologyDetails.tsx
// import React from "react";

// type Props = {
//   order: any | null;
// };

// const Field = ({ label, value, }: { label: string; value?: React.ReactNode; }) => (
//   <div>
//     <div className="text-[11px] text-gray-500">
//       {label}
//     </div>

//     <div className="mt-1 rounded border bg-gray-50 px-3 py-2 text-sm min-height-[40px]">
//       {value || "-"}
//     </div>
//   </div>
// );

// const RadiologyDetails: React.FC<Props> = ({ order, }) => {
//   if (!order) {
//     return (
//       <section className="rounded border border-gray-300 bg-white p-6">
//         <div className="text-gray-500">
//           Select an examination.
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="rounded border border-gray-300 bg-white">
//       {/* Header */}
//       <div className="border-b px-4 py-3">
//         <div className="text-[14px] font-semibold">
//           Examination Details
//         </div>

//         <div className="text-xs text-gray-500">
//           {order.patientName}
//         </div>
//       </div>

//       <div className="space-y-4 p-4">

//         <Field
//           label="Examination"
//           value={order.examination}
//         />

//         <Field
//           label="Modality"
//           value={order.modality}
//         />

//         <Field
//           label="Status"
//           value={order.status}
//         />

//         <Field
//           label="Patient"
//           value={order.patientName}
//         />

//         <Field
//           label="Requester"
//           value={order.requester}
//         />

//         <Field
//           label="Ordering Unit"
//           value={order.orderingUnit}
//         />

//         <Field
//           label="Ordered At"
//           value={
//             order.orderedAt
//               ? new Date(
//                   order.orderedAt
//                 ).toLocaleString()
//               : "-"
//           }
//         />

//         <Field
//           label="Resulted At"
//           value={
//             order.resultedAt
//               ? new Date(
//                   order.resultedAt
//                 ).toLocaleString()
//               : "-"
//           }
//         />

//         <Field
//           label="Reviewed At"
//           value={
//             order.reviewedAt
//               ? new Date(
//                   order.reviewedAt
//                 ).toLocaleString()
//               : "-"
//           }
//         />

//         <Field
//           label="Impression"
//           value={order.report}
//         />

//         <Field
//           label="Detailed Findings"
//           value={order.reportComment}
//         />

//         <Field
//           label="Overall Result"
//           value={order.resultFlag}
//         />

//       </div>
//     </section>
//   );
// };

// export default RadiologyDetails;


import React from "react";

import WorklistStatusBadge from "../worklist/WorklistStatusBadge";

import type {
  RadiologyWorklistItem,
} from "../../features/radiology/types";

type Props = {
  order: RadiologyWorklistItem | null;
};

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleString()
    : "-";

const Field = ({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
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

const RadiologyDetails: React.FC<Props> = ({
  order,
}) => {
  if (!order) {
    return (
      <section className="rounded border border-gray-300 bg-white">

        <header className="border-b px-4 py-3">

          <div className="text-sm font-semibold">
            Examination Details
          </div>

          <div className="text-xs text-gray-500">
            Select an examination
          </div>

        </header>

        <div className="p-4 text-sm text-gray-500">
          Select an examination from the worklist.
        </div>

      </section>
    );
  }

  return (
    <section className="rounded border border-gray-300 bg-white">

      <header className="border-b px-4 py-3">

        <div className="text-sm font-semibold">
          Examination Details
        </div>

        <div className="text-xs text-gray-500">
          {order.patientName} • {order.orderingUnit}
        </div>

      </header>

      <div className="space-y-5 p-4">

        {/* Summary */}

        <div className="rounded border bg-gray-50 p-3">

          <div className="flex items-center justify-between">

            <div>

              <div className="text-xs text-gray-500">
                Examination
              </div>

              <div className="font-medium">
                {order.examination}
              </div>

            </div>

            <WorklistStatusBadge
              status={order.status}
            />

          </div>

        </div>

        {/* Examination Information */}

        <div>

          <div className="mb-3 text-sm font-semibold">
            Examination Information
          </div>

          <div className="grid grid-cols-2 gap-3">

            <Field
              label="Patient"
              value={order.patientName}
            />

            <Field
              label="MRN"
              value={order.personId}
            />

            <Field
              label="Modality"
              value={order.modality}
            />

            <Field
              label="Requester"
              value={order.requester}
            />

            <Field
              label="Ordering Unit"
              value={order.orderingUnit}
            />

            <Field
              label="Ordered At"
              value={formatDate(order.orderedAt)}
            />

            <Field
              label="Resulted At"
              value={formatDate(order.resultedAt)}
            />

            <Field
              label="Reviewed At"
              value={formatDate(order.reviewedAt)}
            />

          </div>

        </div>

        {/* Report */}

        <div>

          <div className="mb-3 text-sm font-semibold">
            Radiology Report
          </div>

          <Field
            label="Impression"
            value={order.impression}
          />

          <div className="mt-3" />

          <Field
            label="Detailed Findings"
            value={order.findings}
          />

          <div className="mt-3" />

          <Field
            label="Overall Result"
            value={order.result}
          />

        </div>

      </div>

    </section>
  );
};

export default RadiologyDetails;