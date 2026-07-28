// //src/components/radiology/RadiologyActions.tsx
// import React from "react";
// import { Button } from "@mui/material";

// type Props = {
//   order: any | null;
//   onStart?: () => void;
//   onWriteReport?: () => void;
//   onReview?: () => void;
//   onComplete?: () => void;
// };

// const RadiologyActions: React.FC<Props> = ({ order, onStart, onWriteReport, onReview, onComplete, }) => {
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
//           Workflow Actions
//         </div>

//         <div className="text-xs text-gray-500">
//           Radiology examination
//         </div>
//       </div>

//       <div className="space-y-4 p-4">

//         {/* Status */}
//         <div>
//           <div className="text-xs text-gray-500">
//             Current Status
//           </div>

//           <div className="mt-1 rounded bg-blue-50 px-3 py-2 font-semibold text-blue-700">
//             {order.status.replace("_", " ")}
//           </div>
//         </div>

//         {/* Workflow Buttons */}

//         {order.status === "ordered" && (
//           <Button
//             fullWidth
//             variant="contained"
//             onClick={onStart}
//           >
//             Start Examination
//           </Button>
//         )}

//         {order.status === "awaiting_result" && (
//           <Button
//             fullWidth
//             variant="contained"
//             color="secondary"
//             onClick={onWriteReport}
//           >
//             Write Report
//           </Button>
//         )}

//         {order.status === "resulted" && (
//           <Button
//             fullWidth
//             variant="contained"
//             color="success"
//             onClick={onReview}
//           >
//             Review Report
//           </Button>
//         )}

//         {order.status === "reviewed" && (
//           <Button
//             fullWidth
//             variant="contained"
//             color="success"
//             onClick={onComplete}
//           >
//             Complete Examination
//           </Button>
//         )}

//         {order.status === "completed" && (
//           <div className="rounded bg-green-50 p-3 text-sm text-green-700">
//             ✔ Examination has been completed.
//           </div>
//         )}

//       </div>
//     </section>
//   );
// };

// export default RadiologyActions;

import React from "react";
import { Button, Stack } from "@mui/material";

import WorklistStatusBadge from "../worklist/WorklistStatusBadge";

import type {
  RadiologyWorklistItem,
} from "../../features/radiology/types";

type Props = {
  order: RadiologyWorklistItem | null;

  onStart?: () => void;
  onWriteReport?: () => void;
  onReview?: () => void;
  onComplete?: () => void;
};

const RadiologyActions: React.FC<Props> = ({
  order,
  onStart,
  onWriteReport,
  onReview,
  onComplete,
}) => {
  if (!order) {
    return (
      <section className="rounded border border-gray-300 bg-white">

        <header className="border-b px-4 py-3">

          <div className="text-sm font-semibold">
            Workflow Actions
          </div>

          <div className="text-xs text-gray-500">
            Radiology examination
          </div>

        </header>

        <div className="p-4 text-sm text-gray-500">
          Select an examination.
        </div>

      </section>
    );
  }

  return (
    <section className="rounded border border-gray-300 bg-white">

      <header className="border-b px-4 py-3">

        <div className="text-sm font-semibold">
          Workflow Actions
        </div>

        <div className="text-xs text-gray-500">
          Radiology examination
        </div>

      </header>

      <div className="p-4">

        <Stack spacing={2}>

          <div>

            <div className="mb-2 text-xs text-gray-500">
              Current Status
            </div>

            <WorklistStatusBadge
              status={order.status}
            />

          </div>

          {order.status === "ordered" && (
            <Button
              fullWidth
              variant="contained"
              onClick={onStart}
            >
              Start Examination
            </Button>
          )}

          {order.status === "awaiting_result" && (
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={onWriteReport}
            >
              Write Report
            </Button>
          )}

          {order.status === "resulted" && (
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={onReview}
            >
              Review Report
            </Button>
          )}

          {order.status === "reviewed" && (
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={onComplete}
            >
              Complete Examination
            </Button>
          )}

          {order.status === "completed" && (
            <div className="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              ✓ Examination has been completed.
            </div>
          )}

        </Stack>

      </div>

    </section>
  );
};

export default RadiologyActions;