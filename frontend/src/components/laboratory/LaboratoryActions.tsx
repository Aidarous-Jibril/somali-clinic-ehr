// //src/components/laboratory/laboratoryActions.tsx
// import React from "react";
// import { Stack, TextField, } from "@mui/material";
// import type { LaboratoryWorklistItem, } from "../../features/laboratory/types";

// type Props = {
//   sample: LaboratoryWorklistItem | null;
//   showExtended: boolean;
//   onPrint: () => void;
// };

// const LaboratoryActions: React.FC<Props> = ({ sample, showExtended, }) => {
//   return (
//     <section className="rounded border border-gray-300 bg-white">
//       <header className="border-b border-gray-200 px-3 py-2">
//         <div className="text-[13px] font-semibold">
//           Administrative
//         </div>

//         <div className="text-[11px] text-gray-500">
//           Sample metadata
//         </div>
//       </header>

//       <div className="p-3">
//         {!sample ? (
//           <div className="text-[11px] text-gray-500">
//             Select a worklist item.
//           </div>
//         ) : (
//           <Stack spacing={2}>
//             <TextField
//               label="Requester"
//               size="small"
//               value={sample.requester}
//               disabled
//             />

//             <TextField
//               label="Ordering unit"
//               size="small"
//               value={sample.orderingUnit}
//               disabled
//             />

//             <TextField
//               label="Order ID"
//               size="small"
//               value={sample.orderId}
//               disabled
//             />

//             <TextField
//               label="Collected at"
//               size="small"
//               value={
//                 sample.sample?.collectedAt
//                   ? new Date(
//                       sample.sample.collectedAt
//                     ).toLocaleString()
//                   : "-"
//               }
//               disabled
//             />

//             <TextField
//               label="Received at"
//               size="small"
//               value={
//                 sample.sample?.receivedAt
//                   ? new Date(
//                       sample.sample.receivedAt
//                     ).toLocaleString()
//                   : "-"
//               }
//               disabled
//             />

//             <TextField
//               label="Processed at"
//               size="small"
//               value={
//                 sample.sample?.processedAt
//                   ? new Date(
//                       sample.sample.processedAt
//                     ).toLocaleString()
//                   : "-"
//               }
//               disabled
//             />

//             <TextField
//               label="Completed at"
//               size="small"
//               value={
//                 sample.sample?.completedAt
//                   ? new Date(
//                       sample.sample.completedAt
//                     ).toLocaleString()
//                   : "-"
//               }
//               disabled
//             />

//             <TextField
//               label="Barcode"
//               size="small"
//               value={sample.sample?.barcode ?? "-"}
//               disabled
//             />

//             <TextField
//               label="Sample type"
//               size="small"
//               value={sample.sample?.sampleType ?? "-"}
//               disabled
//             />

//             <TextField
//               label="Sample comment"
//               size="small"
//               multiline
//               minRows={3}
//               value={sample.sample?.notes ?? ""}
//               disabled={!showExtended}
//             />
//           </Stack>
//         )}
//       </div>
//     </section>
//   );
// };

// export default LaboratoryActions;



//src/components/laboratory/LaboratoryActions.tsx

import React from "react";
import { Stack, Button } from "@mui/material";

import type {
  LaboratoryWorklistItem,
} from "../../features/laboratory/types";

type Props = {
  sample: LaboratoryWorklistItem | null;
  showExtended: boolean;
  onPrint: () => void;
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

const LaboratoryActions: React.FC<Props> = ({
  sample,
  showExtended,
  onPrint,
}) => {
  if (!sample) {
    return (
      <section className="rounded border border-gray-300 bg-white">

        <header className="border-b px-4 py-3">

          <div className="text-sm font-semibold">
            Administrative
          </div>

          <div className="text-xs text-gray-500">
            Sample metadata
          </div>

        </header>

        <div className="p-4 text-sm text-gray-500">
          Select a worklist item.
        </div>

      </section>
    );
  }

  return (
    <section className="rounded border border-gray-300 bg-white">

      <header className="border-b px-4 py-3">

        <div className="text-sm font-semibold">
          Administrative
        </div>

        <div className="text-xs text-gray-500">
          Sample metadata
        </div>

      </header>

      <div className="p-4">

        <Stack spacing={2}>

          <Field
            label="Requester"
            value={sample.requester}
          />

          <Field
            label="Ordering Unit"
            value={sample.orderingUnit}
          />

          <Field
            label="Sample Type"
            value={sample.sample?.sampleType}
          />

          <Field
            label="Barcode"
            value={sample.sample?.barcode}
          />

          <Field
            label="Collected"
            value={formatDate(sample.sample?.collectedAt)}
          />

          <Field
            label="Received"
            value={formatDate(sample.sample?.receivedAt)}
          />

          <Field
            label="Processed"
            value={formatDate(sample.sample?.processedAt)}
          />

          <Field
            label="Completed"
            value={formatDate(sample.sample?.completedAt)}
          />

          {showExtended && (
            <Field
              label="Notes"
              value={sample.sample?.notes}
            />
          )}

          <Button
            fullWidth
            variant="outlined"
            onClick={onPrint}
          >
            Print Labels
          </Button>

        </Stack>

      </div>

    </section>
  );
};

export default LaboratoryActions;